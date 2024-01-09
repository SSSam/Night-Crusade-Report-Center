import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '../reports.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import {
  ReportElement,
  LocationElement,
  StoredReportElement,
} from '../report-element';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
var myIcon = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
Marker.prototype.options.icon = myIcon;

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css'],
})
export class ReportFormComponent implements OnInit {
  private mapinput!: L.Map;
  form: FormGroup;
  existedLocation: LocationElement[] = [];
  locationLat: number | undefined;
  locationLong: number | undefined;
  incident_marker: L.Marker | undefined;
  chose_location = false;
  newPerson: ReportElement | undefined;
  constructor(
    private rs: ReportsService,
    private router: Router,
    private http: HttpClient
  ) {
    let formControls = {
      reporterName: new FormControl('', [Validators.required]),
      reporterPhone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
      ]),
      troubleMaker: new FormControl('', [Validators.required]),
      locationName: new FormControl('', [Validators.required]),
      locationLat: new FormControl(),
      locationLong: new FormControl(),
      pic: new FormControl(),
      extraInfo: new FormControl(),
      locationSelection: new FormControl(''),
    };
    this.form = new FormGroup(formControls);
  }

  ngOnInit(): void {
    this.showMapinput();
    this.pinpoint();
    this.getLocation();
  }

  showMapinput() {
    this.mapinput = L.map('mapinput').setView([49.2098, -123.04], 9.5);

    const tiles = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
      }
    ).addTo(this.mapinput);
  }
  pinpoint() {
    this.mapinput.on('click', (e) => {
      this.chose_location = true;
      const latitude = e.latlng.lat;
      const longitude = e.latlng.lng;
      this.form.patchValue({
        locationLat: latitude,
        locationLong: longitude,
      });

      if (this.incident_marker != undefined) {
        this.mapinput.removeLayer(this.incident_marker);
      }
      this.incident_marker = L.marker([latitude, longitude], { icon: myIcon })
        .addTo(this.mapinput)
        .bindPopup('<b>Metortown</b><br />2 nuisance reports');
    });
  }
  getLocation() {
    this.existedLocation = [];
    this.rs.get().subscribe(
      (res: StoredReportElement[]) => {
        const uniqueLocations = new Set<string>();
        res.forEach((item: { data: string; key: string }) => {
          const parsedData = JSON.parse(item.data);
          const locationKey = `${parsedData.locationName}_${parsedData.locationLat}_${parsedData.locationLong}`;
          if (!uniqueLocations.has(locationKey)) {
            uniqueLocations.add(locationKey);

            this.existedLocation.push({
              key: item.key,
              locationName: parsedData.locationName,
              locationLat: parsedData.locationLat,
              locationLong: parsedData.locationLong,
            });
          }
        });

        this.existedLocation.sort((a, b) =>
          a.locationName.localeCompare(b.locationName)
        );
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  onLocationSelected() {
    const selectedLocation = this.form.get('locationSelection')?.value;
    if (selectedLocation) {
      this.form.patchValue({
        locationName: selectedLocation.locationName,
        locationLat: selectedLocation.locationLat,
        locationLong: selectedLocation.locationLong,
      });
      this.chose_location = true;
      if (this.incident_marker != undefined) {
        this.mapinput.removeLayer(this.incident_marker);
      }
      this.incident_marker = L.marker(
        [selectedLocation.locationLat, selectedLocation.locationLong],
        { icon: myIcon }
      ).addTo(this.mapinput);
    }
  }

  onSubmit() {
    const dateTime = new Date().getTime();
    var data = JSON.stringify({
      ...this.form.value,
      dateTime: dateTime,
      status: 'OPEN',
    });
    var key = dateTime + this.form.value.reporterPhone;
    this.rs.add({ key: key, data: data });
    this.form.reset();
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }
}
