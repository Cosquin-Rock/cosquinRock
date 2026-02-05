import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit false by default', (done) => {
    service.loading$.subscribe((loading) => {
      expect(loading).toBe(false);
      done();
    });
  });

  it('should emit true when show is called', (done) => {
    service.show();
    
    service.loading$.subscribe((loading) => {
      expect(loading).toBe(true);
      done();
    });
  });

  it('should emit false when hide is called after show', (done) => {
    service.show();
    service.hide();
    
    service.loading$.subscribe((loading) => {
      expect(loading).toBe(false);
      done();
    });
  });

  it('should handle multiple concurrent requests', (done) => {
    service.show(); // Request 1
    service.show(); // Request 2
    
    // Should still be loading
    expect(service.isLoading()).toBe(true);
    
    service.hide(); // Request 1 finishes
    
    // Should still be loading (Request 2 pending)
    expect(service.isLoading()).toBe(true);
    
    service.hide(); // Request 2 finishes
    
    service.loading$.subscribe((loading) => {
      expect(loading).toBe(false);
      done();
    });
  });

  it('should not go below 0 request count', () => {
    service.hide();
    service.hide();
    
    expect(service.isLoading()).toBe(false);
  });

  it('isLoading should return correct state', () => {
    expect(service.isLoading()).toBe(false);
    
    service.show();
    expect(service.isLoading()).toBe(true);
    
    service.hide();
    expect(service.isLoading()).toBe(false);
  });
});
