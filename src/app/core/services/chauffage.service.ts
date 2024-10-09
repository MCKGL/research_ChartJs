import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ChauffageResponse} from "../models/chauffage.model";

@Injectable({
  providedIn: 'root'
})
export class ChauffageService {
  constructor(private http: HttpClient) {}

  public getDatasChauffage(metresCarres: number): Observable<ChauffageResponse> {
    const headers = new HttpHeaders().set('accept', 'application/json');
    return this.http.get<ChauffageResponse>(`https://impactco2.fr/api/v1/chauffage?m2=${metresCarres}&language=fr`, {headers});
  }

}
