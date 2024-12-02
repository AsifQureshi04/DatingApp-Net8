import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../../Models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import { AccountService } from '../../../services/account.service';
import { environment } from '../../../../environments/environment';
import { Photo } from '../../../Models/photo';
import { MembersService } from '../../../services/members.service';
import { DeletePhotoPayload } from '../../../Models/DeletePhotoPayload';


@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, NgClass, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss'
})
export class PhotoEditorComponent implements OnInit {
  private accountService = inject(AccountService);
  private memberService = inject(MembersService)
  member = input.required<Member>();
  photo?: Photo
  uploader?:FileUploader
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl
  memberChange = output<Member>();

  ngOnInit(): void {
    this.initializeUploader();

  }

  fileOverBase(e:any){
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url:this.baseUrl + 'Users/add-photo',
      authToken:'Bearer ' + this.accountService.currentUser()?.securityToken,
      isHTML5:true,
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) =>{
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item,response,success,header) =>{  
        const photo = JSON.parse(response);
        const updatedMember = { ...this.member() };
        const newPhoto: Photo = {
          id: photo.data[0].id, 
          url: photo.data[0].url, 
          isMain: photo.data[0].isMain, 
        };

        updatedMember.photos.push(newPhoto);
        this.memberChange.emit(updatedMember);
        if(photo.data[0].isMain){
          const user = this.accountService.currentUser();
          if(user){
            user.data.url = photo.data[0].url;
            this.accountService.setCurrentUser(user);
          }
        }

        if(photo.data[0].isMain){
           updatedMember.photoUrl = photo.data[0].url

        updatedMember.photos.forEach(p =>{
          if(p.isMain) p.isMain = false;
          if(p.id === photo.data[0].id) p.isMain = true;
        });
      }
        this.memberChange.emit(updatedMember)
        
    }

    this.uploader.onBuildItemForm = (fileItem,form)=>{
      form.append('UserName',this.accountService.currentUser()?.data.userName);
      form.append('IsMain',false);
    }

    this.uploader.onCompleteAll = () =>{
      console.log('All files uploaded');
    }

    this.uploader.onErrorItem = (item,response,status,header) =>{
      console.error('Error',response);
    }
  }

  setMainPhoto(photo:Photo){
    photo.isMain = true
    photo.url = photo.url
    const user = this.accountService.currentUser();
    var username = user?.data.userName as string
    this.memberService.setMainPhoto(photo,username).subscribe({
      next:(response) =>{
        if(user){
          user!.data.url = photo.url
          this.accountService.setCurrentUser(user!)
        }
        const updatedMember = {...this.member()}
        updatedMember.photoUrl = photo.url
        updatedMember.photos.forEach(p=>{
          if(p.isMain) p.isMain = false;
          if(p.id == photo.id) p.isMain = true;
        });
        this.memberChange.emit(updatedMember);

      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  deletePhoto(photo:Photo){
      const deletePhotoPayload : DeletePhotoPayload =  {
        Id : photo.id,
        Username : this.accountService.currentUser()?.data.userName as string
    }
    this.memberService.deletePhoto(deletePhotoPayload).subscribe({
      next:(response) =>{
        const updatedMember = {...this.member()}
        updatedMember.photos = updatedMember.photos.filter(x => x.id !== photo.id);
        this.memberChange.emit(updatedMember);
      },
      error:(error)=>{

      }
    })
  }

}
