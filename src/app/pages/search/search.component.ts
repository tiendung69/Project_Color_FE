import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PageSettingsModel,
  EditSettingsModel,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { SearchService } from 'src/app/core/services/search.service';
import { VideoService } from 'src/app/core/services/video.service';
import { CommonCategoriesType, TopicType } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent implements OnInit {
  public searchValue: any;
  public dataSearch: any[] = [];
  public choosing: number;
  public pageSettings?: PageSettingsModel;
  public editSettings?: EditSettingsModel;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private searchService: SearchService,
    private videoService: VideoService
  ) {
    route.queryParams.subscribe((p) => {
      this.searchValue = this.route.snapshot.queryParams?.['q'];
      this.onGetSearchData();
    });
  }

  ngOnInit() {
    // this.searchValue = this.route.snapshot.queryParams?.['q'];
    // console.log('this.searchValue', this.searchValue);
    // this.onGetSearchData();
  }
  ngOnChanges() {
    // console.log('cbange');
    // this.searchValue = this.route.snapshot.queryParams?.['q'];
    // this.onGetSearchData();
  }
  onGetSearchData() {
    if (this.searchValue) {
      this.searchService.getDataSearchByDB(this.searchValue).subscribe(
        (data) => {
          // Process search results
          this.dataSearch = data;
          if (this.dataSearch[0]?.tableName == 'Topic') {
            this.choosing = 0;
            if (this.dataSearch[0].type == TopicType.OUTLINE) {
              this.renderTypeTopic(1, this.choosing);
            }
            if (this.dataSearch[0].type == TopicType.TOPIC) {
              this.renderTypeTopic(0, this.choosing);
            }
          }
          if (this.dataSearch[0]?.tableName == 'Commoncategory') {
            this.choosing = 1;
            if (this.dataSearch[0].type == CommonCategoriesType.DEPARTMENT) {
              this.renderTypeTopic(CommonCategoriesType.DEPARTMENT, 1);
            }
          }
        },
        (error) => {
          // Handle error
          this.dataSearch = [];
        }
      );
    }
  }
  rowSelected(args: any) {
    if (args.rowData?.tableName === 'Topic') {
      if (args.rowData.type == TopicType.OUTLINE) {
        this.router.navigate(
          [`/quan-ly-tien-ky/de-cuong/edit/${args.rowData.dbId}`],
          {
            // queryParams: { q: args.rowData.dbId },
          }
        );
      }
      if (args.rowData.type == TopicType.TOPIC) {
        this.router.navigate(
          [`/quan-ly-tien-ky/de-tai/edit/${args.rowData.dbId}`],
          {
            // queryParams: { q: args.rowData.dbId },
          }
        );
      }
    }
    if (args.rowData?.tableName === 'Commoncategory') {
      switch (args.rowData.type) {
        case CommonCategoriesType.DEPARTMENT:
          this.router.navigate(['/danh-muc/phong-ban'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        case CommonCategoriesType.PROVINCE:
          this.router.navigate(['/danh-muc/thanh-pho'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        case CommonCategoriesType.DISTRICTS:
          this.router.navigate(['/danh-muc/quan-huyen'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        case CommonCategoriesType.COMMUNE:
          this.router.navigate(['/danh-muc/xa-phuong'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        case CommonCategoriesType.TVSTATION:
          this.router.navigate(['/danh-muc/dai-truyen-hinh'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        case CommonCategoriesType.TVCHANNEL:
          this.router.navigate(['/danh-muc/kenh-truyen-hinh'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        case CommonCategoriesType.FILM:
          this.router.navigate(['/danh-muc/phim'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        case CommonCategoriesType.TOPIC:
          this.router.navigate(['/danh-muc/de-tai'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        case CommonCategoriesType.OUTLINE:
          this.router.navigate(['/danh-muc/de-cuong'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        case CommonCategoriesType.COST:
          this.router.navigate(['/danh-muc/chi-phi'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        case CommonCategoriesType.ROLE:
          this.router.navigate(['/danh-muc/nhom-quyen'], {
            queryParams: { q: args.rowData.dbId },
          });
          break;

        default:
          '';
          break;
      }
    }
    if (args.rowData?.tableName === 'UploadPart') {
      this.router.navigate(['/upload'], {
        // queryParams: { q: args.rowData.dbId },
      });
    }
    if (args.rowData?.tableName === 'Directory') {
      this.router.navigate(['/directory/edit', args.rowData.dbId], {
        queryParams: {},
      });
    }
    if (args.rowData?.tableName === 'Upload') {
      this.router.navigate(['/upload/edit', args.rowData.dbId], {
        queryParams: {},
      });
    }
    if (args.rowData?.tableName === 'user') {
      this.router.navigate(['/user/edit', args.rowData.dbId], {
        queryParams: {},
      });
    }
  }
  renderName(type: number, item: any, name: any) {
    if (item == 'Commoncategory' && name == 'Name') {
      if (type === CommonCategoriesType.DEPARTMENT) {
        return 'Tên phòng ban';
      } else if (type === CommonCategoriesType.PROVINCE) {
        return 'Tỉnh/ Thành phố';
      } else if (type === CommonCategoriesType.DISTRICTS) {
        return 'Quận/ Huyện';
      } else if (type === CommonCategoriesType.COMMUNE) {
        return 'Xã/ Phường';
      } else if (type === CommonCategoriesType.TVSTATION) {
        return 'Đài truyền hình';
      } else if (type === CommonCategoriesType.TVCHANNEL) {
        return 'Kênh truyền hình';
      } else if (type === CommonCategoriesType.FILM) {
        return 'Loại Phim';
      } else if (type === CommonCategoriesType.TOPIC) {
        return 'Loại Đề Tài';
      } else if (type === CommonCategoriesType.OUTLINE) {
        return 'Loại Đề Cương';
      } else if (type === CommonCategoriesType.COST) {
        return 'Loại Chi Phí';
      } else if (type === CommonCategoriesType.ROLE) {
        return 'Tên Nhóm Quyền';
      } else {
        return '';
      }
    }
    if (item == 'Commoncategory' && name == 'Description') {
      return 'Mô tả';
    }
    if (item == 'Topic' && name == 'Name') {
      if (type == TopicType.TOPIC && name == 'Name') {
        return 'Tên đề tài';
      }
      if (type == TopicType.OUTLINE) {
        return 'Tên đề cương';
      }
    }
    if (item == 'Topic' && name == 'Description') {
      return 'Mô tả';
    }

    return '';
  }

  renderTypeTopic(type: number, item: any) {
    if (item == 'Commoncategory') {
      if (type === CommonCategoriesType.DEPARTMENT) {
        return 'Phòng ban';
      } else if (type === CommonCategoriesType.PROVINCE) {
        return 'Thành phố';
      } else if (type === CommonCategoriesType.DISTRICTS) {
        return 'Quận huyện';
      } else if (type === CommonCategoriesType.COMMUNE) {
        return 'Xã phường';
      } else if (type === CommonCategoriesType.TVSTATION) {
        return 'Đài truyền hình';
      } else if (type === CommonCategoriesType.TVCHANNEL) {
        return 'Kênh truyền hình';
      } else if (type === CommonCategoriesType.FILM) {
        return 'Phim';
      } else if (type === CommonCategoriesType.TOPIC) {
        return 'Đề tài';
      } else if (type === CommonCategoriesType.OUTLINE) {
        return 'Đề cương';
      } else if (type === CommonCategoriesType.COST) {
        return 'Chi phí';
      } else if (type === CommonCategoriesType.ROLE) {
        return 'Nhóm quyền';
      } else {
        return '';
      }
    }
    if (item == 'Topic') {
      if (type == TopicType.TOPIC) {
        return 'Đề tài';
      }
      if (type == TopicType.OUTLINE) {
        return 'Đề cương';
      }
    }
    return '';
  }
}
