import { Component } from '@angular/core';
import { MementoService } from '../../services/memento.service';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'search',
    templateUrl: './search.html',
    styleUrls: ['./search.css'],
    providers: [MementoService]
})

export class Search {
    results: Object;
    search$ = new Subject<string>();

    constructor(private mementoService: MementoService) {
        this.mementoService.search(this.search$)
            .subscribe(results => {
                this.results = results.mementos;
                console.log(results);
            });
    }
}

