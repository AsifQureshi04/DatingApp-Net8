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
  response!: any;
  member?: Member;
  images: GalleryItem[] = [];

  ngOnInit() : void{
    console.log('member details')
    this.loadMember();
  }

  loadMember(){
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next:member=>{this.response=member;
            this.member = this.response.data[0];
            console.log(this.member?.photos)
            member.photos.map(p =>{
              this.images.push(new ImageItem({src : p.url, thumb: p.url}))
            })
      }
    })
  }
}
