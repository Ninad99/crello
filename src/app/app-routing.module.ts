import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './user/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'login',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'projects',
    loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
