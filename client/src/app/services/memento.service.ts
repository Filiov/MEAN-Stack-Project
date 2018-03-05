import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class MementoService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  createAuthenticationHeaders() {
    this.authService.loadToken(); 
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', 
        'authorization': this.authService.authToken 
      })
    });
  }

  newMemento(memento) {
    this.createAuthenticationHeaders(); 
    return this.http.post(this.domain + 'mementos/newMemento', memento, this.options).map(res => res.json());
  }

  getAllMementos() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'mementos/allMementos', this.options).map(res => res.json());
  }

  editMemento(memento) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'mementos/updateMemento/', memento, this.options).map(res => res.json());
  }

  getSingleMemento(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'mementos/singleMemento/' + id, this.options).map(res => res.json());
  }

  deleteMemento(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'mementos/deleteMemento/' + id, this.options).map(res => res.json());
  }

  likeMemento(id) {
    const mementoData = { id: id };
    return this.http.put(this.domain + 'mementos/likeMemento/', mementoData, this.options).map(res => res.json());
  }

  dislikeMemento(id) {
    const mementoData = { id: id };
    return this.http.put(this.domain + 'mementos/dislikeMemento/', mementoData, this.options).map(res => res.json());
}

}