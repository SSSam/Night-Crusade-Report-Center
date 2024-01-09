import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {icon, Marker} from 'leaflet';
import { ReportsService } from '../reports.service';
import { ReportElement, StoredReportElement, LocationElement } from '../report-element';

const iconRetinaUrl= 'assets/marker-icon-2x.png';
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
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map!: L.Map
  report: ReportElement[];
  allData:LocationElement[]=[];
  constructor(private rs:ReportsService){
    this.report= rs.report
  }

  ngOnInit(): void {
    this.showMap()
    this.getLocationLabel()
     this.showClick()
  }
  getLocationLabel() {
    this.rs.get().subscribe(
      (res: StoredReportElement[]) => {
        this.allData = res.map((item: { data: string; key: string }) => {
          const parsedData = JSON.parse(item.data);
          return {
            key: item.key,
            locationName: parsedData.locationName,
            locationLat: parsedData.locationLat,
            locationLong: parsedData.locationLong,
          };
        });
        const locationReportCount: { [key: string]: number } = {};
        this.allData.forEach((location) => {
          if (!locationReportCount[location.locationName]) {
            locationReportCount[location.locationName] = 0;
          }
          locationReportCount[location.locationName]++;

          L.marker([location.locationLat, location.locationLong], { icon: myIcon })
            .addTo(this.map)
            .bindPopup(`<b>${location.locationName}</b> <br /> Nuisance Reported: ${locationReportCount[location.locationName]}`);
        });
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  showMap() {
    this.map = L.map('mapid').setView([49.25, -122.9], 10);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
    }).addTo(this.map);
  }

   showClick(){
    this.map.on('click', (e)=>{
      console.log("latitude: " + e.latlng.lat + ", Longtitude: "+ e.latlng.lng);
    })
   }

}
