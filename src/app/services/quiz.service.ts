import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'https://opentdb.com/api.php';
  private cache = new Map<number, any>();

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get('https://opentdb.com/api_category.php');
  }

  getQuestions(categoryId: number): Observable<any> {
    if (this.cache.has(categoryId)) {
      return of(this.cache.get(categoryId));
    }

    return this.http
      .get(`${this.apiUrl}?amount=10&category=${categoryId}`)
      .pipe(
        map((response) => {
          this.cache.set(categoryId, response);
          return response;
        })
      );
  }
}
