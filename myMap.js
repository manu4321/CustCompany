 /*
 /	Manuel Freites
 */
 
/*
 *Map 
 */
 
 var completeMap;
 var lineRoute;
 //Function that will create individualMap for the infoPage
function individualMap(geolocation, content)  {
	if(geolocation !== "N0N"){
		geolocation = getLatLngFromString(geolocation);
		var mapOptions = { 
			center: geolocation, 
			zoom: 18, 
			mapTypeId: google.maps.MapTypeId.ROADMAP 
		};
		 var map = new google.maps.Map(document.getElementById("infoMap"), mapOptions);
		 var info = new google.maps.InfoWindow();
		 addPointer(map, geolocation,content, info);
	}else{
		$("#infoMap").html("Address not found!");
	}
	
}

//Function that will create completeMap for the mapPage
function completeMaps(pos,array){
	var center;
	//if its bigger than 1 get current location to be center
	if(array.length > 1){
		if(pos !== null){
			var lat = pos.coords.latitude;
			var lng = pos.coords.longitude;
			center = new google.maps.LatLng(lat,lng);
		}else{
			//if the browser doesn't support getCurrentLocation, then center the map with the first marker that has a valid address
			for(var i = 0; i < array.length; i++){
				if(array[i].geolocation !== "N0N"){
					center = getLatLngFromString(array[i].geolocation);
					break;
				}
			}
		}
		
	}else{
		// if its only one then make that one center
		center = getLatLngFromString(array[0].geolocation);
	}
	$("#notFound").html("");
	var addressFound = false;
	//Save geolocation in order to do lines
	var  geolocations = [];
	var mapOptions = { 
		center: center, 
		zoom: 10, 
		mapTypeId: google.maps.MapTypeId.ROADMAP 
	};
		
	completeMap = new google.maps.Map(document.getElementById("completeMap"), mapOptions);
	var info = new google.maps.InfoWindow();
	//Get the latlng from the database then add the individual pointers to the map
	for(var i = 0 ; i < array.length; i++){
		if(array[i].geolocation !== "N0N"){
			var ltlng = getLatLngFromString(array[i].geolocation);
			//store latLng to use it for the Lines
			geolocations.push(ltlng);
			addPointer(completeMap, ltlng, array[i].message, info);			
			addressFound = true;
		}
	}
	if(!addressFound){
		$("#notFound").html("Address not found");
	}
	
	lineRoute = new google.maps.Polyline({
		path: geolocations,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2
  });
	

}
//Solution found in stackoverFlow: It will get the LatLng from a String geolocation (that was stored in the database)
function getLatLngFromString(geolocation) {
	
    var latlng = geolocation.replace(/[()]/g,'').split(',');
    return new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1])); 
}

//Add points by taking the map, the geolocation (mapCenter), the message, and the info
function addPointer(map,mapCenter,content, mapInfo){
   
	var myLoc = new google.maps.Marker ({ 
		map: map,    
		position: mapCenter });
		
	google.maps.event.addListener(myLoc, "click", function(){
		mapInfo.setContent(content);
		mapInfo.open(map, myLoc); 
	});
}

//Function that will find the geolocation of a given address and will call callback passing the passParameter object
function findGeolocation(address,passParameter, callback){
	var geocoder = new google.maps.Geocoder(); 
	var addressFound = false;
	geocoder.geocode({"address":address}, function(data,status)  { 
		if (status == google.maps.GeocoderStatus.OK)  {
			var latitude = data[0].geometry.location.lat();
			var longitude = data[0].geometry.location.lng();
			var mapCenter = new google.maps.LatLng(latitude,longitude);
			callback(mapCenter, passParameter);
		}else{
			callback("N0N", passParameter);

		}
	}) 
}
//Setting the lines for the map
function fillLines(){
	lineRoute.setMap(completeMap);
}
//Removing lines of the map
function removeLines(){
	lineRoute.setMap(null);
}


function map_error(err)  {     
	console.log("Error " + err.code + " : " + err.message); 
};