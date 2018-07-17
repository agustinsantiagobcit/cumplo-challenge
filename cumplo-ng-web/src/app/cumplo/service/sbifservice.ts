import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Http } from "@angular/http";
import {Uf} from '../domain/uf';
import {Dollar} from '../domain/dollar';
import {Tmc} from '../domain/tmc';
import 'rxjs/add/operator/map'

@Injectable()
export class SbifService {

    constructor(private http: Http) {}

    getUfs(day, month, year, day2, month2, year2) {
        return this.http.get('http://localhost:3000/uf/' + day + '/' + month + '/' + year + '/' + day2 + '/' + month2 + '/' + year2 + '/').map(data => data.json())
    }

    getDollars(day, month, year, day2, month2, year2) {
        return this.http.get('http://localhost:3000/dollar/' + day + '/' + month + '/' + year + '/' + day2 + '/' + month2 + '/' + year2 + '/').map(data => data.json())
        // return this.http.get<Dollar[]>('http://localhost:3000/dollar/' + day + '/' + month + '/' + year + '/' + day2 + '/' + month2 + '/' + year2 + '/')
        //         .toPromise()
        //         .then(res => <Dollar[]> res)
        //         .then(data => data);    
    }

    getTmcs(day, month, year, day2, month2, year2) {
        return this.http.get('http://localhost:3000/tmc/' + day + '/' + month + '/' + year + '/' + day2 + '/' + month2 + '/' + year2 + '/').map(data => data.json())
        // return this.http.get<Tmc[]>('http://localhost:3000/tmc/' + day + '/' + month + '/' + year + '/' + day2 + '/' + month2 + '/' + year2 + '/')
        //         .toPromise()
        //         .then(res => <Tmc[]> res)
        //         .then(data => data);
    }

}
