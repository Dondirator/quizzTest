import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent implements OnInit {
  isLoading = true;
  questions: any[] = [];
  currentQuestionIndex = 0;
  score = 0;
  quizForm: FormGroup;
  categoryName: string;
  startTime: number;
  userAnswers: any[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({
      answer: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadQuestions();
    this.categoryName = this.route.snapshot.queryParamMap.get('name');
    this.startTime = Date.now();
  }

  loadQuestions(): void {
    const categoryId = +this.route.snapshot.paramMap.get('id')!;
    this.quizService.getQuestions(categoryId).subscribe((data: any) => {
      this.questions = data.results;
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.isLoading = false;
    });
  }

  nextQuestion(): void {
    const selectedAnswer = this.quizForm.value.answer;
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    if (isCorrect) {
      this.score++;
    }

    this.userAnswers.push({
      question: currentQuestion.question,
      selectedAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correct_answer,
      isCorrect: isCorrect,
    });

    this.quizForm.reset();
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - this.startTime) / 1000);

      localStorage.setItem('userAnswers', JSON.stringify(this.userAnswers));

      this.router.navigate(['/finish'], {
        queryParams: {
          score: this.score,
          totalQuestions: this.questions.length,
          time: timeTaken,
        },
      });
    }
  }

  resetGame(): void {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.quizForm.reset();
    this.router.navigate(['/']);
  }
}
