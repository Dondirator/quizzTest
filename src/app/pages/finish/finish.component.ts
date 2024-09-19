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
  additionalStat1: number = 0;
  additionalStat2: number = 0;
  userAnswers: any[] = [];
  showAnswer = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.score = +this.route.snapshot.queryParamMap.get('score')!;
    this.totalQuestions =
      +this.route.snapshot.queryParamMap.get('totalQuestions')!;
    this.timeTaken = +this.route.snapshot.queryParamMap.get('time')!;

    const savedAnswers = localStorage.getItem('userAnswers');
    this.userAnswers = savedAnswers ? JSON.parse(savedAnswers) : [];

    this.additionalStat1 = this.calculateAverageTimePerQuestion();
  }

  calculateAverageTimePerQuestion(): number {
    return +(this.timeTaken / this.totalQuestions).toFixed(2);
  }

  resetGame(): void {
    localStorage.removeItem('userAnswers');
    this.router.navigate(['/']);
  }
  showAnswers() {
    return (this.showAnswer = !this.showAnswer);
  }
}
