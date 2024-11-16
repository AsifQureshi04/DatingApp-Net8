import { Component, inject } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { Member } from '../../../Models/member';
import { RouterLink } from '@angular/router';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent {
  private memberService = inject(MembersService);
  members : Member[] = [];

  ngOnInit(){
    this.loadMembers();
  }

  loadMembers(){
    this.memberService.getMembers().subscribe({
      next : members => {this.members = members.data;
         console.log('members is ',this.members)}
    })
  }

}

