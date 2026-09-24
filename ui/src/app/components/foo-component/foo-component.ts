import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CardService } from '../../services/card-service';

@Component({
  imports: [],
  selector: 'app-foo-component',
  styleUrl: './foo-component.css',
  templateUrl: './foo-component.html',
})
export class FooComponent {
  private readonly cardService = inject(CardService);
  readonly cards = toSignal(this.cardService.getCards(), {
    initialValue: null,
  })
  readonly cardPosition = signal(0);
  frontFacing = true;

  readonly card = computed(() => {
    const cards = this.cards();
    return cards?.[this.cardPosition()]
  })

  nextCard() {
    const cards = this.cards();
    if (cards && this.cardPosition() < cards.length) {
      this.cardPosition.update(x => x + 1);
      this.frontFacing = true;
    }
  }

  @HostListener('window:keydown.space', ['$event'])
  handleSpaceKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    if (!keyboardEvent.repeat) {
      this.frontFacing = !this.frontFacing
    }
  }

  @HostListener('window:keydown.f', ['$event'])
  handlePassKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    if (!keyboardEvent.repeat) {
      this.nextCard();
    }
  }

  @HostListener('window:keydown.a', ['$event'])
  handleFailKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    if (!keyboardEvent.repeat) {
      this.nextCard();
    }
  }
}
