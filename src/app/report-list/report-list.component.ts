import { Component } from '@angular/core';
import { ReportsService } from '../reports.service';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ReportElement } from '../report-element';
import { style } from '@angular/animations';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
})
export class ReportListComponent implements OnInit {
  allData: ReportElement[] = [];
  displayedColumns: string[] = [
    'locationName',
    'troubleMaker',
    'dateTime',
    'status',
  ];
  sortedData: any[] = [];
  selectedReport!: ReportElement;
  rowsHtml: string = '';
  constructor(private rs: ReportsService, private router: Router) {}
  ngOnInit(): void {
    this.getall('troubleMaker');
  }
  getall(condition: string) {
    this.rs.get().subscribe(
      (res: []) => {
        this.allData = res;
        this.allData = res.map((item: { data: string; key: string }) => {
          const parsedData = JSON.parse(item.data);
          const pic = parsedData.pic || null;
          const extraInfo = parsedData.extraInfo || null;
          const locationSelection = parsedData.locationSelection || null;
          return {
            key: item.key,
            reporterName: parsedData.reporterName,
            reporterPhone: parsedData.reporterPhone,
            troubleMaker: parsedData.troubleMaker,
            locationName: parsedData.locationName,
            locationLat: parsedData.locationLat,
            locationLong: parsedData.locationLong,
            pic: pic,
            extraInfo: extraInfo,
            locationSelection: locationSelection,
            dateTime: parsedData.dateTime,
            status: parsedData.status,
          };
        });
        this.sortData(condition);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  sortData(column: string) {
    this.sortedData = [...this.allData];
    this.sortedData.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
      } else {
        return 0;
      }
    });
  }

  openDetailsModal(report: ReportElement) {
    this.router.navigate(['/report', report.key], {
      state: { report: report },
    });
    this.selectedReport = report;
  }
  async updateStatus(report: ReportElement) {
    const enteredPassword = window.prompt(
      'Authorized Status Update Required- Enter password:'
    );
    if (enteredPassword !== null) {
      this.rs.hashPassword(enteredPassword);
      const hashedPassword = await this.rs.hashPassword(enteredPassword).toPromise();
      if (hashedPassword == 'fcab0453879a2b2281bc5073e3f5fe54') {
        this.rs.updateResolvedStatus(report);
        window.location.reload();
        alert('Selected Nuisance Status Updated.');
      } else {
        alert('Incorrect password. Update Not Allowed.');
      }
    } else {
      alert('Update canceled.');
    }
  }

  async deleteReport(report: ReportElement) {
    const del_key = report.key;

    const enteredPassword = window.prompt(
      'Authorized Report Delete Required- Enter password:'
    );
    if (enteredPassword !== null) {
      this.rs.hashPassword(enteredPassword);
      const hashedPassword = await this.rs
        .hashPassword(enteredPassword)
        .toPromise();
      if (hashedPassword == 'fcab0453879a2b2281bc5073e3f5fe54') {
        this.rs.delete(del_key);
        alert('Selected Report Deleted.');
      } else {
        alert('Incorrect password. Deletion aborted.');
      }
    } else {
      alert('Deletion canceled.');
    }
  }
  getStatusCellStyle(status: string): { [key: string]: string } {
    let style: { [key: string]: string } = {};
    if (status === 'OPEN') {
      style['color'] = '#ff5252';
      style['font-weight'] = '800';
    } else if (status === 'RESOLVED') {
      style['color']='#9ADE7B';
    }
    return style
  }
  

}
