import { Component } from '@angular/core';

@Component({
  selector: 'app-test-tiny',
  templateUrl: './test-tiny.component.html',
  styleUrls: ['./test-tiny.component.css'],
})
export class TestTinyComponent {
  html = `now: ${+new Date()}`;

  //config = {
  //  height: 500,
  //  menubar: false,
  //  plugins: [
  //    'advlist autolink lists link image charmap print preview anchor',
  //    'searchreplace visualblocks code fullscreen',
  //    'insertdatetime media table paste code help wordcount',
  //  ],
  //  toolbar:
  //    'undo redo | formatselect | ' +
  //    'bold italic backcolor | alignleft aligncenter ' +
  //    'alignright alignjustify | bullist numlist outdent indent | ' +
  //    'removeformat | help',
  //  content_css: '//www.tiny.cloud/css/codepen.min.css',
  //};
  config: any = {
    height: 500,
    // theme: "modern",
    // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
    selector: '#editor',
    plugins:
      //'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern',


    'a11ychecker advcode advlist advtable anchor autocorrect autolink autoresize autosave casechange charmap checklist code codesample directionality editimage emoticons export footnotes formatpainter fullscreen help image importcss inlinecss insertdatetime link linkchecker lists media mediaembed mentions mergetags nonbreaking pagebreak pageembed permanentpen powerpaste preview quickbars save searchreplace table tableofcontents template tinydrive tinymcespellchecker typography visualblocks visualchars wordcount',

    toolbar:
      'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
    image_advtab: true,
    imagetools_toolbar:
      'rotateleft rotateright | flipv fliph | editimage imageoptions',
    templates: [
      { title: 'Test template 1', content: 'Test 1' },
      { title: 'Test template 2', content: 'Test 2' },
    ],
    content_css: [
      '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
      '//www.tinymce.com/css/codepen.min.css',
    ],
    //setup: (editor) => {
    //  console.log(editor.ui);
    //},
  };
  ready(instance: any): void {
    console.log('ready', instance);
  }
}
