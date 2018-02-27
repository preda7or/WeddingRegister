import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticatedPageComponent } from './components/authenticated-page/authenticated-page.component';
import { DecisionComponent } from './components/decision/decision.component';
import { FormComponent } from './components/form/form.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PublicPageComponent } from './components/public-page/public-page.component';
import { SoSorryComponent } from './components/so-sorry/so-sorry.component';
import { GuestAutoLoginGuard } from './guards/guest-autologin.guard';
import { GuestComingGuard } from './guards/guest-coming.guard';
import { GuestLoggedinGuard } from './guards/guest-loggedin.guard';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },
  // {
  //   path: ':id',
  //   pathMatch: 'full',
  //   redirectTo: '/login/:id'
  // },
  {
    path: 'login',
    pathMatch: 'full',
    component: PublicPageComponent,
    canActivate: [GuestAutoLoginGuard]
  },
  {
    path: 'login/:id',
    component: PublicPageComponent,
    canActivate: [GuestAutoLoginGuard]
  },
  {
    path: 'in',
    component: AuthenticatedPageComponent,
    canActivateChild: [GuestLoggedinGuard],

    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sohappy'
      },
      {
        path: 'decision',
        component: DecisionComponent
      },
      {
        path: 'sohappy',
        component: FormComponent,
        data: {
          coming: { undefined: '/in/decision', false: '/in/sosorry', true: true }
        },
        canActivate: [GuestComingGuard]
      },
      {
        path: 'sosorry',
        component: SoSorryComponent,
        data: {
          coming: { undefined: '/in/decision', false: true, true: '/in/sohappy' }
        },
        canActivate: [GuestComingGuard]
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes //
      // , { enableTracing: true } //
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
