import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Misc } from '../core/models';
import { MenuService } from '../core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'bc-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  @Output() public onHeaderNavbarReady: EventEmitter<string> = new EventEmitter();
  public misc$: Observable<Misc>;
  public sanitizer: DomSanitizer;

  constructor(private menuSVC: MenuService, private domSanitizer: DomSanitizer) { }

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
    this.getMisc();
  }

  public navbarReady(data: string) {
    console.log('nav ready from child: ', data);
    this.onHeaderNavbarReady.emit('looks like navbar  ready:' + data);
  }

  private getMisc() {
     this.misc$ = this.menuSVC.getMisc();
  }
}
