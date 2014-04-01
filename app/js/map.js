 /* Utility functions I didn't get around to using. Idea is to give users an option to view where they are on the
 map with geolocation. If used, should be namespaced and moved into Angular */

 var geocoder = new google.maps.Geocoder();
 var bounds = new google.maps.LatLngBounds();


function getLocation(map)
{
	var isCenterSet = false;
	var initialLocation = new google.maps.LatLng(0,0);
 	 if(navigator.geolocation) 
  	{
  		var browserSupportFlag = true;
    	navigator.geolocation.getCurrentPosition(
    		function(position) {

      			initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      			geocoder.geocode( {'latLng': initialLocation}, 
      				function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
        					var isInSF = validateBounds(results);

        					if (isInSF)
        					{
        						isCenterSet = true;
        		    	 		map.setCenter(initialLocation);
        					}
        				}
					});

  			});
  	}

  	if (!isCenterSet)
  		codeAddress();
}


function validateBounds(results)
{

	var result = results[0];
	//look for locality tag and administrative_area_level_1
	var city = "";
	var state = "";
	for(var i=0, len=result.address_components.length; i<len; i++) {
		var ac = result.address_components[i];
		if(ac.types.indexOf("locality") >= 0) 
			city = ac.long_name;
		if(ac.types.indexOf("administrative_area_level_1") >= 0) 
			state = ac.long_name;
	}

	if (city && city === 'San Francisco' && state && state === 'California')
		return true;

	return false;

}

function codeAddress() {
  var address = 'Castro and Market, San Francisco, CA';
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}




