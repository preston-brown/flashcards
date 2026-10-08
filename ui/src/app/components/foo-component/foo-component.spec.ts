import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooComponent } from './foo-component';

describe('FooComponent', () => {
  let component: FooComponent;
  let fixture: ComponentFixture<FooComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/api/cards').flush([]);
    http.expectOne('http://localhost:3000/api/parts_of_speech').flush(['noun', 'verb']);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a blank option followed by the parts of speech', () => {
    const options = Array.from<HTMLOptionElement>(
      fixture.nativeElement.querySelectorAll('#part-of-speech-select option'),
    );
    expect(options.map((o) => o.value)).toEqual(['', 'noun', 'verb']);
  });

  it('stores the selection and allows clearing it', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#part-of-speech-select');
    expect(component.selectedPartOfSpeech()).toBe('');

    select.value = 'verb';
    select.dispatchEvent(new Event('change'));
    expect(component.selectedPartOfSpeech()).toBe('verb');

    select.value = '';
    select.dispatchEvent(new Event('change'));
    expect(component.selectedPartOfSpeech()).toBe('');
  });
});
