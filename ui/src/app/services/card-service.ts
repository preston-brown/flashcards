import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/cards';

  getCards(chapter?: number, partOfSpeech?: string): Observable<Card[]> {
    const params: Record<string, string | number> = {};
    if (chapter) params['chapter'] = chapter;
    if (partOfSpeech) params['part_of_speech'] = partOfSpeech;
    return this.http.get<Card[]>(this.apiUrl, { params });
  }

  getPartsOfSpeech(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/api/parts_of_speech');
  }

  getChapters(): Observable<number[]> {
    return this.http.get<number[]>('http://localhost:3000/api/chapters');
  }
}
