import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
/*import { AutoComplete } from 'primeng/autocomplete';*/



@Component({
  selector: 'app-college-details',
  templateUrl: './college-details.component.html',
  styleUrls: ['./college-details.component.css']
})
export class CollegeDetailsComponent implements OnInit {
  //@ViewChild("search") searchElement!: ElementRef;
  //@ViewChild('autoCompleteObject') private autoCompleteObject!: AutoComplete;
   
  @ViewChild('auto') auto: any;
  CourseMasterForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.CourseMasterForm = this.formBuilder.group(
      {
        txtSearch: ['']
      })
  }




  keyword = 'name';
  data = [
    {
      id: 1,
      name: 'Georgia'
    },
    {
      id: 2,
      name: 'Usa'
    },
    {
      id: 3,
      name: 'England'
    }
  ];





  selectEvent(item: any) {
    // do something with selected item
  }



  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }



  onFocused(e: any) {
    // do something when input is focused
  }



 

  show() {
    console.log(this.auto);
    this.auto.focus();
    //setTimeout(() => {
    //  // this will make the execution after the above boolean has changed
    //  this.searchElement.nativeElement.focus();
    //}, 0);



    //this.autoCompleteObject.focusInput();
  }
}
