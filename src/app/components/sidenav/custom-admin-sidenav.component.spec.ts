import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAdminSidenavComponent } from './custom-admin-sidenav.component';

describe('CustomAdminSidenavComponent', () => {
  let component: CustomAdminSidenavComponent;
  let fixture: ComponentFixture<CustomAdminSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAdminSidenavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomAdminSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
