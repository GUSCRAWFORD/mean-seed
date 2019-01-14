import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsMainToolbarComponent } from './docs-main-toolbar.component';

describe('DocsMainToolbarComponent', () => {
  let component: DocsMainToolbarComponent;
  let fixture: ComponentFixture<DocsMainToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsMainToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsMainToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
