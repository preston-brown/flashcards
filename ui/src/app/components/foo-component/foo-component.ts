import { Component, computed, effect, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CardService } from '../../services/card-service';
import { Card } from '../../models/card';

@Component({
  selector: 'app-foo-component',
  styleUrl: './foo-component.css',
  templateUrl: './foo-component.html',
})
export class FooComponent {
  private readonly cardService = inject(CardService);
  readonly fetchedCards = toSignal(this.cardService.getCards(), {
    initialValue: [],
  });
  readonly untestedCards = signal<Card[]>([]);
  frontFacing = true;

  readonly currentCard = computed(() => {
    return this.untestedCards()[0];
  });

  constructor() {
    effect(() => {
      const fetchedCards = this.fetchedCards();
      if (fetchedCards?.length) {
        this.untestedCards.set([...fetchedCards]);
      }
    });
  }

  @HostListener('window:keydown.space', ['$event'])
  handleSpaceKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    if (!keyboardEvent.repeat) {
      this.frontFacing = !this.frontFacing;
    }
  }

  @HostListener('window:keydown.f', ['$event'])
  handlePassKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    if (!keyboardEvent.repeat) {
      this.advanceCard(false);
    }
  }

  @HostListener('window:keydown.a', ['$event'])
  handleFailKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    if (!keyboardEvent.repeat) {
      this.advanceCard(true);
    }
  }

  private advanceCard(retainCurrentCard: boolean) {
    const cards = this.untestedCards();
    if (!cards.length) {
      return;
    }
    const [current, ...rest] = this.untestedCards();
    if (retainCurrentCard) {
      this.untestedCards.set([...rest, current]);
    } else {
      this.untestedCards.set([...rest]);
    }
    this.frontFacing = true;
  }
}
