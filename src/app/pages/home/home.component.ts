import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  questionsCount = 10;
  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.quizService.getCategories().subscribe((data: any) => {
      this.categories = data.trivia_categories.sort(() => Math.random() - 0.5);

      this.categories = this.categories.slice(0, 10);
      if (this.categories.length > 0) {
        this.quizService.getQuestions(this.categories[0].id);
      }
    });
  }

  play(categoryId: number, categoryName: string): void {
    this.router.navigate(['/play', categoryId], {
      queryParams: { name: categoryName },
    });
  }

  playRandomQuiz(): void {
    if (this.categories.length > 0) {
      // Выбираем случайную категорию
      const randomIndex = Math.floor(Math.random() * this.categories.length);
      const randomCategory = this.categories[randomIndex];

      // Перенаправляем на страницу игры с выбранной категорией
      this.router.navigate(['/play', randomCategory.id], {
        queryParams: { name: randomCategory.name },
      });
    }
  }
}
