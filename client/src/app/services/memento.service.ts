import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class MementoService {

    options;
    domain = this.authService.domain;
    queryUrl: string = '?search=';

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

    search(terms: Observable<string>) {
        this.createAuthenticationHeaders();
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.searchEntries(term));
    }
                                                
    searchEntries(term) {
        this.createAuthenticationHeaders();
        return this.http
            .get(this.domain + 'mementos/allMementos' + this.queryUrl + term, this.options)
            .map(res => res.json());
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

    postComment(id, comment) {
        this.createAuthenticationHeaders();
        const mementoData = {
            id: id,
            comment: comment
        }
        return this.http.post(this.domain + 'mementos/comment', mementoData, this.options).map(res => res.json());

    }

}