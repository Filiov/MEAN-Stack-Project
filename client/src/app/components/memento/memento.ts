import { Component, Input, } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { MementoService } from '../../services/memento.service';

@Component({
  selector: "memento",
  templateUrl: "./memento.html",
  styleUrls: ["./memento.css"]
})
export class Memento {
  messageClass;
  message;
  newPost = false;
  loadingPosts = false;
  form;
  private base64textString: String = '';
  img;
  processing;
  username;
  mementoPosts;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private mementoService: MementoService) {
      this.createNewMementoForm();
  }

  createNewMementoForm() {
    this.form = this.formBuilder.group({
        title: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(5),
          this.alphaNumericValidation
        ])],
        body: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(5)
        ])],
        img: ['',]
  })
  }

  enableFormNewMementoForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
    this.form.get('img').enable();
  }

  disableFormNewMementoForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
    this.form.get('img').disable();
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regExp.test(controls.value)) {
      return null; 
    } else {
      return { 'alphaNumericValidation': true }
    }
}

  newMementoForm() {
    this.newPost = true;
  }

  reloadPosts() {
    this.loadingPosts = true;
    this.getAllMementos();
    setTimeout(() => {
      this.loadingPosts = false;
    }, 4000);
  }

  draftComment() {

  }

  onMementoSubmit() {
      this.processing = true;
      this.disableFormNewMementoForm();

      const memento = {
          title: this.form.get('title').value,
          body: this.form.get('body').value,
          img: this.img,
          createdBy: this.username
      }

      this.mementoService.newMemento(memento).subscribe(data => {
          if (!data.success) {
              this.messageClass = 'alert alert-danger';
              this.message = data.message;
              this.processing = false;
              this.enableFormNewMementoForm();
          } else {
            this.messageClass = 'alert alert-success';
            this.message = data.message;
            this.getAllMementos();
            setTimeout(() => {
                this.newPost = false;
                this.processing = false;
                this.message = false;
                this.form.reset();
                this.enableFormNewMementoForm();
            }, 2000)
          }      
      });
  }

  goBack() {
      window.location.reload();
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
    this.img = binaryString;
    this.base64textString = btoa(binaryString);
    console.log(binaryString);
  }

  getAllMementos() {
    this.mementoService.getAllMementos().subscribe(data => {
      this.mementoPosts = data.mementos;
    });
  }

  likeMemento(id) {
    this.mementoService.likeMemento(id).subscribe(data => {
      this.getAllMementos(); 
    });
  }

  dislikeMemento(id) {
    this.mementoService.dislikeMemento(id).subscribe(data => {
      this.getAllMementos();
    });
}

  ngOnInit() {
      this.authService.getProfile().subscribe(profile => {
          this.username = profile.user.username;
      });

      this.getAllMementos();
  }




}
