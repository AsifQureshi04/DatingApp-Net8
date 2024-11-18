import { Component, inject } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { Member } from '../../../Models/member';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent {
  memberService = inject(MembersService);
  members : Member[] = [] 
  
  ngOnInit(){
    if(this.memberService.members().length === 0){ 
      this.loadMembers();
    }
  }

  loadMembers(){
    this.memberService.getMembers()
  }

}

