$( document).ready(function(){
    
/*-----------------mymap----------------*/

var mapboxAccessToken = 'pk.eyJ1Ijoiam9lLWFuc2VsbCIsImEiOiJjanMwY2lqdDkxZDZzM3ltMXhxanBjczgzIn0.cXtLiX_Attz-zpsupXOyvw';
var map = L.map('mapid', {
    minZoom: 10,
    maxZoom: 16,
    maxBounds:[ [51.773986, -0.661993], [51.239167, 0.375363], ], 
}).setView([51.505, -0.09], 10);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
}).addTo(map);


    var circles = {
        radius: 20,
        // fillColor: "green",
        weight: 2,
        fillOpacity: 0.4
    };

    /*------render markers------*/


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

  //highlights section hoverd on
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({fillOpacity : 0.4 , weight : 10}) 
}

function resetHighlight(e) {
    londonProjects.resetStyle(e.target);

}   

function zoomToFeature(e, props) {
  // map.fitBounds(e.target.getBounds());
  map.setView(e.latlng, 14);

  var showthis = e.target.feature.properties.name;

  console.log(showthis);
}

function sortByAlphabeticalOrderOfPropertyName(featureA, featureB) {
  // Use toUpperCase() to ignore character casing
  const propertyNameA = featureA.properties.name.toUpperCase();
  const propertyNameB = featureB.properties.name.toUpperCase();

  if (propertyNameA > propertyNameB) {
    return 1;
  } else if (propertyNameA < propertyNameB) {
    return -1;
  }

  return 0;
}

var $projectsList = $('.projects-list');

// add the $div onto the page with append.
londonProjects.features
// Take the features and then sort them in 
// alphabetical order by the properties names.
  .sort(sortByAlphabeticalOrderOfPropertyName)
// Then we map over the features.
  .map(function(feature){
    // create a div
    var $property = $('<div></div>');
    // add $property name as text
    $property.text(feature.properties.name);
    // add a click event to the $div that zooms into the map based on the
    // coordinates (which are stored as [lng, lat]).
    $property.click(function(){
      var latlng = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0], 0);
      map.setView(latlng, 14);
    })
    // then we append (add) the $div inside $projectsList
    $projectsList.append($property)
  });

londonProjects = L.geoJSON(londonProjects, {
    style: function(feature) {
        return {color: feature.properties.markerColor};
    },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, circles);
    },
    onEachFeature: onEachFeature,
}).addTo(map);

    /*------hovers------*/       

londonProjects.on("mouseover", function(e) {
      var projectName = (e.layer.feature.properties.name);
      document.getElementsByClassName('project-names')[0].innerHTML = projectName;
      $('.project-names').animate({bottom: '0px'}).clearQueue();
});

londonProjects.on("mouseout", function() {
      document.getElementsByClassName('project-names')[0].innerHTML = ''
      $('.project-names').animate({bottom: '-200px'}).clearQueue();
});

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


    /*-------pins---------*/

var valuemin = valuemax = 0;
  $("#flat-slider")
    .slider({ 
        min: 2008,
        max: 2019, 
        range: true,
        values: [2008, 2019],
        slide: function( event, ui ) {

          var min = ui.values[0],
              max = ui.values[1];

          londonProjects.eachLayer(function (layer) {  
              var projectYear = layer.feature.properties.year;

              if (projectYear >= min && projectYear <= max) {
                layer._path.classList.remove("hidden");
              }
              else {
                layer._path.classList.add("hidden");
              }
            });
            
      }
    })
                        
    .slider("pips", {
        rest: "label",
    });

/*--------popup list-------*/
  $( ".project-list-btn" ).click(function(){
    $(".projects-list-container").animate({bottom: '0px'});
    $(".project-list-btn").animate({bottom: '-50px'});
    $(".popup-container").css({display: 'none'});
  });

var closeList = function(){
  $(".projects-list-container").animate({bottom: '-100%'});
    $(".project-list-btn").animate({bottom: '0px'});
    $(".popup-container").css({display: 'block'});
  };

$( "i.fas.fa-times" ).click(closeList);

$( ".projects-list div" ).addClass('text')

// if(typeof(londonProjects.features) === "undefined"){
//     console.log('oh nah');
// }else{
//     console.log('its lit');
// }

// console.log(londonProjects._layers);

/*-----------project-list hover-----------*/

$('.projects-list div').mouseover(function(){
  var thisProject = $(this).context.innerHTML;

    londonProjects.eachLayer(function (layer) {  
      if(layer.feature.properties.name == thisProject) {    
        layer.setStyle({fillOpacity : 0.4 , weight : 10}) 
      }
    });

});

$('.projects-list div').mouseout(function(){
  var thisProject = $(this).context.innerHTML;

    londonProjects.eachLayer(function (layer) {  
      if(layer.feature.properties.name == thisProject) {    
        layer.setStyle({fillOpacity : 0.4 , weight : 2}) 
      }
    });

});

/*-----------project list item click to zoom-----------*/

$('.projects-list div').click(function(){
  var thisProject = $(this).context.innerHTML;

    londonProjects.eachLayer(function (layer) {  
       if (layer instanceof  L.geoJSON){  
        console.log('wicked');
      }
    });

});

function style(feature) {
    return {
        weight: 0,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.05,
        fillColor: 'black'
    };
}


// geojsonBoro = L.geoJson(londonBoroughs, {
//     style: style,
// }).addTo(map);

// $('.projects-list div').click(function(){
//   var thisProject = $(this).context.innerHTML;

//     londonProjects.eachLayer(function (layer) {  
//       if(layer.feature.properties.name == thisProject) {    
//         map.setView(layer.latlng, 14);
//       }
//     });

// });

// londonProjects.on('click', function(e){
//       map.setView(e.latlng, 14);
//   });






/*-----------------bits I might need-----------------*/

    // londonProjects = L.geoJSON(londonProjects, {
    //     pointToLayer: function (feature, latlng) {
    //         return L.circleMarker(latlng, circles);
    //     }
    // }).addTo(map);

    // $('.project-names').on("click", function(){
    //     map.removeLayer(Hackney, Haringey, WalthamForest, Newham);
    // });

    // map.addLayer(londonProjects);

    // console.log(londonProjects);

    // L.geoJSON(londonProjects, {
    // filter: function(feature, latlng) {
    //     if (feature.properties.density === 1000 ){
    //         return L.circleMarker(latlng, circlesDim);
    //     }
    // }
    // }).addTo(map);

    //  londonProjects.on("click", function(e) {
    //     console.log(e.layer.feature.properties);
    // });

    // /*---------- Project Name on bottom--------*/


    // londonProjects.on("mouseover", function(e) {
    //     var projectName = (e.layer.feature.properties.name);
    //      document.getElementsByClassName('project-names')[0].innerHTML = projectName;
    // });

    // londonProjects.on("mouseout", function() {
    //      document.getElementsByClassName('project-names')[0].innerHTML = 'Hover over a place'
    // });


});


