import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnimatedHeaderComponent } from './components/animated-header/animated-header.component';
import { AuthenticatedPageComponent } from './components/authenticated-page/authenticated-page.component';
import { BlankComponent } from './components/blank/blank.component';
import { DecisionComponent } from './components/decision/decision.component';
import { FormComponent } from './components/form/form.component';
import { HelloComponent } from './components/hello/hello.component';
import { HomeComponent } from './components/home/home.component';
import { IntroComponent } from './components/intro/intro.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PublicPageComponent } from './components/public-page/public-page.component';
import { SoHappyComponent } from './components/so-happy/so-happy.component';
import { SoSorryComponent } from './components/so-sorry/so-sorry.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FillFromParamsDirective } from './directives/fill-from-params.directive';
import { LoginInputDirective } from './directives/login-input.directive';
import { firebaseConfig } from './firebase-config';
import { GuestAutoLoginGuard } from './guards/guest-autologin.guard';
import { GuestComingGuard } from './guards/guest-coming.guard';
import { GuestLoggedinGuard } from './guards/guest-loggedin.guard';
import { AuthService } from './services/auth.service';
import { DatabaseService } from './services/database.service';
import { LoadingSpinnerService } from './services/loading-spinner.service';
import { RedirectingService } from './services/redirecting.service';
import { GuestService } from './services/guest.service';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PublicPageComponent,
    AuthenticatedPageComponent,
    HomeComponent,
    LoginComponent,
    WelcomeComponent,
    TopNavComponent,
    DecisionComponent,
    BlankComponent,
    IntroComponent,
    HelloComponent,
    FormComponent,
    SoSorryComponent,
    LoginInputDirective,
    FillFromParamsDirective,
    AnimatedHeaderComponent,
    SoHappyComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [
    AuthService,
    DatabaseService,
    GuestService,
    LoadingSpinnerService,
    GuestLoggedinGuard,
    GuestComingGuard,
    GuestAutoLoginGuard,
    RedirectingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private spinner: LoadingSpinnerService,
    private auth: AuthService,
  ) {}
}
