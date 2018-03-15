import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../services/auth.service';
import { GuestService } from '../../services/guest.service';

import 'jquery';
// import * as $ from 'jquery';

// interface BootstrapJQuery extends JQuery {
//   collapse(action: string): JQuery;
// }

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
})
export class TopNavComponent implements OnInit {
  //
  showLogout: Observable<boolean>;

  @ViewChild('collapsible') private collapsibleElement: ElementRef;
  @Input() title: string;

  constructor(private gs: GuestService, private auth: AuthService) {
    this.showLogout = this.auth.isLoggedIn$;
  }

  ngOnInit() {}

  private collapseMenu() {
    const el = this.collapsibleElement.nativeElement;
    if (el) {
      $(el)['collapse']('hide');
    }
  }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (target instanceof HTMLAnchorElement) {
      this.collapseMenu();
    }
  }

  onLogout() {
    this.auth.logout().catch(err => {});
  }
}
