import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.scss',
})
export class FinishComponent implements OnInit {
  score: number = 0;
  totalQuestions: number = 0;
  timeTaken: number = 0;
  additionalStat1: number = 0; // Среднее время на вопрос
  additionalStat2: number = 0; // Процент правильных ответов
  userAnswers: any[] = []; // Для хранения ответов пользователя

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.score = +this.route.snapshot.queryParamMap.get('score')!;
    this.totalQuestions =
      +this.route.snapshot.queryParamMap.get('totalQuestions')!;
    this.timeTaken = +this.route.snapshot.queryParamMap.get('time')!;

    // Получаем ответы из localStorage
    const savedAnswers = localStorage.getItem('userAnswers');
    this.userAnswers = savedAnswers ? JSON.parse(savedAnswers) : [];

    // Логируем, чтобы убедиться, что данные были получены
    console.log('Received User Answers from localStorage:', this.userAnswers);

    this.additionalStat1 = this.calculateAverageTimePerQuestion();
    this.additionalStat2 = this.calculateAdditionalStat2();
  }

  calculateAverageTimePerQuestion(): number {
    return +(this.timeTaken / this.totalQuestions).toFixed(2);
  }

  calculateAdditionalStat2(): number {
    // Процент правильных ответов
    return +((this.score / this.totalQuestions) * 100).toFixed(2);
  }

  resetGame(): void {
    // Очищаем данные из localStorage после окончания игры
    localStorage.removeItem('userAnswers');
    this.router.navigate(['/']); // Навигация на главную страницу
  }
}
