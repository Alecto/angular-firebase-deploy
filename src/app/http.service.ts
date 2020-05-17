import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const url = 'https://angular-firebase-deploy-e3d15.firebaseio.com/posts';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

export interface Task {
  id?: string;
  title: string;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  post(task: Task): Observable<Task> {
    return this.http.post<Task>(`${url}.json`, task, httpOptions).pipe(
      map((res: any) => {
        console.log('POST:', res);
        return {
          id: res.name,
          title: task.title,
          date: task.date
        };
      }),
      catchError(this.errorHandler<Task>('POST'))
    );
  }

  get(): Observable<Task[]> {
    return this.http.get<Task[]>(`${url}.json`, httpOptions).pipe(
      tap(res => console.log('GET:', res)),
      catchError(this.errorHandler<Task[]>('GET'))
    );
  }

  update(task: Task): Observable<Task> {
    const body: Task = {title: task.title, date: task.date};

    return this.http.put<Task>(`${url}/${task.id}.json`, body, httpOptions).pipe(
      tap(res => console.log('PUT:', res)),
      catchError(this.errorHandler<Task>('PUT'))
    );
  }

  delete(task: Task): Observable<Task> {
    return this.http.delete<Task>(`${url}/${task.id}.json`, httpOptions).pipe(
      tap(res => console.log('DELETE:', res)),
      catchError(this.errorHandler<Task>('DELETE'))
    );
  }

  // Обрабатываем ошибку и продолжаем работу приложения.
  private errorHandler<T>(operation: string, res?: T) {
    return (err: any): Observable<T> => {
      console.error(`${operation} failed: ${err}`);
      return of(res as T);
    };
  }
}
