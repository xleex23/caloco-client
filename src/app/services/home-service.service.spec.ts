import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DataModel, HomeServiceService, ResDataModel } from './home-service.service';
import { of, throwError } from 'rxjs';

describe('HomeServiceService', () => {
  let service: HomeServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeServiceService]
    });
    service = TestBed.inject(HomeServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildHeaders', () => {
    it('should return headers with authorization token', () => {
      spyOn(localStorage, 'getItem').and.returnValue('test-token');
      const headers = service.buildHeaders();
      expect(headers.get('Authorization')).toBe('Bearer test-token');
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Custom-Header')).toBe('CustomHeaderValue');
    });
  });

  describe('getData', () => {
    it('should fetch data successfully', () => {
      const mockData: DataModel[] = [{ name: 'Test', date: new Date().toISOString(), type: 'test' }];
      spyOn(service, 'buildHeaders').and.returnValue(new HttpHeaders());
      
      service.getData().subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(service['api_url']);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle error', () => {
      const mockError = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
      service.getData().subscribe({
        error: (error) => {
          expect(error.message).toContain('Something went wrong');
        },
      });

      const req = httpMock.expectOne(service['api_url']);
      req.flush(null, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('createNew', () => {
    it('should post data successfully', () => {
      const payload: DataModel = { name: 'Test', date: new Date().toISOString(), type: 'test' };
      const response: ResDataModel = { id: '1', name: 'Test', date: new Date().toISOString(), type: 'test' };

      service.createNew(payload).subscribe(data => {
        expect(data).toEqual(response);
      });

      const req = httpMock.expectOne(service['api_url']);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(response);
    });
  });

  describe('updateItem', () => {
    it('should update item successfully', () => {
      const payload: ResDataModel = { id: '1', name: 'Updated', date: new Date().toISOString(), type: 'test' };

      service.updateItem(payload).subscribe(data => {
        expect(data).toEqual(payload);
      });

      const req = httpMock.expectOne(`${service['api_url']}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(payload);
    });
  });

  describe('deleteItem', () => {
    it('should delete item successfully', () => {
      service.deleteItem('1');
      const req = httpMock.expectOne(`${service['api_url']}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('handleError', () => {
    it('should handle client error', () => {
      const errorEvent = new ErrorEvent('Client Error', {
        message: 'Client side error'
      });

      const errorResponse = new HttpErrorResponse({
        error: errorEvent,
        status: 400
      });

      spyOn(console, 'error');
      service.handleError(errorResponse).subscribe({
        error: (error) => {
          expect(error.message).toContain('Something went wrong');
        },
      });

      expect(console.error).toHaveBeenCalledWith('An error occurred: Client side error');
    });

    it('should handle server error', () => {
      const errorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error'
      });

      spyOn(console, 'error');
      service.handleError(errorResponse).subscribe({
        error: (error) => {
          expect(error.message).toContain('Something went wrong');
        },
      });

      expect(console.error).toHaveBeenCalled();
    });
  });
});
