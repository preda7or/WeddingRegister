import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-decision',
  templateUrl: './decision.component.html',
  styleUrls: ['./decision.component.css']
})
export class DecisionComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  onComing(event) {
    // console.log('coming');
    // this.router.navigate(['sohappy'], { relativeTo: this.route.parent });
  }
  onNotComing(event) {
    // console.log('not coming');
    // this.router.navigate(['sosorry'], { relativeTo: this.route.parent });
  }
}
