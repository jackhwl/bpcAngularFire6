import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Misc } from '../core/models';
import { MenuService } from '../core/services';

@Component({
  selector: 'bc-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  public misc$: Observable<Misc>;
  public sanitizer: DomSanitizer;

  constructor(private menuSVC: MenuService, private domSanitizer: DomSanitizer) { }

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
    this.getMisc();
  }

  private getMisc() {
     this.misc$ = this.menuSVC.getMisc$();
  }
}
