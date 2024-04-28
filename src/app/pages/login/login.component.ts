import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, FormControl, AbstractControl, UntypedFormBuilder, Validators, UntypedFormControl} from '@angular/forms'; 
import { EmailValidators } from 'ngx-validators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  public router: Router;
  public form:UntypedFormGroup;
  public email:UntypedFormControl;
  public password:UntypedFormControl;

  constructor(router:Router, fb:UntypedFormBuilder) {
      this.router = router;
      this.form = fb.group({
          'email': ['', Validators.compose([Validators.required, EmailValidators.normal])],
          'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      });

      this.email = this.form.controls['email'] as UntypedFormControl;
      this.password = this.form.controls['password'] as UntypedFormControl;
  }

  public onSubmit(values: any): void { 
      if (this.form.valid) {
          this.router.navigate(['/']);
      }
  }

  ngAfterViewInit(){
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hide');
    }           
  }

}
