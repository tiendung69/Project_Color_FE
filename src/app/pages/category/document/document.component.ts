import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataManager, Query } from '@syncfusion/ej2-data';
import {
  PageSettingsModel,
  EditSettingsModel,
  ToolbarItems,
  IEditCell,
  SaveEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { Commoncategory } from 'src/app/core/models/database/db.model';
import { CommoncategoryService } from 'src/app/core/services/commoncategory.service';
import { environment } from 'src/environments/environment';
import { CustomService } from 'src/app/core/services/custom.service';
import { Router } from '@angular/router';
import { CommonCategoriesType } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent implements OnInit {
  public query: Query;
  public pageSettings?: PageSettingsModel;
  public editSettings?: EditSettingsModel;
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];

  public listCommoncategory: DataManager;
  public detailCommoncategory: Commoncategory = new Commoncategory();
  public validationNameRules: Object;
  public validationTypeRules: Object;
  public typeNumericParams?: IEditCell;
  public validationDescriptionRules: Object;
  public validationParentIdRules: Object;
  public parentidNumericParams?: IEditCell;

  constructor(
    private commoncategoryService: CommoncategoryService,
    private router: Router,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    this.validationTypeRules = {
      required: true,
      regex: ['^[0-9]+$', 'Invalid number'],
    };
    this.validationParentIdRules = {
      required: true,
      regex: ['^[0-9]+$', 'Invalid number'],
    };
  }
  ngOnInit(): void {
    this.onGetListCommoncategory();
    this.detailCommoncategory = new Commoncategory();
    this.pageSettings = { pageSize: 10 };
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
  }

  onGetListCommoncategory() {
    this.query = new Query().where(
      'Type',
      'equal',
      CommonCategoriesType.DOCUMENT
    );

    this.listCommoncategory = new DataManager(
      { url: environment.apiUrl + '/Commoncategories' },
      this.query,
      new CustomService(this.router)
    );
    // this.commoncategoryService.getAllCommonCategory().subscribe((data: any) => {
    //   this.listCommoncategory = data.value;
    // });
  }

  onInputChange(event: any) {
    console.log('event', event);
  }

  actionComplete(args: SaveEventArgs) {
    if (
      (args as any).requestType === 'beginEdit' ||
      (args as any).requestType === 'add'
    ) {
      const dialog = (args as any).dialog;
      dialog.showCloseIcon = false;
      dialog.width = 550;
      dialog.header =
        (args as any).requestType === 'beginEdit'
          ? 'Edit Commoncategory'
          : 'Add new Commoncategory';
    }
  }

  actionBegin(args: SaveEventArgs) {
    console.log('actionBegin', args);

    if (args.action === 'add' && args.requestType === 'save') {
      const detail = args.data as Commoncategory;
      this.commoncategoryService
        .CreateCommoncategory(detail)
        .subscribe((data: Commoncategory) => {
          this.onGetListCommoncategory();
        });
    }

    if (args.action === 'edit' && args.requestType === 'save') {
      const detail = args.data as Commoncategory;
      this.commoncategoryService
        .UpdateCommonCategory(detail, detail.Id)
        .subscribe((data: Commoncategory) => {
          this.onGetListCommoncategory();
        });
    }

    if (args.requestType === 'delete') {
      const x = (args.data as Commoncategory[])[0].Id;
      this.commoncategoryService
        .DeleteCommonCategory(x)
        .subscribe((data: Commoncategory) => {
          this.onGetListCommoncategory();
        });
    }
  }
}
