import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation } from 'ionic-native';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class LocationTracker {
 
	public watch: any;
	public locData: LocationData;
	private eventStream: Subject<LocationData>;

	constructor(public zone: NgZone, private http: Http) {
		this.locData = new LocationData();
		this.eventStream = new Subject();
	}

	startTracking() {
	  	this.updateLocationData({longitude: 121.0205595,latitude: 14.4144727,speed: 0}); //initialize values
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
		if(location.speed){
			this.locData.speed = location.speed * 3.6; //because min/sec to km/hr
		}
		if(location.latitude){
			this.locData.lat = location.latitude;
		}
		if(location.longitude){
			this.locData.lon = location.longitude;
		}

		this.eventStream.next(this.locData);
	}

	getLocation(): Observable<LocationData>{
		return this.eventStream.asObservable();
	}
	
	getSpeedLimit(){
		console.log('https://www.overpass-api.de/api/interpreter?data=[out:json];way[%22maxspeed:hgv%22]('+
       		this.locData.lat+','+this.locData.lon+','+this.locData.lat+','+this.locData.lon+');out%20meta;');

       return Observable.interval(10000).flatMap(() => this.http.get('https://www.overpass-api.de/api/interpreter?data=[out:json];way[%22maxspeed:hgv%22]('+
       		(this.locData.lat - 0.0000001) +','+(this.locData.lon - 0.0000001)+','+this.locData.lat+','+this.locData.lon+');out%20meta;')
        .map((res:Response) => res.json()));

       // return Observable.interval(10000).flatMap(() => this.http.get('https://www.overpass-api.de/api/interpreter?data=[out:json];way[%22maxspeed:hgv%22](14.4144727,121.0205595,14.4144728,121.0205595);out%20meta;')
       //  .map((res:Response) => res.json()));
  	}

}

export class LocationData{
	lat: number;
	lon: number;
	speed: number;
}