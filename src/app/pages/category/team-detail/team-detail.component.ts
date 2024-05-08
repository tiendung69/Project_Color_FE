import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Team, TeamMember } from 'src/app/core/models/database/db.model';
import { TeamService } from 'src/app/core/services/team.service';
import { UserService } from 'src/app/core/services/user.service';
import { TeamMemberService } from 'src/app/core/services/team-member.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {
  public listTeam: Team;
  listUser: Array<any> = [];
  idTeam: any;
  getTeamUserCheck: any[] = [];
  userText: any;
  private readonly canGoBack: boolean;
  public dropdownFields: Object;
  editMode: boolean;
  warrning: boolean = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public serviceTeam: TeamService,
    public service: UserService,
    public serviceMemberTeam: TeamMemberService,
    private readonly location: Location,
    private readonly cdr: ChangeDetectorRef,
    public toastService : ToastrService
  ) {
    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
  }
  ngOnInit(): void {
    this.idTeam = this.route.snapshot.paramMap.get('id');
    this.listTeam = new Team();
    this.loadUser();
    this.editMode = false;
    this.dropdownFields = { text: 'UserName', value: 'Id' };
  }
  onInputChange(value: any) {
    const key = value.key;
    const event = value.value;
    const data = { ...this.listTeam, [key]: event };
    this.listTeam = data;
  }
  onChangeUser(value: any) {
    this.userText = value;
  }
  onSubmit() {
    if (!this.idTeam) {
      if (this.listTeam.Name == undefined) {
        this.warrning = true;
      } else {
        this.serviceTeam.CreateTeam(this.listTeam).subscribe((data) => {
          console.log('Add successfully');
          this.idTeam = data.Id;
          this.router.navigate(['../edit', this.idTeam], {
            relativeTo: this.route,
          });
          const users: any[] = [];
          for (let i = 0; i < this.userText.length; i++) {
            let userTeam = new TeamMember();
            (userTeam.TeamId = data.Id), (userTeam.UserId = this.userText[i]);
            this.serviceMemberTeam.CreateTeamMember(userTeam).subscribe(() => {
              console.log('Create Successfully');
            });
          }
        });

        this.toastService.success('Thêm mới tổ đội thành công!', 'Thành công');
      }
    }
    if (this.idTeam) {
      // console.log(this.listTeam);
      if (this.listTeam.Name == '') {
        this.warrning = true;
      } else {
        this.serviceTeam
          .UpdateTeam(this.listTeam, this.idTeam)
          .subscribe(() => {
            console.log('Update Successfully');

        this.toastService.success('Cập nhật thông tin tổ đội thành công!', 'Thành công');
          });
        const newUser = this.userText;
        const oldUser = this.getTeamUserCheck;
        const filteredListNew = newUser.filter(
          (item: any) => !oldUser.includes(item)
        );
        const filteredListOld = oldUser.filter(
          (item: any) => !newUser.includes(item)
        );
        if (filteredListNew.length > 0) {
          for (let index = 0; index < filteredListNew.length; index++) {
            const element = filteredListNew[index];
            let formData = {
              TeamId: this.idTeam,
              UserId: element,
            };
            this.serviceMemberTeam
              .CreateTeamMember(formData)
              .subscribe((data) => {
                console.log('Create Successfully');
              });
          }
        }
        if (filteredListOld.length > 0) {
          for (let index = 0; index < filteredListOld.length; index++) {
            const element = filteredListOld[index];
            const userMember = this.listTeam.TeamMembers.filter((item: any) =>
              filteredListOld.includes(item.UserId)
            );
            const x = userMember[index].Id;
            this.serviceMemberTeam.DeleteTeamMember(x).subscribe(() => {
              console.log('Delete Successfuly');
            });
          }
        }
      }
    }
  }

  loadUser() {
    this.service.getAllUser().subscribe((data: any) => {
      this.listUser = data.value.filter((item: any) => item.UserName != null);
      if (this.idTeam) {
        this.serviceTeam.getTeamById(this.idTeam).subscribe((data) => {
          this.listTeam = data.value[0];
          this.userText = this.listTeam.TeamMembers.map(
            (userTeam: any) => userTeam.UserId
          );
          this.getTeamUserCheck = this.userText;
          this.cdr.markForCheck();
        });
        this.editMode = true;
      } else {
        this.editMode = false;
      }
    });
  }
  onCancelClick() {
    // if (this.canGoBack) {
    //   // We can safely go back to the previous location as
    //   // we know it's within our app.
    //   this.location.back();
    // } else
    if (!this.idTeam) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      // There's no previous navigation.
      // Here we decide where to go. For example, let's say the
      // upper level is the index page, so we go up one level.
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
}
