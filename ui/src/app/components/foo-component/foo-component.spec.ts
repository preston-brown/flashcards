import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooComponent } from './foo-component';

describe('FooComponent', () => {
  let component: FooComponent;
  let fixture: ComponentFixture<FooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
