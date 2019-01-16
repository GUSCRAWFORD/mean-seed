import { TestBed } from '@angular/core/testing';

import { TsDocParserService } from './ts-doc-parser.service';

describe('TsDocParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TsDocParserService = TestBed.get(TsDocParserService);
    expect(service).toBeTruthy();
  });
});
