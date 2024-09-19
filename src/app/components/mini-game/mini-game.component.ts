import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mini-game',
  templateUrl: './mini-game.component.html',
  styleUrl: './mini-game.component.scss',
})
export class MiniGameComponent {
  @Input() category: string = '';
  @Input() categoryId: number = 0;

  constructor(private router: Router) {}

  playGame() {
    this.router.navigate(['/play'], {
      queryParams: { categoryId: this.categoryId },
    });
  }
}
