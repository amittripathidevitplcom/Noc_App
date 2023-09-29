import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AutoComplete } from 'primeng/autocomplete';



@Component({
  selector: 'app-college-details',
  templateUrl: './college-details.component.html',
  styleUrls: ['./college-details.component.css']
})
export class CollegeDetailsComponent implements OnInit {
  isSubmitted: boolean = false;
  isDisabledGrid: boolean = false;
  //@ViewChild("search") searchElement!: ElementRef;
  //@ViewChild('autoCompleteObject') private autoCompleteObject!: AutoComplete;

  @ViewChild('auto') auto: any;
  CourseMasterForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private el: ElementRef) { }
  ngOnInit(): void {
    this.CourseMasterForm = this.formBuilder.group(
      {
        txtSearch: [''],
        //txttest: ['', Validators.required]
        txttest: [{ value: '', disabled: true }, Validators.required],
        txttest2: [{ value: '', disabled: true }, Validators.required],
      })
  }

  get form() { return this.CourseMasterForm.controls; }


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
    this.isSubmitted = true;
    debugger;
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    if (invalidElements.length > 0) {
      console.log(invalidElements[0]);
      invalidElements[1].focus();
    }

    if (this.CourseMasterForm.invalid) {
      return
    }
    console.log(this.auto);
    this.auto.focus();
  }
  checkf() {
    console.log("ab");
    //this.CourseMasterForm.get('txttest')?.enable();
    this.CourseMasterForm.controls['txttest'].enable();
    this.CourseMasterForm.controls['txttest2'].enable();

    
    //this.isDisabledGrid = true;
    //console.log(this.isDisabledGrid);

    //this.isDisabledGrid = false;
  }
}
