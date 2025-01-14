import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../Models/member';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { PresenceService } from '../../../services/presence.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule,TabsModule,GalleryModule, TimeagoModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit {
  private memberService = inject(MembersService)
  presenceService = inject(PresenceService)
  private route = inject(ActivatedRoute)
  isApiCall : boolean = false;
  member?: Member;
  response?: any;
  images: GalleryItem[] = [];

  ngOnInit() : void{
    console.log('online users',this.presenceService.onlineUsers())
    this.loadMember();
    console.log(this.presenceService.onlineUsers()!)
  }

  loadMember(){
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next:member=>{
            this.member =  member
            if(member.body.data[0]){
              this.member = member.body.data[0]
            }
            console.log('member from details component',this.member)
            this.member?.photos.map((p: { url: any; }) =>{
            this.images.push(new ImageItem({src : p.url, thumb: p.url}))
            })
      }
    })
  }
}
