import { Component, Type } from '@angular/core';
import { Data } from '@angular/router';

interface OutletData extends Data {
  components: {
    [key: string]: Type<any>;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: any;
  constructor() {}
}
