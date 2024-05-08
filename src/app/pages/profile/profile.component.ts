import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/database/db.model';
import { UserService } from 'src/app/core/services/user.service';
import { UserLogged } from 'src/app/core/utils/userLogged';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public listUser: User;
  public userLogged: UserLogged = new UserLogged();
  query: any =
    '$expand=UserRoles($Expand=Role($Select=Name)),Depart($Select=Name),Teammembers($expand=Team($select=name))&$orderby=Id DESC';
  constructor(public service: UserService) {}

  ngOnInit() {
    this.listUser = new User();
    this.loadInfor();
  }

  loadInfor() {
    this.service
      .getListUserByQueryId(this.query, this.userLogged.getCurrentUser().userId)
      .subscribe((data) => {
        this.listUser = data.value[0];
      });
  }
}
