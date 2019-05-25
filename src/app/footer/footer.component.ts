import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Misc } from '../core/models';
import { MenuService } from '../core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'bc-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit {
  public misc$: Observable<Misc>;
  public sanitizer: DomSanitizer;

  constructor(private menuSVC: MenuService, private domSanitizer: DomSanitizer) { }

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
    this.getMisc();
  }

  private getMisc() {
     this.misc$ = this.menuSVC.getMisc();
  }

}
