import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MementoService } from '../../../services/memento.service';

@Component({
  selector: 'edit-memento',
  templateUrl: './edit-memento.html',
  styleUrls: ['./edit-memento.css']
})
export class EditMemento implements OnInit {

  message;
  messageClass;
  memento;
  processing = false;
  currentUrl;
  loading = true;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private mementoService: MementoService,
    private router: Router
  ) { }

  
  updateMementoSubmit() {
    this.processing = true; 
    this.mementoService.editMemento(this.memento).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; 
        this.message = data.message; 
        this.processing = false; 
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message; 
        setTimeout(() => {
          this.router.navigate(['/memento']); 
        }, 2000);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; 
    this.mementoService.getSingleMemento(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; 
        this.message = 'Memento not found.'; 
      } else {
        this.memento = data.memento; 
        this.loading = false; 
      }
    });

  }

}