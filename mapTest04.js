$( document).ready(function(){
    
/*-----------------mymap----------------*/

var mapboxAccessToken = 'pk.eyJ1Ijoiam9lLWFuc2VsbCIsImEiOiJjanMwY2lqdDkxZDZzM3ltMXhxanBjczgzIn0.cXtLiX_Attz-zpsupXOyvw';
var map = L.map('mapid', {
    minZoom: 9,
    maxZoom: 17,
    maxBounds:[ [51.773986, -0.661993], [51.239167, 0.375363], ], 
}).setView([51.505, -0.09], 10);

//render london outline and set style
wholeLondon = L.geoJSON(wholeLondon, {
    style: function(feature) {
        return {fillOpacity : 0 , weight : 2, interactive: false};
    },
}).addTo(map);


//set zoom for depending on what window width size
function mobileView(){
  if ($(window).width() < 650) {
      map.setZoom(9.4);
  }
  else {
      map.setZoom(10);
  }
}

$( window ).resize(function() {

  mobileView();
});

mobileView();


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
        click: zoomToFeature
    });
}  

function zoomToFeature(e, props) {

  // map.fitBounds(e.target.getBounds());
  map.setView(e.latlng, 14);

  var showthis = e.target.feature.properties.name;

  console.log(showthis);

  //reset project-list name opacity
  $(".text").css('opacity', '0.6');

  //change opacity project-list name to 1
  $(".text:contains('" + showthis + "')").css('opacity', '1');

  // setTimeout(function(){ map.invalidateSize()}, 500);
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
      map.setView(latlng, 15);

    //reset project-list name opacity
    $(".text").css('opacity', '0.6');
    //add opacit: 1 to selected menu item
    $(this).css('opacity', '1');

      setTimeout(function(){ map.invalidateSize()}, 500);
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

londonProjects.on("mouseover click", function(e) {
      var projectName = (e.layer.feature.properties.name);
      document.getElementsByClassName('project-names')[0].innerHTML = projectName;
      TweenMax.to(".project-names-container", 0.5, {css:{bottom:"0px"},ease:Power2.easeOut});
      TweenMax.to("#flat-slider", 0.5, {css:{bottom:"-200px"},ease:Power2.easeOut});
      $('.project-names').css({bottom: '0px'}).clearQueue();
});
  

function hideTimeLine() {
    document.getElementsByClassName('project-names')[0].innerHTML = 'test test'
    TweenMax.to(".project-names-container", 0.5, {css:{bottom:"-200px"},ease:Power2.easeOut});
    TweenMax.to("#flat-slider", 0.5, {css:{bottom:"0px"},ease:Power2.easeOut});
    $('.project-names').css({bottom: '-200px'}).clearQueue();
};

londonProjects.on("mouseout", function(){
  hideTimeLine();
});

$('.project-names-close-btn').on("click", function() {
  hideTimeLine();
});

wholeLondon.on("click", function() {
  TweenMax.to(".project-names", 0.5, {css:{bottom:"-200px"},ease:Power2.easeOut});
});


map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


    /*-------pins---------*/

var valuemin = valuemax = 0;
  $("#flat-slider")
    .slider({ 
        min: 2007,
        max: 2019, 
        range: true,
        values: [2007, 2019],
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

  var closeList = function(){
    TweenMax.to(".projects-list-container", 0.5, {css:{left: '-413px'},ease:Power1.easeOut});
    TweenMax.to(".map-container, .slider-container, .project-names-container", 0.5, {css:{width:"100%"},ease:Power2.easeOut});
    document.getElementById("project-list-btn-text").innerHTML = "Open project list";
    TweenMax.to(".fa-arrow-up", 0.5, {css:{transform:"rotate(0deg)"},ease:Power2.easeOut});
    console.log('close list');
  };

  var closeListSmall = function(){
    TweenMax.to(".projects-list-container", 0.5, {css:{left: '-100%'},ease:Power1.easeOut});
    // TweenMax.to(".map-container, .slider-container, .project-names-container", 0.5, {css:{width:"100%"},ease:Power2.easeOut});
    document.getElementById("project-list-btn-text").innerHTML = "Open project list";
    TweenMax.to(".fa-arrow-up", 0.5, {css:{transform:"rotate(0deg)"},ease:Power2.easeOut});
    console.log('close list small');
  };

  var openList = function(){
    TweenMax.to(".projects-list-container", 0.5, {css:{left: '0px'},ease:Power1.easeOut});
    TweenMax.to(".map-container, .slider-container, .project-names-container", 0.5, {css:{width:"calc(100% - 413px)"},ease:Power2.easeOut});
    document.getElementById("project-list-btn-text").innerHTML = "Close project list";
    TweenMax.to(".fa-arrow-up", 0.5, {css:{transform:"rotate(-180deg)"},ease:Power2.easeOut});
    console.log('open list');
  }

  var openListSmall = function(){
    TweenMax.to(".projects-list-container", 0.5, {css:{left: '0px'},ease:Power1.easeOut});
    // TweenMax.to(".map-container, .slider-container, .project-names-container", 0.5, {css:{width:"calc(100% - 700px)"},ease:Power2.easeOut});
    document.getElementById("project-list-btn-text").innerHTML = "Close project list";
    TweenMax.to(".fa-arrow-up", 0.5, {css:{transform:"rotate(-180deg)"},ease:Power2.easeOut});
    console.log('open list small');
  }

/*--------slide out list operations-------*/

    //functions for menu pull out button
    $( ".project-list-btn" ).click(function(){

    //close pull out menu for smaller devices
    if ($( ".project-list-btn" ).hasClass('project-list-open') && ($(window).width() < 1024)){
      closeListSmall();
      console.log('closingSmall');
      $( ".project-list-btn" ).removeClass('project-list-open');
    }

    //close pull out menu
    else if ($( ".project-list-btn" ).hasClass('project-list-open')){
      closeList();
      console.log('closing');
      $( ".project-list-btn" ).removeClass('project-list-open');
    }

    //open pull out menu for smaller devices
    else if ($(window).width() < 1024){
      openListSmall();
      $( ".project-list-btn" ).addClass('project-list-open');
    }

    //open pull out menu
    else {
      openList();
      $( ".project-list-btn" ).addClass('project-list-open');
    }

    setTimeout(function(){ map.invalidateSize()}, 500);

  });

  //close menu when clicking on the menu list item
  $( ".projects-list div" ).click(function(){
      if ($( ".project-list-btn" ).hasClass('project-list-open') && ($(window).width() < 1024)){
        closeList();
        console.log('closing');
        $( ".project-list-btn" ).removeClass('project-list-open');
      }

      setTimeout(function(){ map.invalidateSize()}, 500);
  });

   $( ".close-list-btn" ).click(function(){
    closeListSmall();
    setTimeout(function(){ map.invalidateSize()}, 500);
  });



  $( ".projects-list div" ).click(function(){
    if ($(window).width() < 1024){
      closeListSmall();
    }
  });

  // $( ".leaflet-left" ).prependTo('.container');

  // $( ".projects-list div" ).click(function(){
  //   setTimeout(function(){ map.invalidateSize()}, 500);
  //   if ($(window).width() < 1024){
  //     closeListSmall();
  //   }
  // });



// var closeList = function(){
//     TweenMax.to(".projects-list-container", 0.5, {css:{left: '-413px'},ease:Power1.easeOut});
//     // TweenMax.to(".project-list-btn", 0.5, {css:{bottom: '0px'},ease:Power1.easeOut});
//     TweenMax.to(".map-container, .slider-container, .project-names-container", 0.5, {css:{width:"100%"},ease:Power2.easeOut});
//     $(".popup-container").css({display: 'block'});
//     document.getElementById("project-list-btn-text").innerHTML = "Open project list";
//     TweenMax.to(".fa-arrow-up", 0.5, {css:{transform:"rotate(180deg)"},ease:Power2.easeOut});
//     $( ".project-list-btn" ).addClass('project-list-open');
//   };

// $( "i.fas.fa-times" ).click(closeList);

$( ".projects-list div" ).addClass('text')

/*-----------project-list hover-----------*/

$('.projects-list div').mouseover(function(){
  var thisProject = $(this).context.innerHTML;

    londonProjects.eachLayer(function (layer) {  
      if(layer.feature.properties.name == thisProject) {    
        layer.setStyle({weight : 10}) 
      }
    });

});

$('.projects-list div').mouseout(function(){
  var thisProject = $(this).context.innerHTML;

    londonProjects.eachLayer(function (layer) {  
      if(layer.feature.properties.name == thisProject) {    
        layer.setStyle({weight : 2}) 
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

});


