import { Component, computed, inject, input, InputSignal, NgModule}from '@angular/core';
import { Member } from '../../../Models/member';
import { Router, RouterLink } from '@angular/router';
import { LikesService } from '../../../services/likes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent  {
  private likeService = inject(LikesService)
  member = input.required<Member>();
  private router = inject(Router);
  hasLiked = computed(()=> this.likeService.likeIds().includes((this.member().id)))

  toggleLike(){
    console.log('toggle like')
    this.likeService.toggleLike(this.member().id).subscribe({
      next : () =>{
        if(this.hasLiked()){
          this.likeService.likeIds.update(ids => ids.filter(x => x !== this.member().id))
        }else{
          this.likeService.likeIds.update(ids => [...ids,this.member().id])
        }
      }
    })
  }

  sendMessage(member : any) {
    console.log(member)
    this.router.navigate(['/messages'], { state: { member: member } });
  }
}
