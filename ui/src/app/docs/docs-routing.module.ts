import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocsComponent } from './components/docs/docs.component';

const routes: Routes = [
  { path: '',
    redirectTo: 'jyv/1.0.2/core/1.0.2',
    pathMatch: 'full'
  },
  {
    path:':project/:version/:subProject/:subVersion/:docPath',
        component:DocsComponent
  },
  {
    path:':project/:version/:subProject/:subVersion',
        component:DocsComponent
  },
  {
    path:':project/:version',
        component:DocsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }
