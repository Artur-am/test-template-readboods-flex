function MapLayers(){
	let mapbox = function(id){
		return L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
			"id" : id,
			"attribution" : 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,' +
							'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
							'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
		});
	};

	return {
		"openstreetmap" : L.tileLayer(
			"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			{
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}
		),
		"mapbox.streets" : mapbox("mapbox.streets"),
		"mapbox.light" : mapbox("mapbox.light")
	};
}

function MapMarker(){
	return [
		{
			"latLng" : [ 50.5251027, 30.3488003 ],
			"text" : "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa."
		}
	]
}

function AddMarker(map){
	let markers = MapMarker();

	for(marker of markers){
		L.marker(marker.latLng).addTo(map)
        	.bindPopup(marker.text);
	}
}

function Leaflet(latlng){
	let mapLayers = new MapLayers();
	let defaultMap = "mapbox.streets";

	let map = L.map('map', {
		center: latlng,
		zoom: 10,
		layers: mapLayers[defaultMap]
	});

	AddMarker(map);
	
	L.control.layers(mapLayers).addTo(map);
}

function Contacts(){
	let latlng = [50.5251027, 30.3488003];
    Leaflet(latlng);
}