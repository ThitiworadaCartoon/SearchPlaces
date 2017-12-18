'use strict';

angular.module('myApp.main', ['ngRoute'])

.controller('MainPageController', ['$scope', '$rootScope', function($scope, $rootScope) {

	$scope.init = function(){
		//Set as defualt
		$scope.location = '18.7717874,98.9742796';
		$scope.radius = 500;

		//Variables
		$scope.results = [];
		$scope.map = undefined;
		$scope.temp = [];
		$scope.infowindow;

		//Warning message
		$scope.warning = "There is no result. Please try:\n- Zooming out to search a bigger area \n- Checking your location";

		$scope.initMap();
	};

	$scope.initMap = function() {
		$scope.loading = true;
		var lat = $scope.location.split(',')[0];
		var lng = $scope.location.split(',')[1];

		//Default location
		var locationLatLng = {lat: parseFloat(lat), lng: parseFloat(lng)};

		$scope.map = new google.maps.Map(document.getElementById('map'), {
			center: locationLatLng,
			zoom: 17
		});

		$scope.infowindow = new google.maps.InfoWindow();

		var service = new google.maps.places.PlacesService($scope.map);
		service.nearbySearch({
			location: locationLatLng,
			radius: 500,
			type: ['store']
		}, callback);
	};	

	function callback(results, status) {
		$scope.results = results;
		console.log($scope.results);
		console.log($scope.results[1].photos[0].html_attributions[0]);
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i], i);
			}
		} else {
			alert($scope.warning);
		}
	};

	function createMarker(place, index) {
		if(index !== $scope.results.length-1){
			// Get Distance for each place
			var bounds = new google.maps.LatLngBounds;
			var markersArray = [];
			var lat = $scope.location.split(',')[0];
			var lng = $scope.location.split(',')[1];

			var origin1 = {lat: parseFloat(lat), lng: parseFloat(lng)};
			var destinationB = {lat: place.geometry.viewport.f.b, lng: place.geometry.viewport.b.b};
			var geocoder = new google.maps.Geocoder;
			var service = new google.maps.DistanceMatrixService;

			service.getDistanceMatrix({
				origins: [origin1],
				destinations: [destinationB],
				travelMode: 'DRIVING',
				unitSystem: google.maps.UnitSystem.METRIC,
				avoidHighways: false,
				avoidTolls: false
			}, function(response, status) {

				var distance = response.rows[0].elements[0].distance.text;
				$scope.results[index]['distance'] = distance;
			});

			//Create marker
			var placeLoc = place.geometry.location;
			$scope.marker = new google.maps.Marker({
				map: $scope.map,
				position: place.geometry.location,
				setMap : $scope.map
			});

			google.maps.event.addListener($scope.marker, 'click', function() {
				$scope.infowindow.setContent(place.name);
				$scope.infowindow.open($scope.map, this);
			});
		} else {
			setTimeout(function(){
				$(document).ready(function(){
					$('#map').trigger('click');
				});

				$scope.loading = false;
			}, 500);
		}
	};

	$scope.searchThisArea = function(){
		var newBound = $scope.map.getBounds();
		console.log($scope.map.getBounds());

		var lat = newBound.f.f;
		var lng = newBound.b.b;
		$scope.location = lat + ',' + lng;
		console.log($scope.location);
		$scope.initMap();
	};

	$scope.selectMarker = function(place, index){

		$('#' + index).addClass('animated pulse');

		$scope.marker = new google.maps.Marker({
			map: $scope.map,
			position: place.geometry.location
		});

		$scope.infowindow.setContent(place.name);
		$scope.infowindow.open($scope.map, $scope.marker);	
		setTimeout(function(){
			$('#' + index).removeClass('animated pulse');
		}, 1000);
	};

	$scope.changeCenter = function(){
		// Display 'Search this area' button when map area changed
		$scope.map.addListener('center_changed', function() {
			$('#thisarea').removeClass('hide');
		});
	};

	$scope.init();
	
	
}]);