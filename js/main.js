
/* Carlos M. Crespo - 2018 - Geog 778 Practicum */

var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/ccrespo/cjjdaxeig7so12sn0ntyx8xoo/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2NyZXNwbyIsImEiOiJjaXNkd3lzdTQwMDd4Mnl2b3V2cTBmbnUzIn0.d7wSdKZ3KwqoXSGAByFYrw', {
   attribution: 'Data: U.S. Coast Guard</a>, Design - Carlos M. Crespo, 2018; Map: <a href="https://www.mapbox.com">© Mapbox</a>'
   }),
outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/ccrespo/cjkzt2g5z2p722rldfdb9g0ua/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2NyZXNwbyIsImEiOiJjaXNkd3lzdTQwMDd4Mnl2b3V2cTBmbnUzIn0.d7wSdKZ3KwqoXSGAByFYrw', {
   attribution: 'Data: U.S. Coast Guard</a>, Design - Carlos M. Crespo, 2018; Map: <a href="https://www.mapbox.com">© Mapbox</a>'
   });

//create the map
var map = new L.map('map', {
    center: [39.350, -74.968],
    zoom: 9,
    layers: [satellite, outdoors]
});

//database queries
var sqlBoundary = "SELECT * FROM acp_zones";    
var sqlAton = "SElECT * FROM aton";
var sqlMep = "SELECT * FROM mep";
var sqlFacilities = "SELECT * FROM facilities";


//set var for queries
var sqlPolStatusProgress = "SELECT * FROM mep WHERE status='Clean-up In Progress'";
var sqlPolStatusNotReq = "SELECT * FROM mep WHERE status='Clean-up Not Required/Completed'";
var sqlPolStatusReq = "SELECT * FROM mep WHERE status='Clean-up Required'";

var sqlAtonStatusFA = "SELECT * FROM aton WHERE status='FA'";
var sqlAtonStatusNA = "SELECT * FROM aton WHERE status='NA'";
var sqlAtonStatusPA = "SELECT * FROM aton WHERE status='PA'";

var sqlFacStatusFA = "SELECT * FROM facilities WHERE status='Active'";
var sqlFacStatusNA = "SELECT * FROM facilities WHERE status='Inactive'";
var sqlFacStatusPA = "SELECT * FROM facilities WHERE status='Intermittent'";

//Global variables
var aton = null;
var boundary = null;
var mep = null;
var facilities = null;



// set CARTO username
var cartoDBUserName = "cmcrespo";

var baseMaps = {    
    "Satellite": satellite,
    "Basemap": outdoors,
}

L.control.layers(baseMaps, null).addTo(map);

//location control
L.control.locate( { icon: 'fa fa-compass' }).addTo(map);

// Function to add Park Boundary
function showBoundary(){
    if(map.hasLayer(boundary)){
        map.removeLayer(boundary);
    }
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlBoundary, function(data) {
        boundary = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 
                'USCG & EPA Jurisdiction Boundary' + '</em></p>');
                layer.cartodb_id=feature.properties.cartodb_id;
            }
        }).addTo(map);
    });
}

// Function to add all Points of Interests
function showATON(){
    if (map.hasLayer(aton)){
        map.removeLayer(aton);
        
    }
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlAton, function(data) {
        aton = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 
                'Name: '+'</b>' + feature.properties.name + '<br /><em>' + 
                '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /><em>' +         
                '<b>'+'Summary: '+'</b>' + feature.properties.summary + '</em></p>');
                layer.cartodb_id=feature.properties.cartodb_id;
                var atonIcon = new L.Icon({
                    iconSize: [15, 15],
                    iconAnchor: [0, 0],
                    popupAnchor:  [1, -24],
                    iconUrl: 'img/rhombus_green.png',
                    riseOnHover: true,
                    shadowSize: [100, 100]
            });
                layer.setIcon(atonIcon);
            }             
        }).addTo(map);
    });
}

// Function to add Campsites
function showPollution(){
    if(map.hasLayer(mep)){
        map.removeLayer(mep);
        
    }
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlMep, function(data) {
        mep = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 
                'Name: '+'</b>' + feature.properties.name + '<br /><em>' + 
                '<b>'+'Location: '+'</b>' + feature.properties.location + '<br /><em>' +         
                '<b>'+'Product: '+'</b>' + feature.properties.oil_hazmat + '<br /><em>' + 
                '<b>'+'Quantity: '+'</b>' + feature.properties.quantity + '<br /><em>' +         
                '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /></em>' +
                '<b>'+'Summary: '+'</b>' + feature.properties.description + '</em></p>');
                layer.cartodb_id=feature.properties.cartodb_id;
                var oilIcon = new L.Icon({
                    iconSize: [30, 30],
                    iconAnchor: [0, 0],
                    popupAnchor:  [1, -24],
                    iconUrl: 'img/oil_spill.png',
                    riseOnHover: true
            });
                layer.setIcon(oilIcon);
            }
        }).addTo(map);
    });
}

// Function to add Park Boundary
function showFacilities(){
    if(map.hasLayer(facilities)){
        map.removeLayer(facilities);
        
    }
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlFacilities, function(data) {
        facilities = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
               layer.bindPopup('<p><b>' + 
               'Name: '+'</b>' + feature.properties.name + '<br /><em>' +
               '<b>'+'Type: '+'</b>' + feature.properties.type + '<br /><em>' +
               '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /><em>' +         
               '<b>'+'Summary: '+'</b>' + feature.properties.summary + '</em></p>');
               layer.cartodb_id=feature.properties.cartodb_id;
               var facilitiesIcon = new L.Icon({
                   iconSize: [20, 20],
                   iconAnchor: [0, 0],
                   popupAnchor:  [1, -24],
                   iconUrl: 'img/facility.png',
                   riseOnHover: true
            });
                layer.setIcon(facilitiesIcon);
            }
        }).addTo(map);
    });
}

// Function to Filter Pollution Status
function showCleanReq(){
  if(map.hasLayer(mep)){
    map.removeLayer(mep);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlPolStatusReq, function(data) {
    mep = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        'Name: '+'</b>' + feature.properties.name + '<br /><em>' + 
        '<b>'+'Location: '+'</b>' + feature.properties.location + '<br /><em>' +         
        '<b>'+'Product: '+'</b>' + feature.properties.oil_hazmat + '<br /><em>' + 
        '<b>'+'Quantity: '+'</b>' + feature.properties.quantity + '<br /><em>' +         
        '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /></em>' +
        '<b>'+'Summary: '+'</b>' + feature.properties.description + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var circleRedIcon = new L.Icon({
                iconSize: [15, 15],
                iconAnchor: [0, 0],
                popupAnchor:  [1, -24],
                iconUrl: 'img/circle_red.png'
        });
            layer.setIcon(circleRedIcon);
        }
        }).addTo(map);
  });
};

function showNoCleanReq(){
  if(map.hasLayer(mep)){
    map.removeLayer(mep);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlPolStatusNotReq, function(data) {
    mep = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        'Name: '+'</b>' + feature.properties.name + '<br /><em>' + 
        '<b>'+'Location: '+'</b>' + feature.properties.location + '<br /><em>' +         
        '<b>'+'Product: '+'</b>' + feature.properties.oil_hazmat + '<br /><em>' + 
        '<b>'+'Quantity: '+'</b>' + feature.properties.quantity + '<br /><em>' +         
        '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /></em>' +
        '<b>'+'Summary: '+'</b>' + feature.properties.description + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var circleGreenIcon = new L.Icon({
                iconSize: [15, 15],
                iconAnchor: [0, 0],
                popupAnchor:  [1, -24],
                iconUrl: 'img/circle_green.png'
        });
            layer.setIcon(circleGreenIcon);
        }
        }).addTo(map);
  });
};

function showCleanInProgress(){
  if(map.hasLayer(mep)){
    map.removeLayer(mep);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlPolStatusProgress, function(data) {
    mep = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        'Name: '+'</b>' + feature.properties.name + '<br /><em>' + 
        '<b>'+'Location: '+'</b>' + feature.properties.location + '<br /><em>' +         
        '<b>'+'Product: '+'</b>' + feature.properties.oil_hazmat + '<br /><em>' + 
        '<b>'+'Quantity: '+'</b>' + feature.properties.quantity + '<br /><em>' +         
        '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /></em>' +
        '<b>'+'Summary: '+'</b>' + feature.properties.description + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var circleYellowIcon = new L.Icon({
                iconSize: [15, 15],
                iconAnchor: [0, 0],
                popupAnchor:  [1, -24],
                iconUrl: 'img/circle_yellow.png'
        });
            layer.setIcon(circleYellowIcon);
        }
        }).addTo(map);
  });
};

function showAtonStatusFA(){
  if(map.hasLayer(aton)){
    map.removeLayer(aton);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlAtonStatusFA, function(data) {
    aton = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        'Name: '+'</b>' + feature.properties.name + '<br /><em>' + 
        '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /><em>' +         
        '<b>'+'Summary: '+'</b>' + feature.properties.summary + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var rhombusGreenIcon = new L.Icon({
                iconSize: [15, 15],
                iconAnchor: [0, 0],
                popupAnchor:  [1, -24],
                iconUrl: 'img/rhombus_green.png'
        });
            layer.setIcon(rhombusGreenIcon);
        }
        }).addTo(map);
  });
};

function showAtonStatusNA(){
  if(map.hasLayer(aton)){
    map.removeLayer(aton);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlAtonStatusNA, function(data) {
    aton = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        'Name: '+'</b>' + feature.properties.name + '<br /><em>' + 
        '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /><em>' +         
        '<b>'+'Summary: '+'</b>' + feature.properties.summary + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var rhombusRedIcon = new L.Icon({
                iconSize: [15, 15],
                iconAnchor: [0, 0],
                popupAnchor:  [1, -24],
                iconUrl: 'img/rhombus_red.png'
        });
            layer.setIcon(rhombusRedIcon);
        }
        }).addTo(map);
  });
};

function showAtonStatusPA(){
  if(map.hasLayer(aton)){
    map.removeLayer(aton);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlAtonStatusPA, function(data) {
    aton = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        'Name: '+'</b>' + feature.properties.name + '<br /><em>' + 
        '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /><em>' +         
        '<b>'+'Summary: '+'</b>' + feature.properties.summary + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var rhombusYellowIcon = new L.Icon({
                iconSize: [15, 15],
                iconAnchor: [0, 0],
                popupAnchor:  [1, -24],
                iconUrl: 'img/rhombus_yellow.png'
        });
            layer.setIcon(rhombusYellowIcon);
        }
        }).addTo(map);
  });
};

function showFacStatusPA(){
  if(map.hasLayer(facilities)){
    map.removeLayer(facilities);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlFacStatusPA, function(data) {
    facilities = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        'Name: '+'</b>' + feature.properties.name + '<br /><em>' +
        '<b>'+'Type: '+'</b>' + feature.properties.type + '<br /><em>' +
        '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /><em>' +         
        '<b>'+'Summary: '+'</b>' + feature.properties.summary + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var facilityYellowIcon = new L.Icon({
                iconSize: [20, 20],
                iconAnchor: [0, 0],
                popupAnchor:  [1, -24],
                iconUrl: 'img/facility_yellow.png'
        });
            layer.setIcon(facilityYellowIcon);
        }
        }).addTo(map);
  });
};

function showFacStatusFA(){
  if(map.hasLayer(facilities)){
    map.removeLayer(facilities);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlFacStatusFA, function(data) {
    facilities = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        'Name: '+'</b>' + feature.properties.name + '<br /><em>' +
        '<b>'+'Type: '+'</b>' + feature.properties.type + '<br /><em>' +
        '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /><em>' +         
        '<b>'+'Summary: '+'</b>' + feature.properties.summary + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var facilityIcon = new L.Icon({
                iconSize: [20, 20],
                iconAnchor: [0, 0],
                popupAnchor:  [1, -24],
                iconUrl: 'img/facility.png'
        });
            layer.setIcon(facilityIcon);
        }
        }).addTo(map);
  });
};

function showFacStatusNA(){
  if(map.hasLayer(facilities)){
    map.removeLayer(facilities);
  };
  $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlFacStatusNA, function(data) {
    facilities = L.geoJson(data,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>' + 
        'Name: '+'</b>' + feature.properties.name + '<br /><em>' +
        '<b>'+'Type: '+'</b>' + feature.properties.type + '<br /><em>' +
        '<b>'+'Status: '+'</b>' + feature.properties.status + '<br /><em>' +         
        '<b>'+'Summary: '+'</b>' + feature.properties.summary + '</em></p>');
        layer.cartodb_id=feature.properties.cartodb_id;
        var facilityRedIcon = new L.Icon({
                iconSize: [20, 20],
                iconAnchor: [0, 0],
                popupAnchor:  [1, -24],
                iconUrl: 'img/facility_red.png'
        });
            layer.setIcon(facilityRedIcon);
        }
        }).addTo(map);
  });
};

// Event listeners for the layers
$('input[value=aton]').change(function() {
    if (this.checked) {
        showATON();
    } else {
        map.removeLayer(aton)
    }
});

$('input[value=boundary]').change(function() {
    if (this.checked) {
        showBoundary();
    } else {
        map.removeLayer(boundary)
    }
});

$('input[value=mep]').change(function() {
    if (this.checked) {
        showPollution();
    } else {
        map.removeLayer(mep)
    }
});

$('input[value=facilities]').change(function() {
    if (this.checked) {
        showFacilities();
    } else {
        map.removeLayer(facilities)
    }
});

//Event listerners Pollution
$('input[value=required]').click(function(){
   showCleanReq();
})
$('input[value=notrequired]').click(function(){
   showNoCleanReq();
})
$('input[value=inprogress]').click(function(){
   showCleanInProgress();
})

//Event listerners ATON
$('input[value=AtonFA]').click(function(){
   showAtonStatusFA();
})
$('input[value=AtonNA]').click(function(){
   showAtonStatusNA();
})
$('input[value=AtonPA]').click(function(){
   showAtonStatusPA();
})

//Event listerners Facilities
$('input[value=FacFA]').click(function(){
   showFacStatusFA();
})
$('input[value=FacNA]').click(function(){
   showFacStatusNA();
})
$('input[value=FacPA]').click(function(){
   showFacStatusPA();
})

function locateUser(){
    map.locate({setView: true, maxZoom: 13});
}

// Add a home button to go back to the default map extent
L.easyButton('fa-home', function(btn, map){
    map.setView([39.350, -74.968],9);
	}).addTo(map);


// Create Leaflet Draw Control for the draw tools and toolbox
var drawControl = new L.Control.Draw({
  draw : {
    polygon : false,
    polyline : false,
    rectangle : false,
    circle : false
  },
  edit : false,
  remove: false
});

// Boolean global variable used to control visiblity
var controlOnMap = false;
var whichDialog = '';

// Create variable for Leaflet.draw features
var drawnItems = new L.FeatureGroup();

// Function to add the draw control to the map to start editing
function startEditsPol(evt){
   console.log(evt);
    whichDialog = evt;
    
    if(controlOnMap == true){
        map.removeControl(drawControl);
        controlOnMap = false;
    }
  map.addControl(drawControl);
  controlOnMap = true;
};

// Function to remove the draw control from the map
function stopEdits(){
  map.removeControl(drawControl);
  controlOnMap = false;
};

// Function to run when feature is drawn on map
map.on('draw:created', function (e) {
  var layer = e.layer;
  drawnItems.addLayer(layer);
  map.addLayer(drawnItems);
    
  
    switch (whichDialog) {
        case 'aton':
            atonReportDialog.dialog("open");
            break;
        case 'pol':
            polReportDialog.dialog("open");
            break;
        case 'fac':
            facReportDialog.dialog("open");
            break;
        default:
            return;
    }

});

// Use the jQuery UI dialog to create a dialog and set options
var polReportDialog = $("#pol-report_dialog").dialog({
  autoOpen: false,
  height: 500,
  width: 425,
  modal: true,
  position: {
    my: "center center",
    at: "center center",
    of: "#map"
  },
  buttons: {
    "Add to Database": setDataPol,
    Cancel: function() {
      polReportDialog.dialog("close");
      
    }
  },
  close: function() {
      $("#pol-report_form")[0].reset();
      map.removeLayer(drawnItems);
  }
});

var atonReportDialog = $("#aton-report_dialog").dialog({
    autoOpen: false,
    height: 300,
    width: 300,
    modal: true,
    position: {
        my: "center center",
        at: "center center",
        of: "#map"
    },
   buttons: {
       "Add to Database": setDataATON,
       Cancel: function() {
           atonReportDialog.dialog("close");
       
       }
   },
    close: function () {
        $("#aton-report_form")[0].reset();
        map.removeLayer(drawnItems);
    }
});

var facReportDialog = $("#fac-report_dialog").dialog({
    autoOpen: false,
    height: 300,
    width: 300,
    modal: true,
    position: {
        my: "center center",
        at: "center center",
        of: "#map"
    },
   buttons: {
       "Add to Database": setDataFac,
       Cancel: function() {
           facReportDialog.dialog("close");
       
       }
   },
    close: function () {
        $("#fac-report_form")[0].reset();
        map.removeLayer(drawnItems);
    }
});
// Stops default form submission and ensures that setData or the cancel function run
var form = polReportDialog.find("form").on("submit", function(event) {
  event.preventDefault();
});

//set parameters to post to db
function setDataPol() {
    var mepName = document.getElementById("mepname").value;
    var mepDivsion = document.getElementById("meptarget_div").value;
    var mepTeam = document.getElementById("mepteam").value;
    var mepLocation = document.getElementById("meplocation").value;
    var mepDescription = document.getElementById("mepdescription").value;
    var mepProduct = document.getElementById("mep_product").value;
    var mepPotential = document.getElementById("mepactual_pot").value;
    var mepQuantity = document.getElementById("mepquantity").value;
    var mepStatus = document.getElementById("mepstatus").value;
    var mepResources = document.getElementById("mepresources").value;
    var mepAreaConcern = document.getElementById("meparea_con").value;
    var mepOpRisk = document.getElementById("mepoperational").value;
    //console.log(mepName, mepDivsion, mepTeam, mepLocation, mepDescription, mepProduct,mepPotential,mepQuantity,   mepStatus, mepResources,mepAreaConcern,mepOpRisk);
    drawnItems.eachLayer(function (layer) {
        var a = layer.getLatLng();
        var postSQL = "INSERT INTO mep (the_geom, name, target_div, team, location, description, oil_hazmat, actual_pot, quantity, status, resources, area_conce, operational, latitude, longitude) VALUES (ST_GeomFromText('POINT(" + a.lng + " " + a.lat + ")',4326)," + "'"+ mepName +"'"+","+"'"+ mepDivsion  +"'"+","+"'"+ mepTeam +"'"+","+"'"+ mepLocation +"'"+","+"'"+ mepDescription +"'"+","+"'"+ mepProduct +"'"+ ","+"'"+ mepPotential +"'"+","+"'" + mepQuantity +"'"+","+"'"+ mepStatus +"'"+","+"'"+ mepResources +"'"+","+"'"+ mepAreaConcern +"'"+","+"'"+ mepOpRisk +"'"+","+"'"+ a.lat +"'"+","+"'"+ a.lng +"')";
        var pURL = postSQL;
        postURL = "https://"+cartoDBUserName+".carto.com/api/v2/sql?q=" + pURL + "&api_key=29PQZGsvhRewQ-lIx5M9yw";
            $.post(postURL)        
        console.log(postURL);
        
        
    });
    map.removeLayer(drawnItems);
    drawnItems = new L.FeatureGroup();
    console.log("drawnItems has been cleared");
    polReportDialog.dialog("close");
}

//set parameters to post to db
function setDataATON() {
    var atonName = document.getElementById("aton_name").value;
    var atonSummary = document.getElementById("aton_summary").value;
    var atonStatus = document.getElementById("aton_status").value;
    drawnItems.eachLayer(function (layer) {
        var a = layer.getLatLng();
        var postSQLaton = "INSERT INTO aton (the_geom, name, summary, status, latitude, longitude) VALUES (ST_GeomFromText('POINT(" + a.lng + " " + a.lat + ")',4326)," +"'"+ atonName +"'"+","+"'"+ atonSummary  +"'"+","+"'"+ atonStatus +"'"+","+"'"+ a.lat +"'"+","+"'"+ a.lng +"')";
        var pURLaton = postSQLaton; 
        postURLaton = "https://"+cartoDBUserName+".carto.com/api/v2/sql?q=" + pURLaton + "&api_key=29PQZGsvhRewQ-lIx5M9yw";
            $.post(postURLaton)        
        console.log(postURLaton);
        
    });
    map.removeLayer(drawnItems);
    drawnItems = new L.FeatureGroup();
    console.log("drawnItems has been cleared");
    atonReportDialog.dialog("close");
}

//set parameters to post to db
function setDataFac() {
    var facName = document.getElementById("fac_name").value;
    var facSummary = document.getElementById("fac_summary").value;
    var facStatus = document.getElementById("fac_status").value;
    drawnItems.eachLayer(function (layer) {
        var a = layer.getLatLng();
        var postSQLfac = "INSERT INTO facilities (the_geom, name, summary, status, latitude, longitude) VALUES (ST_GeomFromText('POINT(" + a.lng + " " + a.lat + ")',4326)," +"'"+ facName +"'"+","+"'"+ facSummary  +"'"+","+"'"+ facStatus +"'"+","+"'"+ a.lat +"'"+","+"'"+ a.lng +"')";
        var pURLfac = postSQLfac;
        postURLfac = "https://"+cartoDBUserName+".carto.com/api/v2/sql?q=" + pURLfac + "&api_key=29PQZGsvhRewQ-lIx5M9yw";
            $.post(postURLfac)        
        console.log(postURLfac);
        
    });
    map.removeLayer(drawnItems);
    drawnItems = new L.FeatureGroup();
    console.log("drawnItems has been cleared");
    facReportDialog.dialog("close");
}

// function to clear radio buttons
var allRadios = document.getElementsByName('filter');
var booRadio;
var x = 0;
for(x = 0; x < allRadios.length; x++){
  allRadios[x].onclick = function() {
    if(booRadio == this){
      this.checked = false;
      booRadio = null;
    } else {
      booRadio = this;
    }
  };
}
