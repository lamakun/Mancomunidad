function GoogleMap(){
	this.initialize = 
		function(){
			var map = showMap();
			addMarkersToMap(map);
		}
	 
	var showMap = 
		function showMap(){
			var mapOptions = {
				zoom: 4,
				center: new google.maps.LatLng(-33, 151),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			} 
			var map = new google.maps.Map($("#mapa_lugar .content"), mapOptions);
			return map;
		}
}

var addMarkersToMap = 
	function(map){
		var latitudeAndLongitudeOne = new google.maps.LatLng('-33.890542','151.274856');
		var markerOne = new google.maps.Marker({
			position: latitudeAndLongitudeOne,
			map: map
		});
	 }
