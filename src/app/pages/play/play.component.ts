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
  questions: any[] = [];
  currentQuestionIndex = 0;
  score = 0;
  quizForm: FormGroup;
  categoryName: string;
  startTime: number; // Для отслеживания времени начала
  userAnswers: any[] = []; // Массив для хранения ответов пользователя

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
    this.startTime = Date.now(); // Инициализация времени начала
  }

  loadQuestions(): void {
    const categoryId = +this.route.snapshot.paramMap.get('id')!;
    this.quizService.getQuestions(categoryId).subscribe((data: any) => {
      this.questions = data.results;
      this.currentQuestionIndex = 0; // Start from the first question
      this.score = 0; // Reset score
    });
  }

  nextQuestion(): void {
    const selectedAnswer = this.quizForm.value.answer;
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    if (isCorrect) {
      this.score++;
    }

    // Сохраняем вопрос, выбранный ответ и правильный ответ
    this.userAnswers.push({
      question: currentQuestion.question,
      selectedAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correct_answer,
      isCorrect: isCorrect,
    });

    this.quizForm.reset();
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      const endTime = Date.now(); // Время завершения
      const timeTaken = Math.round((endTime - this.startTime) / 1000); // Время в секундах

      // Сохраняем ответы в localStorage
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
    this.router.navigate(['/']); // Navigate to home or another appropriate route
  }
}
