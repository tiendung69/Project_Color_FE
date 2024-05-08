import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import * as dateFns from 'date-fns';
import { vi } from 'date-fns/locale';
import { NgScrollbar } from 'ngx-scrollbar';
import { interval } from 'rxjs';
import { Notify } from 'src/app/core/models/database/db.model';
import { NotifyService } from 'src/app/core/services/notify.service';
import {
  NotifyActionType,
  NotifyObjectType,
  NotifyStatus,
} from 'src/app/core/utils/constant';
import { UserLogged } from 'src/app/core/utils/userLogged';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  public listNoty: Notify[] = [];
  public allNotify: Array<Notify> = [];
  public readNotify: Array<Notify> = [];
  public newNotify: Array<Notify> = [];
  public doneNotify: Array<Notify> = [];
  public currentTab: number = 0;
  private userLogged: UserLogged = new UserLogged();

  @ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;
  constructor(
    private notifyService: NotifyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    route.queryParams.subscribe((p) => {
      this.onSuccessUpdate();
    });
  }

  ngOnInit() {
    this.onSuccessUpdate();
    interval(20000).subscribe(() => this.onSuccessUpdate());
    // this.onGetAllNotify();
    // this.onGetAllReadNotify();
    // this.onGetAllDoneNotify();
    // this.onGetAllNewNotify();
  }
  ngAfterViewInit() {
    const doc = document.getElementsByClassName('main-content');
    const list = document.getElementById('scroll-list');
    if (doc && list) {
      list.style.height = `${doc[0].clientHeight - 140}px`;
    }
  }
  onGetAllNotify() {
    const userId = this.userLogged.getCurrentUser().userId;
    this.notifyService
      .getNotifyByQuery(
        `$Filter=UserId eq ${userId}&$OrderBy=CreatedAt%20desc&$count=true`
      )
      .subscribe((res) => {
        this.allNotify = res.value;
        if (this.currentTab === 0) {
          this.listNoty = this.allNotify;
        }
      });
  }
  onGetAllReadNotify() {
    const userId = this.userLogged.getCurrentUser().userId;

    this.notifyService
      .getNotifyByQuery(
        `$Filter=Status eq ${NotifyStatus.READ} and UserId eq ${userId}&$OrderBy=CreatedAt%20desc&$count=true`
      )
      .subscribe(
        (res) => {
          this.readNotify = res.value;
          if (this.currentTab === 2) {
            this.listNoty = this.readNotify;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  onGetAllDoneNotify() {
    const userId = this.userLogged.getCurrentUser().userId;

    this.notifyService
      .getNotifyByQuery(
        `$Filter=Status eq ${NotifyStatus.DONE}and UserId eq ${userId}&$OrderBy=CreatedAt%20desc&$count=true`
      )
      .subscribe(
        (res) => {
          this.doneNotify = res.value;
          if (this.currentTab === 3) {
            this.listNoty = this.doneNotify;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  onGetAllNewNotify() {
    const userId = this.userLogged.getCurrentUser().userId;

    this.notifyService
      .getNotifyByQuery(
        `$Filter=Status eq ${NotifyStatus.NEW}and UserId eq ${userId}&$OrderBy=CreatedAt%20desc&$count=true`
      )
      .subscribe(
        (res) => {
          this.newNotify = res.value;
          if (this.currentTab === 1) {
            this.listNoty = this.newNotify;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  renderDateTime(date: Date) {
    if (date) {
      const viTime = dateFns.formatRelative(
        dateFns.subDays(date, 0),
        new Date(),
        {
          locale: vi,
        }
      );
      const firstLetter = viTime.charAt(0);
      const firstLetterCap = firstLetter.toUpperCase();
      const remainingLetters = viTime.slice(1);
      const capitalizedviTime = firstLetterCap + remainingLetters;
      return capitalizedviTime;
    } else {
      return '';
    }
  }
  onReadNotify(notify: Notify) {
    // console.log('notify neee', notify);

    if (
      notify.Status === NotifyStatus.DONE ||
      notify.Status === NotifyStatus.READ
    ) {
      switch (notify.ObjectType) {
        case NotifyObjectType.TOPIC:
          this.router.navigate([
            '/quan-ly-tien-ky/de-tai/edit',
            notify.ObjectId,
          ]);
          break;
        case NotifyObjectType.OUTLINE:
          this.router.navigate([
            '/quan-ly-tien-ky/de-cuong/edit',
            notify.ObjectId,
          ]);
          break;
        case NotifyObjectType.PLANPREPROD:
        case NotifyObjectType.ENDPREPRODUCT:
          this.router.navigate([
            '/quan-ly-tien-ky/san-xuat-tien-ky/edit',
            notify.ObjectId,
          ]);
          break;

        case NotifyObjectType.POSTPLANPROD:
        case NotifyObjectType.ENDPOSTPLAN:
          this.router.navigate([
            '/quan-ly-san-xuat-hau-ky/dung-hau-ky-phim/edit',
            notify.ObjectId,
          ]);
          break;
        case NotifyObjectType.MOVIEAPPROVAL:
          this.router.navigate([
            '/duyet-phim/phim-duoc-giao/edit',
            notify.ObjectId,
          ]);
          break;
        default:
          break;
      }
    } else {
      localStorage.setItem('notify', JSON.stringify(this.newNotify.length - 1));
      this.notifyService
        .UpdateNotify({ ...notify, Status: NotifyStatus.READ }, notify.Id)
        .subscribe((res) => {
          if (notify.ActionType === NotifyActionType.DELETE) {
            this.onSuccessUpdate();
          } else {
            switch (notify.ObjectType) {
              case NotifyObjectType.TOPIC:
                this.router.navigate([
                  '/quan-ly-tien-ky/de-tai/edit',
                  notify.ObjectId,
                ]);
                break;
              case NotifyObjectType.OUTLINE:
                this.router.navigate([
                  '/quan-ly-tien-ky/de-cuong/edit',
                  notify.ObjectId,
                ]);
                break;
              case NotifyObjectType.PLANPREPROD:
              case NotifyObjectType.ENDPREPRODUCT:
                this.router.navigate([
                  '/quan-ly-tien-ky/san-xuat-tien-ky/edit',
                  notify.ObjectId,
                ]);
                break;

              case NotifyObjectType.POSTPLANPROD:
              case NotifyObjectType.ENDPOSTPLAN:
                this.router.navigate([
                  '/quan-ly-san-xuat-hau-ky/dung-hau-ky-phim/edit',
                  notify.ObjectId,
                ]);
                break;
              case NotifyObjectType.MOVIEAPPROVAL:
                if (notify.ActionType === NotifyActionType.APPROVE) {
                  this.router.navigate([
                    '/duyet-phim/hoi-dong-duyet-phim/edit',
                    notify.ObjectId,
                  ]);
                } else {
                  this.router.navigate([
                    '/duyet-phim/phim-duoc-giao/edit',
                    notify.ObjectId,
                  ]);
                }
                break;

              default:
                this.onSuccessUpdate();
                break;
            }
          }
        });
    }
  }
  onDoneNotify(notify: Notify) {
    this.notifyService
      .UpdateNotify({ ...notify, Status: NotifyStatus.DONE }, notify.Id)
      .subscribe((res) => {
        this.onSuccessUpdate();
        console.log(res);
      });
  }
  switchTab(tab: number) {
    switch (tab) {
      case 0:
        this.listNoty = this.allNotify;
        this.currentTab = 0;
        break;
      case 1:
        this.listNoty = this.newNotify;
        this.currentTab = 1;
        break;
      case 2:
        this.currentTab = 2;
        this.listNoty = this.readNotify;
        break;
      case 3:
        this.currentTab = 3;
        this.listNoty = this.doneNotify;
        break;
      default:
        this.currentTab = 0;
        this.listNoty = this.allNotify;
    }
    this.onSuccessUpdate();
  }
  onSuccessUpdate() {
    this.onGetAllNotify();
    this.onGetAllNewNotify();
    this.onGetAllReadNotify();
    this.onGetAllDoneNotify();
  }
  displayHtmlContent(e: Notify) {
    const a = document.getElementById(`content-${e.Id}`);
    if (a) {
      a.innerHTML = e.Detail;
    }
  }
  renderNumberNotify(countNewNotify: number) {
    if (countNewNotify > 99) {
      return '99+';
    }
    return countNewNotify;
  }
  displayHtmlTitle(e: Notify) {
    const a = document.getElementById(`title-${e.Id}`);
    if (a) {
      a.innerHTML = e.Title;
    }
  }
}
