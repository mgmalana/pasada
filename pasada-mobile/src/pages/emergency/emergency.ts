import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Emergency page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-emergency',
  templateUrl: 'emergency.html'
})
export class EmergencyPage {
	emergency: Emergency;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.emergency = new Emergency;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EmergencyPage');
	}

}

export class Emergency{
	emergencyType: string = 'crash';
	remarks: string;
}
