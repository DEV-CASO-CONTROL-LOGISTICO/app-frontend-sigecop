import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { HTTP_STATUS } from '../../util/constant';
import { StorageService } from '../../service/util/storage.service';
import { CommonModule } from '@angular/common';
import { UserResponse } from '../../model/api/response/UserResponse';
import { Pagina } from '../../model/dto/Pagina';
import { parseJwt } from '../../util/methods';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  paginas: Pagina[] = [];
  user: UserResponse = {};
  isSidebarCollapsed = false;

  constructor(
    private router: Router,
    private storageService: StorageService) { }

  ngOnInit() {
    let session = this.storageService.getUserSession();
    this.user = session;
    this.paginas = session.paginas ?? [];
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.storageService.deleteSession();
    this.router.navigate(['/login']);
  }
}
