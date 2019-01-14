import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {

  constructor(private route:ActivatedRoute, private http:HttpClient) { }
  project:string;
  version:string;
  docs:string;
  async ngOnInit() {
    let routeParams = await this.route.params.subscribe(
      async params=>{

        console.info(params);
        this.project = params.subProject 
          ? `@${params.project}/${params.subProject}`
          : params.project;
        this.version = params.subVersion || params.version;
        try {
          this.docs = await this.http.get(`http://jyv.s3-website-us-east-1.amazonaws.com/${params.version}/${params.subProject}/docs`, {responseType:'text'}).toPromise();

          var x = document.createElement('html');
          x.innerHTML = this.docs;
          console.info(x)
          //console.info(docs)
        } catch (e) {
          //console.error(e.error);
          var x = document.createElement('html');
          x.innerHTML = e.error;
          console.info(x.querySelectorAll('*'))
          //console.info(new HTMLDocument().write(e.error));
        }
      }
    )
  }

}
