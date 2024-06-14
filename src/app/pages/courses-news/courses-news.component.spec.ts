import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesNewsComponent } from './courses-news.component';

describe('CoursesNewsComponent', () => {
  let component: CoursesNewsComponent;
  let fixture: ComponentFixture<CoursesNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesNewsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursesNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
