import { TestBed, inject } from '@angular/core/testing';

import { AlertingService } from './alerting.service';

describe('AlertingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertingService]
    });
  });

  it('should be created', inject([AlertingService], (service: AlertingService) => {
    expect(service).toBeTruthy();
  }));
});
