// https://coryrylan.com/blog/angular-observable-data-services
// map filter scan mergeMap switchMap combineLatest concat do
// // Wrong:
//   Observable.interval(10000)
//     .switchMap(() => this.http.get(url))
//     .catch(err => Observable.empty())
//     .subscribe(data=> render(data))

// // Right:
// When handling errors, you probably want your catch inside of a merge operation.
// Observable.interval(10000)
//   .switchMap(() =>
//     this.http.get(url)
//       .catch(err => Observable.empty())
//       .retry(....)
//   )
//   .subscribe(data=> render(data))
// takeUntil take first takeWhile switch switchMap

// subscription rule of thumb:
//    more than two is probably too many
// rxjs rxjs/operators rxjs/testing rxjs/webSocket rxjs/ajax
// rxjs
      // Types: Observable, Subject, BehaviorSubject, etc.
      // Creation methods: fromEvent, timer, interval, delay, concat, etc.
      // Schedulers: asapScheduler, asyncScheduler, etc.
      // Helpers: pipe, noop, identity, etc.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, fromEvent, interval, asapScheduler, asyncScheduler } from 'rxjs';
import { map } from 'rxjs/operators';
import { renderComponent } from '@angular/core/src/render3';
import { elementClassProp } from '@angular/core/src/render3/instructions';
import { pipe } from '@angular/core/src/render3/pipe';

export interface Todo {
  id: number | string;
  createdAt: number;
  value: string;
}

@Injectable()
export class TodoService {
  todos: Observable<Todo[]>
  private _todos: BehaviorSubject<Todo[]>;
  private baseUrl: string;
  private dataStore: {
    todos: Todo[]
  };

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://56e05c3213da80110013eba3.mockapi.io/api';
    this.dataStore = { todos: [] };
    this._todos = <BehaviorSubject<Todo[]>>new BehaviorSubject([]);
    this.todos = this._todos.asObservable();
  }

  loadAll() {
    this.http.get(`${this.baseUrl}/todos`).subscribe(data => {
      this.dataStore.todos = data;
      this._todos.next(Object.assign({}, this.dataStore).todos);
    }, error => console.log('Could not load todos.'));
  }

  load(id: number | string) {
    this.http.get<Todo>(`${this.baseUrl}/todos/${id}`).subscribe(data => {
      let notFound = true;

      this.dataStore.todos.forEach((item, index) => {
        if (item.id === data.id) {
          this.dataStore.todos[index] = data;
          notFound = false;
        }
      });

      if (notFound) {
        this.dataStore.todos.push(data);
      }

      this._todos.next(Object.assign({}, this.dataStore).todos);
    }, error => console.log('Could not load todo.'));
  }

  create(todo: Todo) {
    this.http.post<Todo>(`${this.baseUrl}/todos`, JSON.stringify(todo)).subscribe(data => {
        this.dataStore.todos.push(data);
        this._todos.next(Object.assign({}, this.dataStore).todos);
      }, error => console.log('Could not create todo.'));
  }

  update(todo: Todo) {
    this.http.put<Todo>(`${this.baseUrl}/todos/${todo.id}`, JSON.stringify(todo))
      .subscribe(data => {
        this.dataStore.todos.forEach((t, i) => {
          if (t.id === data.id) { this.dataStore.todos[i] = data; }
        });

        this._todos.next(Object.assign({}, this.dataStore).todos);
      }, error => console.log('Could not update todo.'));
  }

  remove(todoId: number) {
    this.http.delete(`${this.baseUrl}/todos/${todoId}`).subscribe(response => {
      this.dataStore.todos.forEach((t, i) => {
        if (t.id === todoId) { this.dataStore.todos.splice(i, 1); }
      });

      this._todos.next(Object.assign({}, this.dataStore).todos);
    }, error => console.log('Could not delete todo.'));
  }
}
