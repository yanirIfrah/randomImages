import { DataResponse } from './../components/flickr/flickr.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Http, Headers, Request, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class HttpService {

  constructor(private _http: HttpClient, private http: Http) { }
  
  getAllImages(): Observable<HttpResponse<DataResponse>> {
    const flikerUrlApi = 'https://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1';
    return this._http.get<DataResponse>(
      flikerUrlApi, { observe: 'response' });
  }
}

