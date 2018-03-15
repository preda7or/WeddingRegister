import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { GuestService } from '../../services/guest.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
})
export class HelloComponent implements OnInit {
  //
  guest$: any;

  constructor(private gs: GuestService) {}

  ngOnInit() {
    this.guest$ = this.gs.guest$;
  }
}
