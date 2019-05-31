import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()

export class QuillService {

    public editorCreated(e, txtArea: HTMLTextAreaElement, editorForm: FormGroup) {
        const quill = e;
        txtArea = document.createElement('textarea');
        txtArea.setAttribute('formControlName', 'content');
        txtArea.style.cssText =
            `width: 100%;margin: 0px;
            background: rgb(29, 29, 29);
            box-sizing: border-box;color: rgb(204, 204, 204);
            font-size: 15px;outline: none;padding: 20px;
            line-height: 24px;
            font-family: Consolas, Menlo, Monaco, &quot;Courier New&quot;,
            monospace;position: absolute;top: 0;bottom: 0;border: none;display:none`;

        const htmlEditor = quill.addContainer('ql-custom');
        htmlEditor.appendChild(txtArea);
        txtArea.value = editorForm.controls.content.value;
        const customButton = document.querySelector('.ql-showHtml');
        customButton.addEventListener('click', () => {
            if (txtArea.style.display === '') {
                editorForm.controls.content.setValue(txtArea.value);
                // quill.pasteHTML(html);
            } else {
                txtArea.value = editorForm.controls.content.value;
            }
            txtArea.style.display = txtArea.style.display === 'none' ? '' : 'none';
        });
    }

    public maxLength(e) {
        // console.log(e);
        // if(e.editor.getLength() > 10) {
        //     e.editor.deleteText(10, e.editor.getLength());
        // }
    }

    public getEditorModules() {
      const modules = {
          toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],

              [{ header: 1 }, { header: 2 }],               // custom button values
              [{ list: 'ordered'}, { list: 'bullet' }],
              [{ script: 'sub'}, { script: 'super' }],      // superscript/subscript
              [{ indent: '-1'}, { indent: '+1' }],          // outdent/indent
              [{ direction: 'rtl' }],                         // text direction

              [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
              [{ font: [] }],
              [{ align: [] }],

              ['clean'],                                         // remove formatting button
              ['link', 'image', 'video'],
              ['showHtml'] // https://codepen.io/anon/pen/ZyEjrQ
          ]
      };
      return modules;
  }
}
