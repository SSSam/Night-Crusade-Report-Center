import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  ReportElement,
  StoredReportElement,
  LocationElement,
} from './report-element';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  report: ReportElement[];
  case_id = 0;
  url =
    'https://272.selfip.net/apps/rKFdLf9PJU/collections/NCT_Report/documents/';

  constructor(private http: HttpClient) {
    this.report = [];
  }

  get(): Observable<[]> {
    return this.http.get<[]>(this.url);
  }

  add(newElement: any) {
    this.report.concat(newElement);
    this.http.post(this.url, newElement).subscribe((res: any) => {
      console.log(res);
    });
  }

  private md5ApiUrl = 'https://api.hashify.net/hash/md5/hex';
  hashPassword(password: string): Observable<string> {
    const apiUrl = `${this.md5ApiUrl}?value=${password}`;
    return this.http
      .get<{ Digest: string }>(apiUrl)
      .pipe(map((result) => result.Digest));
  }

  delete(del_key: string | null) {
    var deleteUrl = `${this.url}/${del_key}/`;
    this.http.delete(deleteUrl).subscribe(() => {
      window.location.reload();
      console.log('Delete successful');
    });
  }

  updateResolvedStatus(report: ReportElement) {
    var updateURL = `${this.url}/${report.key}/`;
    const updateData = {
      reporterName: report.reporterName,
      reporterPhone: report.reporterPhone,
      troubleMaker: report.troubleMaker,
      locationName: report.locationName,
      locationLat: report.locationLat,
      locationLong: report.locationLong,
      pic: report.pic,
      extraInfo: report.extraInfo,
      locationSelection: report.locationSelection,
      dateTime: report.dateTime,
      status: report.status == 'OPEN' ? 'RESOLVED' : 'OPEN',
    };
    const jsonString = JSON.stringify(updateData);
    this.http
      .put<StoredReportElement>(updateURL, {
        key: report.key,
        data: jsonString,
      })
      .subscribe(() => {
        console.log(jsonString)
      });
  }
}
