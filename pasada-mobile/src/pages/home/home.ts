import { Component, ViewChild } from '@angular/core';

import { NavController, Slides } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {EmergencyPage} from '../emergency/emergency';

import { AuthService} from '../../providers/auth-service'

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})


export class HomePage {
 	@ViewChild(Slides) slides: Slides;
	constructor(public navCtrl: NavController, private auth: AuthService) {

	}

	clickDiv() {
		this.slides.slideNext();
	}

	logout(){
		console.log("Logout!")
		this.auth.logout().subscribe(succ => {
        	this.navCtrl.setRoot(LoginPage)
    	});
	}

	clickEmergency(){
		this.navCtrl.push(EmergencyPage);
	}
}
