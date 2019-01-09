import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rest-info',
  templateUrl: './rest-info.component.html',
  styleUrls: ['./rest-info.component.scss']
})
export class RestInfoComponent implements OnInit {

  constructor(private http:HttpClient) { }

  @Input()
  endpoint="";

  @Input()
  payload:object=null;

  result:object=null;

  get method() { return this.payload?Object.keys(this.payload)[0]:'get' }
  async ngOnInit() {
    var start, stop;
    try {
      start = new Date();
      if (this.endpoint && this.payload)
        this.result = await this.http[this.method](this.endpoint, this.payload[this.method]).toPromise();
      else this.result = await this.http.get(this.endpoint).toPromise();
      stop = new Date();
      console.info(`⏱ ${this.method} ${this.endpoint} took ${stop.valueOf() - start.valueOf()} ms`)
      if (typeof (this.result as any).json === 'function')
        this.result = (this.result as any).json();
    }
    catch(err) {
      this.result = err;
    }
  }

}
