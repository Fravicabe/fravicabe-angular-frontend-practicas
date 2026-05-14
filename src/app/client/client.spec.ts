import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from './model/Client';
import { ClientService } from './client.service';

@Component({
    selector: 'app-client-list',
    templateUrl: './client-list.page.html',
    styleUrls: ['./client-list.page.scss']
})
export class ClientListComponent implements OnInit {

dataSource = new MatTableDataSource<Client>();
displayedColumns: string[] = ['id', 'name', 'action'];

constructor(
    private clientService: ClientService,
) { }

ngOnInit(): void {
    this.clientService.getClient().subscribe(
    (      client: Client[]) => this.dataSource.data = client
    );
    }
}