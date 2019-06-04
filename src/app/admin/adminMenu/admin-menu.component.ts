import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../core/services';

@Component({
  templateUrl: './admin-menu.component.html'
})
export class AdminMenuComponent implements OnInit {
  constructor(private menuSVC: MenuService) {}

  public ngOnInit(): void {
    this.menuSVC.setTopNav('admin', '');
  }
}
