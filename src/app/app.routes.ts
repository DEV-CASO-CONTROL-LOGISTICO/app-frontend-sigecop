import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoadingComponent } from './pages/loading/loading.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';
import { PaginaComponent } from './pages/pagina/pagina.component';
import { RolComponent } from './pages/rol/rol.component';
import { SolicitudProveedorComponent } from './pages/solicitud-proveedor/solicitud-proveedor.component';
import { authGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { hasRoleGuard } from './core/guards/has-role.guard';
import { UnfoundComponent } from './pages/unfound/unfound.component';
import { PedidoAsistenteComponent } from './pages/pedido-asistente/pedido-asistente.component';
import { PedidoProveedorComponent } from './pages/pedido-proveedor/pedido-proveedor.component';
import { OrdenInternamientoComponent } from './pages/orden-internamiento/orden-internamiento.component';
import { ObligacionComponent } from './pages/obligacion/obligacion.component';
import { ObligacionAsistenteContableComponent } from './pages/obligacion-asistente-contable/obligacion-asistente-contable.component';
import { ObligacionGerenteFinancieroComponent } from './pages/obligacion-gerente-financiero/obligacion-gerente-financiero.component';
import { ObligacionGerenteGeneralComponent } from './pages/obligacion-gerente-general/obligacion-gerente-general.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'home',
        component: DashboardComponent,
        canMatch: [authGuard],
        children: [
            { path: 'GestionSolicitudCotizacion', component: SolicitudComponent, canActivate: [hasRoleGuard] },
            { path: 'Usuarios', component: UsuarioComponent, canActivate: [hasRoleGuard] },
            { path: 'Proveedor', component: ProveedorComponent, canActivate: [hasRoleGuard] },
            { path: 'Categoria', component: CategoriaComponent, canActivate: [hasRoleGuard] },
            { path: 'Producto', component: ProductoComponent, canActivate: [hasRoleGuard] },
            { path: 'Pagina', component: PaginaComponent, canActivate: [hasRoleGuard] },
            { path: 'Rol', component: RolComponent, canActivate: [hasRoleGuard] },
            { path: 'OrdenInternamiento', component: OrdenInternamientoComponent, canActivate: [hasRoleGuard]},
            { path: 'SolicitudProveedor', component: SolicitudProveedorComponent, canActivate: [hasRoleGuard] },
            { path: 'GestionPedidos', component: PedidoAsistenteComponent, canActivate: [hasRoleGuard] },
            { path: 'PedidosProveedor', component: PedidoProveedorComponent, canActivate: [hasRoleGuard] },
            { path: 'Obligaciones', component: ObligacionComponent, canActivate: [hasRoleGuard] },
            { path: 'ObligacionesAsistenteContable', component: ObligacionAsistenteContableComponent, canActivate: [hasRoleGuard] },
            { path: 'ObligacionesGerenteFinanciero', component: ObligacionGerenteFinancieroComponent, canActivate: [hasRoleGuard] },
            { path: 'ObligacionesGerenteGeneral', component: ObligacionGerenteGeneralComponent, canActivate: [hasRoleGuard] },
            { path: 'SinAutorizacion', component: UnauthorizedComponent },
            { path: 'NoEncontrado', component: UnfoundComponent }
        ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'loading', component: LoadingComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
