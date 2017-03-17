import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import { AuthService } from '../../providers/auth-service';

import { SMS } from 'ionic-native';

@Component({
  selector: 'page-emergency',
  templateUrl: 'emergency.html'
})
export class EmergencyPage {
	emergency: Emergency;

	constructor(public navCtrl: NavController, public navParams: NavParams, private loc: LocationTracker, private auth: AuthService) {
		this.emergency = new Emergency;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EmergencyPage');
	}

	sendEmergency() {
		this.loc.getPhoneNumberOfPolice().subscribe(response =>{
			let elements = response.json().elements;

			for(let element of elements){
				if(element.tags.phone != undefined){
					this.sendText(element.tags.phone);
					break;
				}
			}

		});
	}

	sendText(phoneNumber) {
		this.loc.getReadableLocation().subscribe(response =>{
			var message = "EMERGENCY: \n"+
				this.auth.getUserStringInfo+ "\n"+
				this.emergency.emergencyType + " at " + response.json().display_name +
				". Remarks: " + this.emergency.remarks;
			sendSMS(message);
			
		},()=>{ //error. so still send using lat long location.
			var message = "EMERGENCY: \n" +
			this.auth.getUserStringInfo+ "\n"+ 
			this.emergency.emergencyType + " at " + this.loc.locData.lat  +
			", " + this.loc.locData.lon + ". Remarks: " + this.emergency.remarks;
			sendSMS(message);
		})

		
		function sendSMS(message){
			var options={
				replaceLinebreaks: false,
				android:{
					intent: ''
				}
			}
			SMS.send(phoneNumber, message, options).then(()=>{
				console.log('Sent text  to' + phoneNumber + " message: " + message);
			},()=>{
				alert("Failure to send message");
			})
		}

	}
}

export class Emergency{
	emergencyType: string = 'crash';
	remarks: string;
}
