import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/cards';

  getCards(partOfSpeech?: string): Observable<Card[]> {
    let params = new HttpParams();
    if (partOfSpeech) {
      params = params.set('part_of_speech', partOfSpeech);
    }
    return this.http.get<Card[]>(this.apiUrl, { params }).pipe(map((cards) => this.shuffle(cards)));
  }

  getPartsOfSpeech(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/api/parts_of_speech');
  }

  private shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
