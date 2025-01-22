import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable, throwError } from 'rxjs';

export interface DataModel {
    type: string;
    name: string;
    date: string;
}

export interface ResDataModel {
    id: string;
    type: string;
    name: string;
    date: string;
}

@Injectable({
    providedIn: 'root'
})
export class HomeServiceService {
    private readonly api_url = 'api.someUrl.com';
    constructor(
        private http: HttpClient
    ) { }
    
    buildHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Custom-Header': 'CustomHeaderValue'
        });
    }

    getData(): Observable<DataModel[]> {
        const headers = this.buildHeaders();

        return this.http.get<DataModel[]>(this.api_url, { headers }).pipe(
            map((response: DataModel[]) => response),
            catchError(this.handleError)
        );
    }

    createNew(payload: DataModel): Observable<ResDataModel> {
        return this.http.post<ResDataModel>(this.api_url, payload).pipe(
            catchError(this.handleError)
        );
    };

    updateItem(payload: ResDataModel): Observable<ResDataModel> {
        const id = payload.id;
        return this.http.put<ResDataModel>(`${this.api_url}/${id}`, payload).pipe(
            catchError(this.handleError)  
        );
    }

    deleteItem(id: string): void {
        this.http.delete<void>(`${this.api_url}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error(`An error occurred: ${error.message}`);
        } else {
            console.error(`
                Server error status: ${error.status},` + `Error body: ${error.error}`
            );
        };
        return throwError(() => new Error(`Something went wrong. Please try again later.`));
    }

    async videoAdSearch(term: string): Promise<DataModel[]> {
        const headers = this.buildHeaders();
        //const filtersParams = onlyValidAds ? `?onlyValidAds=${onlyValidAds}` : '';
        return await lastValueFrom(this.http.get<{ data: DataModel[], error: string }>(`/video-ads/search/${term}`, {headers}))
            .then((res) => {
                return res.data;
            });
    }
}
