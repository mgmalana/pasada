import { Component, ViewChild } from '@angular/core';

import { NavController, Slides } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {EmergencyPage} from '../emergency/emergency';

import { AuthService } from '../../providers/auth-service';
import { LocationTracker } from '../../providers/location-tracker';
import {Subject} from 'rxjs/Subject';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})


export class HomePage {
	lat: number;
	lon: number;
	speed: number;

 	@ViewChild(Slides) slides: Slides;
	constructor(public navCtrl: NavController, private auth: AuthService, private loc: LocationTracker) {
		loc.getLocation().subscribe(locData =>{
			console.log(locData);
			this.lat = locData.lat;
			this.lon = locData.lon;
			this.speed = locData.speed;
		});

		loc.startTracking();
	}

	clickDiv() {
		this.slides.slideNext();
	}

	logout(){
		console.log("Logout!");
		this.loc.stopTracking();
		this.auth.logout().subscribe(succ => {
        	this.navCtrl.setRoot(LoginPage)
    	});
	}

	clickEmergency(){
		this.navCtrl.push(EmergencyPage);
	}
}
