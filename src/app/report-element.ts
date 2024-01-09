export class ReportElement {
    key: string= '';
    reporterName: string= '';
    reporterPhone: string= '';
    troubleMaker: string= '';
    locationName: string= '';
    locationLat: number | undefined;
    locationLong: number | undefined;
    pic: string='';
    extraInfo: string='';
    locationSelection: string= '';
    dateTime: number | undefined;
    status: string= '';
}

export class StoredReportElement {
    key: string= '';
    data: string= ''
}

export class LocationElement {
    key: string= '';
    locationName: string= '';
    locationLat: number=0;
    locationLong: number=0;
}