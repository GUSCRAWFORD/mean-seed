import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TsDocParserService, ALike } from '../../services/ts-doc-parser.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {

  constructor(private route:ActivatedRoute, private tsdocs:TsDocParserService) { }
  docs:string;
  menu:string;
  links:ALike[];
  params:any;
  async ngOnInit() {
    let routeParams = await this.route.params.subscribe(
      async params=>{
        this.params = params;
        this.loadDocPage();
      }
    )
  }

  async loadDocPage(subPage:string='') {

    try {
      var parsed = await this.tsdocs.doc(`http://jyv.s3-website-us-east-1.amazonaws.com/${this.params.version}/${this.params.subProject}/docs/${subPage}`);
      //console.info(parsed)
      this.docs = parsed.contents.innerHTML;
      this.menu = parsed.menu.innerHTML;
      this.links = parsed.links;
      console.info(parsed)
    } catch (e) {
      //console.error(e.error);
      var x = document.createElement('html');
      x.innerHTML = e.error;
      console.info(x.querySelectorAll('*'))
      //console.info(new HTMLDocument().write(e.error));
    }
  }

}
