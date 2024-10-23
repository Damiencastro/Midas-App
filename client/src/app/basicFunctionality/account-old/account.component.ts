import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UserModel } from './account.model';
import { Users } from './account';
import { AccountService } from './account.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { LoginComponent } from '../login/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit{

  formValue !: FormGroup;
  userModelObj : UserModel = new UserModel();
  currentUserObj : UserModel = new UserModel();
  userData !: any;
  showAdd: boolean = false;
  showEdit:boolean = false;
  passwordHide: boolean = true;
  confirmPasswordHide: boolean = true;

  public userDetail: UserModel = new UserModel();



  constructor(private formbuilder: FormBuilder, private api : ApiService, private AccountService: AccountService, private router: Router){

    this.formValue = new FormGroup({
      username: new FormControl("",),
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl("", [Validators.required],),
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("",),
      street: new FormControl("",),
      zip: new FormControl("",),
      state: new FormControl("",),
      role: new FormControl("",),
      dob: new FormControl("",),
    },)
  }



  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('user') != null) {
        const temp = localStorage.getItem('user');
        if (temp != null) {
          this.userDetail = JSON.parse(temp);
        }
      }
    }

      this.getAllUsers();
  }

  private passwordMatchValidator( control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
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
    this.userModelObj.password = this.formValue.value.password;

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
    //return this.formValue.value.firstname.charAt(0)+this.formValue.value.lastname+"123";
    return "password123"
  }

  getAllUsers(){
      this.api.getUser().subscribe(res=>{
        this.userData = res;
      })
  }

  reloadPage(){
    window.location.reload()
  }


  deleteUser(row : any){

    this.api.deleteUser(row.id).subscribe(res=>{
      alert("User Has Been Deleted.")
      this.getAllUsers();
    })
  }

  createProfile(id: any, username: any){

    this.api.profile(id, username);

    this.router.navigate(['/user-profile'])
    //this.reloadPage();
  }



  onEdit(row: any){


    this.showEdit = true;
    this.showAdd = false;

    this.userModelObj.id = row.id;
    this.formValue.controls['firstname'].setValue(row.firstname);
    this.formValue.controls['username'].setValue(row.username);
    this.formValue.controls['password'].setValue(row.password);
    this.formValue.controls['confirmPassword'].setValue(row.password);
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
    this.userModelObj.username = this.formValue.value.username;


    this.api.updateUser(this.userModelObj, this.userModelObj.id).subscribe(res=>{
      alert("Updated Sucessfully!");
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllUsers();
    })

  }





}
