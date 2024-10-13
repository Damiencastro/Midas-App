import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { UserModel } from './account.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit{

  formValue !: FormGroup;
  userModelObj : UserModel = new UserModel();
  userData !: any;
  showAdd!: boolean;
  showEdit!:boolean;
  currentId: number = 0;

  constructor(private formbuilder: FormBuilder, private api : ApiService){}



  ngOnInit(): void {
      this.formValue = this.formbuilder.group({
        firstname: [''],
        lastname: [''],
        email: [''],
        phone: [''],
        street: [''],
        zip: [''],
        state: [''],
      })

      this.getAllUsers();
  }

  clickAddUser(){
    this.formValue.reset();
    this.showAdd = true;
    this.showEdit = false;
  }

  postUserDetails(){
    // this.userModelObj.id = this.currentId;
    // this.currentId++;
    this.userModelObj.email = this.formValue.value.email;
    this.userModelObj.firstname = this.formValue.value.firstname;
    this.userModelObj.lastname = this.formValue.value.lastname;
    this.userModelObj.phone = this.formValue.value.phone;
    this.userModelObj.street = this.formValue.value.street;
    this.userModelObj.zip = this.formValue.value.zip;
    this.userModelObj.state = this.formValue.value.state;
    this.userModelObj.username = this.makeUserName();

    this.api.postUser(this.userModelObj).subscribe(res=>{
      console.log(res);
      alert("User has been successfully added!")
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllUsers();
    },
    err=>{
      alert("User Creation Failed. Please try again.")
    })
  }



  makeUserName(): string{
    return this.formValue.value.firstname.charAt(0)+this.formValue.value.lastname;
  }

  getAllUsers(){
    this.api.getUser().subscribe(res=>{
      this.userData = res;
    })
  }

  deleteUser(row : any){
    this.api.deleteUser(row.id).subscribe(res=>{
      alert("User Has Been Deleted.")
      this.getAllUsers();
    })
  }



  onEdit(row: any){
    this.showEdit = true;
    this.showAdd = false;
    this.userModelObj.id = row.id;
    this.formValue.controls['firstname'].setValue(row.firstname);
    this.formValue.controls['lastname'].setValue(row.lastname);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['phone'].setValue(row.phone);
    this.formValue.controls['street'].setValue(row.street);
    this.formValue.controls['zip'].setValue(row.zip);
    this.formValue.controls['state'].setValue(row.state);
  }

  updateUserDetails(){
    this.userModelObj.email = this.formValue.value.email;
    this.userModelObj.firstname = this.formValue.value.firstname;
    this.userModelObj.lastname = this.formValue.value.lastname;
    this.userModelObj.phone = this.formValue.value.phone;
    this.userModelObj.street = this.formValue.value.street;
    this.userModelObj.zip = this.formValue.value.zip;
    this.userModelObj.state = this.formValue.value.state;
    this.userModelObj.username = this.makeUserName();


    this.api.updateUser(this.userModelObj, this.userModelObj.id).subscribe(res=>{
      alert("Updated Sucessfully!");
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllUsers();
    })
  }

}
