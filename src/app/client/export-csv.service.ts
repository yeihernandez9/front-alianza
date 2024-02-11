
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportCsvService {
  constructor() { }

  csvDownload(headers: any, dataClient: any){
    console.log("Headers", dataClient);
    if(!dataClient || !dataClient.length){
      return
    }

    

    const separator = ',';
    const csvContent : any = headers.join(separator)+'\n'+dataClient.map((rowData: any) => {
      return headers
      .map((headkey: string) =>{
      return rowData[headkey.toLowerCase().replaceAll(' ','_')] === null || 
      rowData[headkey.toLowerCase().replaceAll(' ','_')] === undefined ? '' : rowData[headkey.toLowerCase().replaceAll(' ','_')];
    })
    .join(separator)
    })
    .join('\n');
    this.exportFile(csvContent, 'text/csv');
    
  }

  exportFile(data: string, fileType: string) {
    const blob = new Blob([data], {type: fileType});
    FileSaver.saveAs(blob, 'Downloaded Client CSV')
  }
}
