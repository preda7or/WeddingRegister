import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  //
  showLogout: Observable<boolean>;

  @Input() title: string;

  constructor(private authService: AuthService) {
    this.showLogout = this.authService.guest$.map(guest => guest != null);
  }

  ngOnInit() {}

  onLogout() {
    this.authService.logout().catch(err => {});
  }
}
