import { TestBed, inject } from '@angular/core/testing';

import { RedirectingService } from './redirecting.service';

describe('RedirectingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectingService]
    });
  });

  it('should be created', inject([RedirectingService], (service: RedirectingService) => {
    expect(service).toBeTruthy();
  }));
});
