import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation } from 'ionic-native';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LocationTracker {
 
	public watch: any;
	public locData: LocationData;
	private eventStream: Subject<LocationData>;

	constructor(public zone: NgZone) {
		this.locData = new LocationData();
		this.eventStream = new Subject();
	}

	startTracking() {
	  	this.updateLocationData({lon: 0,lat: 0,speed: 0}); //initialize values

	  	// Background Tracking
	    let config = {
	      desiredAccuracy: 10,
	      stationaryRadius: 20,
	      distanceFilter: 10, 
	      debug: true,
	      interval: 2000 
	    };

	    BackgroundGeolocation.configure((location) => {

			console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

			// Run update inside of Angular's zone
			this.zone.run(() => {
				this.updateLocationData(location);
			});

	     }, (err) => {

			console.log(err);

	     }, config);

	    // Turn ON the background-geolocation system.
	    BackgroundGeolocation.start();


	    // Foreground Tracking

		let options = {
			frequency: 3000, 
			enableHighAccuracy: true
		};

		this.watch = Geolocation.watchPosition(options).subscribe((position: Geoposition) => {
		 	if ((position as Geoposition).coords != undefined) {
				// Run update inside of Angular's zone
				this.zone.run(() => {
					this.updateLocationData(position.coords)

				});
		    }
		});
	}

	stopTracking() {
		console.log('stopTracking');
  		BackgroundGeolocation.finish();
  		this.watch.unsubscribe();
	}

	updateLocationData(location){
		let tempSpeed = location.speed;
		if(tempSpeed != undefined){
			this.locData.speed = tempSpeed;
		}

		this.locData.lat = location.latitude;
		this.locData.lon = location.longitude;
		this.eventStream.next(this.locData);
	}

	getLocation(): Observable<LocationData>{
		return this.eventStream.asObservable();
	}
	
}

export class LocationData{
	lat: number;
	lon: number;
	speed: number;
}