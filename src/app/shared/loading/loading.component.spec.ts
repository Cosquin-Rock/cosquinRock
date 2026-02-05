import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { LoadingService } from '../../services/loading.service';
import { BehaviorSubject } from 'rxjs';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);
    
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide'], {
      loading$: loadingSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    }).compileComponents();

    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show loading overlay when loading$ is false', () => {
    loadingSubject.next(false);
    fixture.detectChanges();
    
    const overlay = fixture.nativeElement.querySelector('.loading-overlay');
    expect(overlay).toBeNull();
  });

  it('should show loading overlay when loading$ is true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    
    const overlay = fixture.nativeElement.querySelector('.loading-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should display "Cargando..." text', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    
    const text = fixture.nativeElement.querySelector('.loading-text');
    expect(text?.textContent).toContain('Cargando...');
  });
});
