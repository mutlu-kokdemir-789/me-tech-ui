import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedAppComponent } from './authorized-app.component';

describe('AuthorizedAppComponent', () => {
  let component: AuthorizedAppComponent;
  let fixture: ComponentFixture<AuthorizedAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizedAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizedAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
