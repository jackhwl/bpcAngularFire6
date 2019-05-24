import { Component, OnInit} from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { Misc } from '../core/models';
import { MenuService } from '../core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'bc-footer',
  styleUrls: [ './footer.component.css' ],
  templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit {
  public misc$: Observable<Misc>;

  constructor(private menuSVC: MenuService, private sanitizer: DomSanitizer) { }

  public ngOnInit() {
    this.getMisc();
  }

  public getMisc() {
     this.misc$ = this.menuSVC.getMisc();
  }

}
