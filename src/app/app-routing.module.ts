import { HelloComponent } from './components/hello/hello.component';
import { LoginComponent } from './components/login/login.component';
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
import { BlankComponent } from './components/blank/blank.component';
import { SoHappyComponent } from './components/so-happy/so-happy.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'login',
    pathMatch: 'full',
    children: [
      {
        outlet: 'intro',
        path: '',
        component: LoginComponent,
      },
      {
        path: '',
        component: BlankComponent,
      },
    ],
  },
  {
    path: 'login/:id',
    children: [
      {
        outlet: 'intro',
        path: '',
        component: LoginComponent,
      },
      {
        path: '',
        component: BlankComponent,
      },
    ],
  },
  {
    path: 'in',
    // canActivateChild: [GuestLoggedinGuard],
    children: [
      {
        outlet: 'intro',
        path: '',
        component: HelloComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sohappy',
      },
      {
        path: 'decision',
        component: DecisionComponent,
      },
      {
        path: 'sohappy',
        data: {
          coming: {
            undefined: 'decision',
            false: 'sosorry',
            true: true,
          },
        },
        canActivate: [GuestComingGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: SoHappyComponent,
          },
          {
            path: ':step',
            component: FormComponent,
          },
        ],
      },
      {
        path: 'sosorry',
        component: SoSorryComponent,
        data: {
          coming: {
            undefined: 'decision',
            false: true,
            true: 'sohappy',
          },
        },
        canActivate: [GuestComingGuard],
      },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, //
      // { enableTracing: true } //
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
