import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-docs-main-toolbar',
  templateUrl: './docs-main-toolbar.component.html',
  styleUrls: ['./docs-main-toolbar.component.scss']
})
export class DocsMainToolbarComponent implements OnInit {

  constructor() { }

  @Input() project:string;
  @Input() version:string;
  
  ngOnInit() {
  }

}
