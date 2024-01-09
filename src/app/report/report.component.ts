import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ReportsService } from '../reports.service';
import { ReportElement, LocationElement } from '../report-element';



@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  report!: ReportElement;
  reportID:string='';
  constructor(private route: ActivatedRoute, private rs: ReportsService, private router: Router) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      const reportID= param.get('id')
      if (reportID) {
        this.report = history.state.report;
      }
    });
  }
}