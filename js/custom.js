var lit;
var model_info = [];
var _distance;
var _duration;
var _from;
var _to;
var _fuelConsumed;
var markers = [];
var total = 0;
var _price = 38.10;

function initMap() {
  var service = new google.maps.DistanceMatrixService();
  var directionsService = new google.maps.DirectionsService();
  
  var abeokuta = { lat: 7.1475, lng: 3.3619 };

  // Create a map and center it on Mauritius.
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: abeokuta
  });

  // Create a renderer for directions and bind it to the map.
  var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map
  });

  // Listen direction change
  directionsDisplay.addListener('directions_changed', function () {
    computeTotalDistance(directionsDisplay.getDirections());
  });

  // Instantiate an info window to hold step text.
  var stepDisplay = new google.maps.InfoWindow;

  // Display the route between the initial start and end selections.
  calculateAndDisplayRoute( directionsDisplay, directionsService, markers, stepDisplay, map );
  // Listen to change events from the start and end lists.
  var onChangeHandler = function () {
    calculateAndDisplayRoute(directionsDisplay, directionsService, markers, stepDisplay, map);
  };
  document.getElementById('start').addEventListener('change', onChangeHandler);
  document.getElementById('end').addEventListener('change', onChangeHandler);

  function calculate() {
    
  }

  function computeTotalDistance(result) {
    var myroute = result.routes[0];
    var duration, start, end;
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
      duration = myroute.legs[i].duration.value;  
      start = myroute.legs[i].start_address;
      end = myroute.legs[i].end_address;
      document.getElementById("start").value = start;
      document.getElementById("end").value = end;
    }
    total = total / 1000;
    _distance = total;
    document.getElementById('total').innerHTML = "<h3> <i class='fa fa-play'></i> From <br>" + start + "</h3> <h3><i class='fa fa-stop'></i> To <br>" + end + "</h3> <h3><i class='fa fa-clipboard-check'></i> Total Distance <br>" + total + ' km </h3>' + "<h3><i class='fa fa-clock'></i> Travel Estimated Duration <br>" + duration + " Seconds</h3>";
  }

  function calculateAndDisplayRoute(directionsDisplay, directionsService,
    markers, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    // Retrieve the start and end locations and create a DirectionsRequest using
    // DRIVING directions.
    directionsService.route({
      origin: document.getElementById('start').value,
      destination: document.getElementById('end').value,
      travelMode: 'DRIVING'
    }, function (response, status) {
      // Route the directions and pass the response to a function to create
      // markers for each step.
      if (status === 'OK') {
        document.getElementById('warnings-panel').innerHTML =
          '<b>' + response.routes[0].warnings + '</b>';
        directionsDisplay.setDirections(response);
        // showSteps(response, markers, stepDisplay, map);
      }
    });
  }

  function showSteps(directionResult, markers, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
      var marker = markers[i] = markers[i] || new google.maps.Marker;
      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      attachInstructionText(
        stepDisplay, marker, myRoute.steps[i].instructions, map);
    }

  }

  function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function () {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }
}