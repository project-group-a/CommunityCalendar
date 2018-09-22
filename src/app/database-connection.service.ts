import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseConnectionService {
  private readonly dataUrl = '/api/data';
  constructor(private http: HttpClient) {}

  getTableData() {
    return this.http.get(this.dataUrl);
  }
}
