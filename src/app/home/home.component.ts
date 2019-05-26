import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../core/services';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
  public sanitizer: DomSanitizer;
  constructor(private menuSVC: MenuService,
              private route: ActivatedRoute,
              private domSanitizer: DomSanitizer) {}

  public ngOnInit() {
    this.sanitizer = this.domSanitizer;
    console.log('home menu=', this.route.snapshot.params['menu']);
    this.menuSVC.setTopNav(this.route.snapshot.params['menu'], this.route.snapshot.params['sub']);
    //this.menuSVC.getNav(this.route.snapshot.params['menu'], this.route.snapshot.params['sub']);
    this.menuSVC.getMisc();
  }
}
