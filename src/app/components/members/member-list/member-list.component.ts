import { Component, inject } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../../services/account.service';
import { UserParams } from '../../../Models/userParams';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent,PaginationModule,FormsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent {
  memberService = inject(MembersService);
  genderList = [{value:'male',display:'Males'},{value:'female',display:'Females'}]
  
  ngOnInit(){
    if(!this.memberService.paginatedResult()){ 
      this.loadMembers();
    }
  }

  loadMembers(){
    this.memberService.getMembers();
  }

  resetFilters(){
    this.memberService.resetUserParams();
    this.loadMembers()
  }

  pageChanged(event: any) {
      if(this.memberService.userParams().pageNumber !== event.page){
        this.memberService.userParams().pageNumber = event.page;
        this.loadMembers();
      }
    }

}

