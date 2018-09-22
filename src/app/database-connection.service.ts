import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface TableData {
  actor_id: number;
  first_name: string;
  last_name: string;
  last_update: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseConnectionService {
  private readonly dataUrl = '/api/data';
  constructor(private http: HttpClient) {}

  getTableData() {
    return this.http.get<TableData>(this.dataUrl);
  }
}
