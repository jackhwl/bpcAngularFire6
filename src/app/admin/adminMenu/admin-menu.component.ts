import { Component, OnInit } from '@angular/core';
import { UserService, MenuService } from '../../core/services';
import { Router } from '@angular/router';
import { MenuAdminService } from '../adminShared/menu-admin.service';
import { Misc } from '../../core/models';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  templateUrl: './admin-menu.component.html'
})
export class AdminMenuComponent implements OnInit {
  public editorForm: FormGroup;
  public theUser: string;
  public headerChoice: string = '';
  public misc: Misc;
  public editorStyle = {
    height: '200px',
    // width: '90vw',
    backgroundColor: '#fff'
  };
  public modules: any;
  public txtArea: HTMLTextAreaElement;

  // misc$: FirebaseObjectObservable<Misc>;

  constructor(
    private menuAdminSVC: MenuAdminService,
    private menuSVC: MenuService,
    private userSVC: UserService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.editorForm = new FormGroup({
      editContent: new FormControl(),
      sourceContent: new FormControl(),
      quillEditor: new FormControl()
    });
    this.modules = this.menuAdminSVC.getEditorModules();
    this.menuSVC.setTopNav('admin', null);
    this.getMisc();
  }

  public editorCreated(e) {
    const quill = e;
    this.txtArea = document.createElement('textarea');
    this.txtArea.setAttribute('formControlName', 'sourceContent');
    this.txtArea.style.cssText =
      `width: 100%;margin: 0px;
      background: rgb(29, 29, 29);
      box-sizing: border-box;color: rgb(204, 204, 204);
      font-size: 15px;outline: none;padding: 20px;
      line-height: 24px;
      font-family: Consolas, Menlo, Monaco, &quot;Courier New&quot;,
      monospace;position: absolute;top: 0;bottom: 0;border: none;display:none`;

    const htmlEditor = quill.addContainer('ql-custom');
    htmlEditor.appendChild(this.txtArea);
    this.txtArea.value = this.editorForm.controls.editContent.value;
    const customButton = document.querySelector(
      '.ql-showHtml'
    ) as HTMLButtonElement;
    customButton.addEventListener('click', () => {
      if (this.txtArea.style.display === '') {
        this.editorForm.controls.editContent.setValue(this.txtArea.value);
        // quill.pasteHTML(html);
      } else {
        this.txtArea.value = this.editorForm.controls.editContent.value;
      }
      this.txtArea.style.display =
        this.txtArea.style.display === 'none' ? '' : 'none';
    });
  }

  public chooseMode(mode: string) {
    const content =
      mode === 'header' ? this.misc.header.content :
      this.misc.footer.content; //this.menuSVC.misc.footer.content;
    this.editorForm.controls.editContent.setValue(content);
    this.headerChoice = mode;
  }

  // public updateMisc() {
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

  public getMisc(): any {
    this.menuSVC.getMisc().subscribe((data) => (this.misc = data));
  }

  // logout(){
  //     this.userSVC.logout();
  //     this.router.navigate(['']);
  // }

  public maxLength(e) {
    // console.log(e);
    // if(e.editor.getLength() > 10) {
    //     e.editor.deleteText(10, e.editor.getLength());
    // }
  }
}
