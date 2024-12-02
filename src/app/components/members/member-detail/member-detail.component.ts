import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../Models/member';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule,TabsModule,GalleryModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit {
  private memberService = inject(MembersService)
  private route = inject(ActivatedRoute)
  isApiCall : boolean = false;
  member?: Member;
  response?: any;
  images: GalleryItem[] = [];

  ngOnInit() : void{
    this.loadMember();
  }

  loadMember(){
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next:member=>{
            this.member =  member
            // if(member.body.data!)this.member = member.body.data
            this.member?.photos.map((p: { url: any; }) =>{
            this.images.push(new ImageItem({src : p.url, thumb: p.url}))
            })
      }
    })
  }
}
