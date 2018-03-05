import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MementoService } from '../../../services/memento.service';

@Component({
  selector: 'delete-memento',
  templateUrl: './delete-memento.html',
  styleUrls: ['./delete-memento.css']
})
export class DeleteMemento implements OnInit {

  message;
  messageClass;
  processing = false;
  foundMemento = false;
  memento;
  currentUrl;


  constructor(
    private activatedRoute: ActivatedRoute,
    private mementoService: MementoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.mementoService.getSingleMemento(this.currentUrl.id).subscribe(data => {
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; 
          this.message = 'Memento not found.'; 
        } else {
          this.memento = {
              title: data.memento.title,
              body: data.memento.body,
              createdBy: data.memento.createdBy,
              createdAt: data.memento.createdAt
          }
          this.foundMemento = true; 
        }
      });
  }

  deleteMemento() {
    this.processing = true;
    this.mementoService.deleteMemento(this.currentUrl.id).subscribe(data => {
        if (!data.success) {
            this.messageClass = 'alert alert-danger'; 
            this.message = data.message;
          } else {
            this.messageClass = 'alert alert-success';
            this.message = data.message; 
            setTimeout(() => {
              this.router.navigate(['/memento']); 
            }, 2000);
          }
    });
  }

}