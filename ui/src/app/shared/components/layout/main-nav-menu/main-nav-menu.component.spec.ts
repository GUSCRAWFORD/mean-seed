import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNavMenuComponent } from './main-nav-menu.component';

describe('MainNavMenuComponent', () => {
  let component: MainNavMenuComponent;
  let fixture: ComponentFixture<MainNavMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainNavMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
