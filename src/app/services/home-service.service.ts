import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

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

    getData(): Observable<DataModel[]> {
        return this.http.get<DataModel[]>(this.api_url).pipe(
            map((response: DataModel[]) => response),
            catchError(this.handleError)
        )
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
}
