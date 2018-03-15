import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { GuestService } from '../../services/guest.service';
import { RedirectingService } from '../../services/redirecting.service';

@Component({
  selector: 'app-decision',
  templateUrl: './decision.component.html',
})
export class DecisionComponent implements OnInit {
  constructor(private gs: GuestService, private redirect: RedirectingService) {}

  ngOnInit() {
    // this.gs.updateComing(null);
  }

  onComing(event) {
    this.gs
      .updateComing(true)
      .then(o => this.redirect.toSoHappy('Decided to come'));
    // this.router.navigate(['sohappy'], { relativeTo: this.route.parent });
  }
  onUndecided(event) {
    this.gs
      .updateComing(null)
      .then(o => this.redirect.toDecision('Decided to donno'));
    // console.log('coming');
    // this.router.navigate(['sohappy'], { relativeTo: this.route.parent });
  }
  onNotComing(event) {
    this.gs
      .updateComing(false)
      .then(o => this.redirect.toSoSorry('Decided not to come'));
    // console.log('not coming');
    // this.router.navigate(['sosorry'], { relativeTo: this.route.parent });
  }
}
