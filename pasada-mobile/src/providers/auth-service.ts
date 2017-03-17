import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
 
export class User {
  name: string;
  plateNumber: string;
  company: string;

 
  constructor(name: string, plateNumber: string, company: string) {
    this.name = name;
    this.plateNumber = plateNumber;
    this.company = company;
  }
}
 
@Injectable()
export class AuthService {
  currentUser: User;
 
  public login(credentials) {
	if (credentials.email === null || credentials.password === null) {
		return Observable.throw("Please insert credentials");
	} else {
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			let access = (credentials.password === "pass" && credentials.email === "miko.santos@gmail.com");
			this.currentUser = new User('Dino Salvacion', 'ZZZ 999', 'TasTrans');
			observer.next(access);
			observer.complete();
		});
	}
  }

 
	public getUserInfo() : User {
		return this.currentUser;
	}

	public getUserStringInfo(): String{
		return this.currentUser.name + ", " + this.currentUser.plateNumber +", "+ this.currentUser.company;
	}
 
	public logout() {
	return Observable.create(observer => {
		this.currentUser = null;
		observer.next(true);
		observer.complete();
	});
	}
}
