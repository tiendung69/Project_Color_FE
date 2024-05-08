import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EditSettingsModel,
  PageSettingsModel,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { Team } from 'src/app/core/models/database/db.model';
import { TeamService } from 'src/app/core/services/team.service';
import { L10n } from '@syncfusion/ej2-base';
import { TeamMemberService } from 'src/app/core/services/team-member.service';
import { ToastrService } from 'ngx-toastr';
import { EmitType } from '@syncfusion/ej2-base';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
L10n.load({
  'en-US': {
    grid: {
      SaveButton: 'Lưu',
      CancelButton: 'Hủy',
      Edit: 'Sửa',
      Add: 'Thêm',
      Delete: 'Xóa',
      EditOperationAlert: 'Hãy chọn một mục để sửa.',
      DeleteOperationAlert: 'Hãy chọn một mục để xóa',
      EmptyRecord: 'Không có dữ để hiển thị.',
      requiredMessage: 'Vui lòng nhập giá trị.',
    },
  },
});
@Component({
  selector: 'app-team-manage',
  templateUrl: './team-manage.component.html',
  styleUrls: ['./team-manage.component.scss'],
})
export class TeamManageComponent implements OnInit {
  listTeam: Team;
  @ViewChild('ejDialog') public dialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container:
    | ElementRef
    | any;
    public targetElement: HTMLElement;
      public hideDialog: EmitType<object> = () => {
      this.dialog.hide();
    };
    
    public initilaizeTarget: EmitType<object> = () => {
      this.targetElement = this.container.nativeElement.parentElement;
    };
  public editSettings?: EditSettingsModel;
  public pageSettings?: PageSettingsModel;
  public messageDelete: boolean = false;
  @ViewChild('grid', { static: false }) public grid: any;
  nameDelete: any;
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  constructor(
    public service: TeamService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
    public serviceMemberTeam: TeamMemberService, 
    public toastService : ToastrService
  ) {}
  ngOnInit(): void {
    this.loadTeam();
    this.pageSettings = { pageSize: 10 };
    this.editSettings = {
      allowAdding: true,
      allowDeleting: true,
      allowEditing: true,
    };
  }
  loadTeam() {
    this.service.getAllTeam().subscribe((data: any) => {
      this.listTeam = data.value;
    });
  }

  actionComplete(args: SaveEventArgs) {
    if (args.requestType === 'beginEdit') {
      const Id = (args.rowData as any).Id;
      this.router.navigate(['./edit', Id], {
        relativeTo: this.route,
      });
    }
    if (args.requestType === 'add') {
      this.router.navigate(['./add'], {
        relativeTo: this.route,
      });
    }
//     if (args.requestType === 'delete') {
//       const deletedTeam = (args.data as any)[0];
//       const x = deletedTeam.Id;
//       this.nameDelete = deletedTeam.Name;
//       const isConfirmed = confirm(
//         `Bạn có muốn xóa tổ đội ${this.nameDelete} không?`
//       );

//       if (isConfirmed == true) {
//         if (deletedTeam.TeamMembers.length > 0) {
//           for (let index = 0; index < deletedTeam.TeamMembers.length; index++) {
//             const element = deletedTeam.TeamMembers[index].Id;
//             this.serviceMemberTeam.DeleteTeamMember(element).subscribe(() => {
//               this.service.DeleteTeam(x).subscribe(() => {});
//             });
//           }
//         } else {
//           this.service.DeleteTeam(x).subscribe(() => {
            
//         this.toastService.success('Xóa thành công!', 'Thành công');
//           });
//         }
//       }
//       if (isConfirmed == false) {
//         args.cancel = true;
//       }
//     }
//   }
// }


if (args.requestType === 'delete') {
  const dataRow = (args.data as Team[])[0];
  args.cancel = true;
  this.dialog.show();
  this.dialog.header = 'Xác nhận xóa tổ đội sản xuất';
  this.dialog.content = 'Bạn có chắc chắn muốn tiếp tục không?';
  this.dialog.animationSettings = {
    effect: 'Fade',
    duration: 100,
    delay: 0,
  };
  this.dialog.buttons = [
    {
      click: this.onConfirmDelete.bind(this, dataRow),
      buttonModel: { content: 'OK', isPrimary: true },
    },
    {
      click: this.hideDialog.bind(this),
      buttonModel: { content: 'Hủy' },
    },
  ];
}
}
onConfirmDelete(dataRow: any) {
  console.log("data row",dataRow)
this.dialog.hide();

if (dataRow.TeamMembers.length > 0) {
  for (let index = 0; index < dataRow.TeamMembers.length; index++) {
    const element = dataRow.TeamMembers[index].Id;
    this.serviceMemberTeam.DeleteTeamMember(element).subscribe(() => {
      this.service.DeleteTeam(dataRow.Id).subscribe(() => {});
      this.loadTeam()
    });
  }
} else {
  this.service.DeleteTeam(dataRow.Id).subscribe(() => {
    this.loadTeam();
  });
}
    this.toastService.success('Xóa thành công!');
  
  () => {
    this.grid.dataSource = this.listTeam;
    this.toastService.warning('Có lỗi xảy ra...');
  }
}
}

