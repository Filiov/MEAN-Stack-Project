import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'register',
    templateUrl: './register.html',
    styleUrls: ['./register.css']
})
export class Register implements OnInit {

    form;
    message;
    messageClass;
    emailValid;
    emailMessage;
    usernameValid;
    usernameMessage;
    processing = false;
    private base64textString: String = '';
    avatar;

    constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
        this.createForm()
    }

    ngOnInit() {
    
    }
    
    createForm() {
        this.form = this.formBuilder.group({
            username: ['', Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(15),
                this.validateUsername
            ])],
            avatar : [''],
            email: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(30),
                this.validateEmail
            ])],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(35),
                this.validatePassword
            ])],
            confirm: ['', Validators.required],
        }, { validators: this.matchingPasswords('password', 'confirm')})
    }

    disableForm() {
        this.form.controls['username'].disable();
        this.form.controls['email'].disable();
        this.form.controls['password'].disable();
        this.form.controls['confirm'].disable();
        this.form.controls['avatar'].disable();
    }

    enableForm() {
        this.form.controls['username'].enable();
        this.form.controls['email'].enable();
        this.form.controls['password'].enable();
        this.form.controls['confirm'].enable();
        this.form.controls['avatar'].enable();
    }

    validateEmail(controls) {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (regExp.test(controls.value)) {
            return null;
        } else {
            return { 'validateEmail': true }
        }
    }

    validateUsername(controls) {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        if (regExp.test(controls.value)) {
            return null;
        } else {
            return { 'validateUsername': true }
        }
    }

    validatePassword(controls) {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        if (regExp.test(controls.value)) {
            return null;
        } else {
            return { 'validatePassword': true }
        }
    }

    matchingPasswords(password, confirm) {
        return (group: FormGroup) => {
            if (group.controls[password].value === group.controls[confirm].value) {
                return null;
            } else {
                return { 'matchingPasswords': true }
            }
        }
    }

    onRegisterSubmit() {
        this.processing = true;
        this.disableForm();
        const user = {
            email: this.form.get('email').value,
            username: this.form.get('username').value,
            password: this.form.get('password').value,
            avatar: this.avatar
    }
        this.authService.registerUser(user).subscribe(data => {
            if (!data.success) {
                this.messageClass = 'alert alert-danger';
                this.message = data.message;
                this.processing = false;
                this.enableForm();
            } else {
                this.messageClass = 'alert alert-success';
                this.message = data.message;
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 2000)
            }
        });  
    }

    checkEmail() {
        this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
            if (!data.success) {
                this.emailValid = false;
                this.emailMessage = data.message;
            } else {
                this.emailValid = true;
                this.emailMessage = data.message;
            }
        });
    }

    checkUsername() {
        this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
            if (!data.success) {
                this.usernameValid = false;
                this.usernameMessage = data.message;
            } else {
                this.usernameValid = true;
                this.usernameMessage = data.message;
            }
        });
    }

    handleFileSelect(evt) {
        const files = evt.target.files;
        const file = files[0];
    
        if (files && file) {
          const reader = new FileReader();
            
          reader.onload = this._handleReaderLoaded.bind(this);
            
          reader.readAsDataURL(file);
        }
      }
    
      _handleReaderLoaded(readerEvt) {
        const binaryString = readerEvt.target.result;
        this.avatar = binaryString;
        this.base64textString = btoa(binaryString);
        console.log(binaryString);
      }
    


}
