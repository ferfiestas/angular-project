import { ComponentFixture, TestBed } from '@angular/core/testing';

import { passwordComponent } from './password.component';

describe('passwordComponent', () => {
  let component: passwordComponent;
  let fixture: ComponentFixture<passwordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [passwordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(passwordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
