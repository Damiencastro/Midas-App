import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { UserModel } from '../account/account.model';
import { Users } from '../account/account';
import { AccountService } from '../account/account.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  formValue !: FormGroup;
  userModelObj: UserModel = new UserModel();
  userData !: any;
  showAdd: boolean = false;
  showEdit: boolean = false;
  passwordHide: boolean = false;
  confirmPasswordHide: boolean = false;

  constructor(private formbuilder: FormBuilder, private api: ApiService, private AccountService: AccountService, private router: Router) { }

  ngOnInit(): void {

    this.formValue = this.formbuilder.group({
      username: [''],
      password: [''],
      confirmpassword: [''],
      firstname: [''],
      lastname: [''],
      email: [''],
      phone: [''],
      street: [''],
      zip: [''],
      state: [''],
      role: [''],
    })

    this.getAllUsers();
  }

  clickAddUser(){
    this.formValue.reset();
    this.showAdd = true;
    this.showEdit = false;
  }

  postUserDetails(){

    this.userModelObj.email = this.formValue.value.email;
    this.userModelObj.firstname = this.formValue.value.firstname;
    this.userModelObj.lastname = this.formValue.value.lastname;
    this.userModelObj.role = this.formValue.value.role;
    this.userModelObj.phone = this.formValue.value.phone;
    this.userModelObj.street = this.formValue.value.street;
    this.userModelObj.zip = this.formValue.value.zip;
    this.userModelObj.state = this.formValue.value.state;
    this.userModelObj.username = this.makeUserName();
    this.userModelObj.password = this.makePass();

    this.api.postUser(this.userModelObj).subscribe(res=>{
      console.log(res);
      alert("User has been successfully added!")
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllUsers();

    });

  }



  makeUserName(): string{
    return this.formValue.value.firstname.charAt(0)+this.formValue.value.lastname;
  }

  makePass(): string{
    return this.formValue.value.firstname.charAt(0)+this.formValue.value.lastname+"123";
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
    // this.users.id = row.id

    this.formValue.controls['firstname'].setValue(row.firstname);
    this.formValue.controls['username'].setValue(row.username);
    this.formValue.controls['password'].setValue(row.password);
    this.formValue.controls['lastname'].setValue(row.lastname);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['phone'].setValue(row.phone);
    this.formValue.controls['street'].setValue(row.street);
    this.formValue.controls['zip'].setValue(row.zip);
    this.formValue.controls['state'].setValue(row.state);
    this.formValue.controls['role'].setValue(row.role);
  }

  updateUserDetails(){
    this.userModelObj.email = this.formValue.value.email;
    this.userModelObj.firstname = this.formValue.value.firstname;
    this.userModelObj.lastname = this.formValue.value.lastname;
    this.userModelObj.phone = this.formValue.value.phone;
    this.userModelObj.street = this.formValue.value.street;
    this.userModelObj.zip = this.formValue.value.zip;
    this.userModelObj.state = this.formValue.value.state;
    this.userModelObj.role = this.formValue.value.role;
    this.userModelObj.password = this.formValue.value.password;
    this.userModelObj.username = this.makeUserName();


    this.api.updateUser(this.userModelObj, this.userModelObj.id).subscribe(res=>{
      alert("Updated Sucessfully!");
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllUsers();
    })

    this.router.navigate(['/account']);


  }

}
