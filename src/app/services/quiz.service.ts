import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'https://opentdb.com/api.php';
  private cache = new Map<number, any>(); // Кэш для хранения запросов

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get('https://opentdb.com/api_category.php');
  }

  getQuestions(categoryId: number): Observable<any> {
    // Проверка кэша
    if (this.cache.has(categoryId)) {
      return of(this.cache.get(categoryId));
    }

    // Если в кэше нет данных, выполняем запрос
    return this.http
      .get(`${this.apiUrl}?amount=10&category=${categoryId}`)
      .pipe(
        map((response) => {
          this.cache.set(categoryId, response); // Сохраняем результат в кэш
          return response;
        })
      );
  }
}
