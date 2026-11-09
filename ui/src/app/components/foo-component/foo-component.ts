import {
  Component,
  computed,
  effect,
  linkedSignal,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { CardService } from '../../services/card-service';
import { Card } from '../../models/card';

@Component({
  selector: 'app-foo-component',
  styleUrl: './foo-component.css',
  templateUrl: './foo-component.html',
})
export class FooComponent {
  private readonly cardService = inject(CardService);
  readonly partsOfSpeech = toSignal(this.cardService.getPartsOfSpeech(), {
    initialValue: [] as string[],
  });
  readonly chapters = toSignal(this.cardService.getChapters(), {
    initialValue: [] as number[],
  });
  readonly selectedPartOfSpeech = signal<string>('');
  readonly selectedChapter = signal<number | null>(null);
  readonly cardsResource = rxResource({
    params: () => ({
      partOfSpeech: this.selectedPartOfSpeech(),
      chapter: this.selectedChapter(),
    }),
    stream: (context) => {
      const partOfSpeech = context.params.partOfSpeech;
      const chapter = context.params.chapter || undefined;
      return this.cardService.getCards(chapter, partOfSpeech).pipe(map((cards) => this.shuffle(cards)));
    },
  });
  readonly currentCard = computed(() => {
    return this.untestedCards()[0];
  });
  readonly untestedCards = linkedSignal<Card[] | undefined, Card[]>({
    source: () => this.cardsResource.value(),
    computation: (cards) => [...(cards ?? [])],
  });
  readonly totalCards = computed(() => this.cardsResource.value()?.length ?? 0);

  frontFacing = true;
  readonly completedCards = signal(0);
  readonly errors = signal(0);

  onChapterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedChapter.set(value === '' ? null : Number(value));
    this.completedCards.set(0);
    this.errors.set(0);
  }

  onPartOfSpeechChange(event: Event): void {
    this.selectedPartOfSpeech.set((event.target as HTMLSelectElement).value);
    this.completedCards.set(0);
    this.errors.set(0);
  }

  private shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  private isFormControlEvent(event: KeyboardEvent): boolean {
    return event.target instanceof HTMLSelectElement;
  }

  @HostListener('window:keydown.space', ['$event'])
  handleSpaceKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.isFormControlEvent(keyboardEvent)) {
      return;
    }
    keyboardEvent.preventDefault();
    if (!keyboardEvent.repeat) {
      this.frontFacing = !this.frontFacing;
    }
  }

  @HostListener('window:keydown.f', ['$event'])
  handlePassKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.isFormControlEvent(keyboardEvent)) {
      return;
    }
    keyboardEvent.preventDefault();
    if (!keyboardEvent.repeat) {
      this.advanceCard(false);
      this.completedCards.set(this.completedCards() + 1);
    }
  }

  @HostListener('window:keydown.a', ['$event'])
  handleFailKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.isFormControlEvent(keyboardEvent)) {
      return;
    }
    keyboardEvent.preventDefault();
    if (!keyboardEvent.repeat) {
      this.advanceCard(true);
      this.errors.set(this.errors() + 1);
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
