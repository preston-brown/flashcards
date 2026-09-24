import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../models/card';

@Injectable({
    providedIn: 'root'
})
export class CardService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000/api/cards';

    getCards(): Observable<Card[]> {
        return this.http.get<Card[]>(this.apiUrl);
    }

    failCard(cardId: string): void {
        console.log(`Card ${cardId} failed`);
    }

    passCard(cardId: string): void {
        console.log(`Card ${cardId} passed`);
    }
}
