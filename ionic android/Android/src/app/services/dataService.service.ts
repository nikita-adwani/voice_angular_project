import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class DataServiceService {
  constructor(private http: HttpClient) {}
  dataUrl = environment.dataURL;
  getStudentDetails(input) {
    return this.http.get(this.dataUrl +"/"+ input);
  }
}
