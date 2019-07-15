import { Component } from "@angular/core";
import { DataServiceService } from "src/app/services/dataService.service";
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  constructor(public dataService: DataServiceService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getStudentDetials();
  }

  getStudentDetials() {
    const input = "Aakash";
    this.dataService.getStudentDetails(input).subscribe(res => {
      console.log(res);
    });
  }
}
