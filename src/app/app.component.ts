import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingService } from './service/util/loading.service';
import { CommonModule } from '@angular/common';
import { StorageService } from './service/util/storage.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule, NgxDatatableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private router: Router, public loadingService: LoadingService, private storageService: StorageService) {

  }
  
  ngOnInit() {
    
  }
}
