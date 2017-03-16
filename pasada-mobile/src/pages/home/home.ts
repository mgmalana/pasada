import { Component, ViewChild } from '@angular/core';

import { NavController, Slides } from 'ionic-angular';
import { SpeedPage } from '../speed/speed';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

export class HomePage {
 	@ViewChild(Slides) slides: Slides;

	constructor(public navCtrl: NavController) {

	}

	clickDiv() {
		this.slides.slideNext();
	}

	logout(){
		console.log("Logout!")
	}
}
