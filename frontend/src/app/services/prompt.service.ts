import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

export interface Tag {
  id?: number;
  name: string;
  color?: string;
}

export interface Prompt {
  id?: number;
  title: string;
  content: string;
  complexity: number;
  created_at?: string;
  view_count?: number;
  tags?: Tag[];
  author_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private STORAGE_KEY = 'promptly_local_data';
  private prompts: Prompt[] = [];

  constructor() {
    this.loadFromStorage();
    if (this.prompts.length === 0) {
      this.seedData();
    }
  }

  private loadFromStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this.prompts = JSON.parse(data);
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.prompts));
  }

  private seedData() {
    this.prompts = [
      {
        id: 1,
        title: 'Creative Writing Assistant',
        content: 'I want you to act as a creative writing assistant. I will provide you with a genre and a few character traits, and you will help me brainstorm plot points and dialogue.',
        complexity: 3,
        created_at: new Date().toISOString(),
        view_count: 120,
        tags: [{ name: 'Creative', color: '#6366f1' }, { name: 'Writing', color: '#8b5cf6' }]
      },
      {
        id: 2,
        title: 'Code Bug Finder',
        content: 'Scan the following code for potential security vulnerabilities and performance bottlenecks. Provide a detailed report of your findings.',
        complexity: 7,
        created_at: new Date().toISOString(),
        view_count: 85,
        tags: [{ name: 'Code', color: '#ec4899' }, { name: 'Security', color: '#f43f5e' }]
      }
    ];
    this.saveToStorage();
  }

  getPrompts(): Observable<Prompt[]> {
    return of([...this.prompts]).pipe(delay(500));
  }

  getPrompt(id: number): Observable<Prompt> {
    const prompt = this.prompts.find(p => p.id === id);
    if (prompt) {
      return of({ ...prompt }).pipe(delay(300));
    }
    return throwError(() => new Error('Prompt not found'));
  }

  addPrompt(prompt: any): Observable<Prompt> {
    const newPrompt: Prompt = {
      ...prompt,
      id: Date.now(),
      created_at: new Date().toISOString(),
      view_count: 0,
      tags: prompt.tags?.map((t: string) => ({ name: t, color: '#6366f1' })) || []
    };
    this.prompts.unshift(newPrompt);
    this.saveToStorage();
    return of(newPrompt).pipe(delay(800));
  }

  updatePrompt(id: number, prompt: any): Observable<Prompt> {
    const index = this.prompts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.prompts[index] = { 
        ...this.prompts[index], 
        ...prompt,
        tags: prompt.tags?.map((t: string) => ({ name: t, color: '#6366f1' })) || this.prompts[index].tags
      };
      this.saveToStorage();
      return of(this.prompts[index]).pipe(delay(800));
    }
    return throwError(() => new Error('Prompt not found'));
  }

  deletePrompt(id: number): Observable<any> {
    this.prompts = this.prompts.filter(p => p.id !== id);
    this.saveToStorage();
    return of(null).pipe(delay(500));
  }

  getTags(): Observable<Tag[]> {
    const allTags: Tag[] = [];
    this.prompts.forEach(p => p.tags?.forEach(t => {
      if (!allTags.find(at => at.name === t.name)) {
        allTags.push(t);
      }
    }));
    return of(allTags).pipe(delay(300));
  }
}
