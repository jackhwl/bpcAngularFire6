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


  public updateMisc() {
  //   if (this.headerChoice) {
  //     this.menuAdminSVC.editMisc(
  //       this.headerChoice,
  //       this.txtArea.style.display === 'none'
  //         ? this.editorForm.controls.editContent.value
  //         : this.txtArea.value
  //     );
  //   }
  //   this.headerChoice = '';
  // }
}
