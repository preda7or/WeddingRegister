import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styles: []
})
export class HelloComponent implements OnInit {
  //
  // guest: Guest[];
  guest: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.guest = this.authService.guest$;
    // this.guestService.guest
    //   .scan((acc, val) => {
    //     acc.push(val);
    //     return acc;
    //   }, [])
    //   .do(guests => (this.guest = guests));
    // this.guestService.guest.last().subscribe(guest =>
    //   console.log('HelloComponent', guest)
    // );
  }
}
