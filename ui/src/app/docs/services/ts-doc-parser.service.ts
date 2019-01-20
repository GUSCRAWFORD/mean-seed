import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WithEvents, AppEvent } from 'src/app/shared/services/with-events';
import { Router } from '@angular/router';
export type ALike = {
  tsdocRef:string,
  href:string,
  baseURI:string,
  onclick:(event)=>any,
  removeAttribute:(attr)=>any
};
// export class TsDocPageLoadEvent extends AppEvent {
//   constructor(
//     public target:ALike,
//     public native:any
//   ) {
//     super(target, native);
//   }
// }
@Injectable({
  providedIn: 'root'
})
export class TsDocParserService extends WithEvents<AppEvent> {

  constructor(private http:HttpClient, private router:Router) { super(); }

  async doc(uri:string) {
    var tsdoc = await this.http.get(uri, {responseType:'text'}).toPromise();
    var dom = { root: document.createElement('html'), contents:null, menu:null, links:[] };
    dom.root.innerHTML = tsdoc;
    dom.contents = dom.root.querySelector('div.container.container-main > div.row > div.col-8.col-content'/* .tsd-panel.tsd-typography'*/);
    dom.menu = dom.root.querySelector(`div.container.container-main > div.row > div.col-4.col-menu.menu-sticky-wrap`);
    try {
      dom.links = Array.from(dom.menu.getElementsByTagName(`a`)).map(elm=>this.transformLink(elm as any, uri));
    } catch(e) {console.error(e)}
    // console.info(dom.menu.getElementsByTagName(`a`))
    // console.info(dom.menu)
    return dom;
  }
  handleClick(a:ALike, event:any) {
    this.events.emit(new AppEvent(a, event));
    this.router.navigate([`gothere`])
  }
  transformLink(a:ALike, newBaseUri:string) {
    if (a.baseURI !== newBaseUri) {
      var ref = a.href.substring(a.baseURI.length);
      delete a.href;// = `${newBaseUri}/${a.href.substring(a.baseURI.length)}`;
      a.removeAttribute('href');
      a.tsdocRef = ref;
      //a.href = `#${ref}`;
      //a.href="#"
      //(a as any).target = "_self"
      var inst = this;
      // a.onclick = (event)=>{
      //   console.info(ref)
      //   //event.preventDefault();
      //   return inst.handleClick(a, event);
      // }
      //console.info(a.onclick)
    }
    return a;
  }
}
