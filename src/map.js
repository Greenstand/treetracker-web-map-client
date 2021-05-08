import * as mapTools from "./mapTools";
import MapModel from "./MapModel";
import expect from "expect-runtime";
import axios from "axios";
import {parseMapName} from "./utils";
import log from "loglevel";
import {mapConfig} from "./mapConfig";
import 'leaflet';
import 'leaflet/dist/leaflet.css';
//import "leaflet-utfgrid/L.UTFGrid-min.js";
import 'leaflet.gridlayer.googlemutant';

const CancelToken = axios.CancelToken;
let source;

//TODO 
const $ = {
}


const moment = () => {log.warn("Fake moment!")};

function load(
  options
){
//  //verify options
//  expect(options).property("onShowArrow").a(expect.any(Function));
//  expect(options).property("onHideArrow").a(expect.any(Function));
//  const {onHideArrow, onShowArrow} = options;


const YES = "YES";
const NO = "NO";
var map = undefined; //Leaflet Map object
//var mc = undefined; //Marker Clusterer
var markers = []; //All the markers
var mapModel = undefined;
var token;
var mapName;
var treeid;
var userid;
var donor;
var wallet;
var flavor;
var clusterRadius;
var firstQuery = true;
var firstRender = true;
var firstInteraction = false;
var initialBounds = new window.L.latLngBounds([]);
var loader;

var currentZoom;
var req = null;
var treeInfoDivShowing = false;
var fetchMarkers = true;

// used to keep track of our points and markers
var points = [];
var markerByPointId = {};
var selectedTreeMarker;
var selectedOldTreeMarker;

var treetrackerApiUrl = "/default/";

let isLoadingMarkers = false;

var loadingTimer = undefined;

/*
 * Add this for time filter, the date will be put into the url path
 */
let timeline = undefined;

/*
 * When mouse over the icon in tile pic, create the markerHighlight
 */
let markerHighlight = undefined;

let isUsingTile = false;
let utfGridLayer;

if(process.env.REACT_APP_API){
  treetrackerApiUrl = process.env.REACT_APP_API;
}else{
  log.warn("Did not set REACT_APP_API");
}
log.log("api url:", treetrackerApiUrl);

/**
 * Writes to the document's cookie to expire (or not) after a set time from the date of the user's last visit to the webpage.
 *
 * @param {string=} c_name The name of the cookie to be written (i.e. "visited").
 * @param {string=} value The value of the cookie (i.e. "yes")
 * @param {Number=} exdays The length of time that the cookie will not expire
 */
function setCookie(c_name,value,exdays){
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

/**
 * Reads from the cookie if it exists.
 *
 * @param {string=} c_name The name of the cookie to be read from (i.e. "visited").
 */
function getCookie(c_name){
  var c_value = document.cookie;
  var c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1){
    c_start = c_value.indexOf(c_name + "=");
  }

  if (c_start == -1){
    c_value = null;
  } else{
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);

    if (c_end == -1){
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start,c_end));
  }
  return c_value;
}

/**
 * Checks if the user has visited the page before.
 *
 */
function checkSession(){
  var c = getCookie("visited");
  var past_visitor = true;
  if (c === "yes") {
    log.log("OLD VISITOR");
  } else {
    log.log("NEW VISITOR");
    past_visitor = false;
  }
  setCookie("visited", "yes", 365); // expire in 1 year; or use null to never expire
  return past_visitor;
}

function getTreeQueryParametersFromRequestedFilters(){
  var queryUrl = "";
  if (token != null) {
    queryUrl = queryUrl + "&token=" + token;
  } else if (mapName != null) {
    queryUrl = queryUrl + "&map_name=" + mapName;
  } else if (treeid != null) {
    queryUrl = queryUrl + "&treeid=" + treeid;
  } else if (userid != null) {
    queryUrl = queryUrl + "&userid=" + userid;
  } else if (flavor != null) {
    queryUrl = queryUrl + "&flavor=" + flavor;
  } else if (wallet != null) {
    queryUrl = queryUrl + "&wallet=" + wallet;
  }
  return queryUrl;
}

//Get the tree data and create markers with corresponding data
var initMarkers = function(viewportBounds, zoomLevel) {
  log.log("initMarkers:", viewportBounds, zoomLevel);
  isLoadingMarkers = true;
  // no need to load this up at every tiny movement
  if (!fetchMarkers) {
    log.log("initMarkers quit");
    return;
  }

  clusterRadius =
    getQueryStringValue("clusterRadius") || getClusterRadius(zoomLevel);

  log.log("Cluster radius: " + clusterRadius);

//  if (req != null) {
//    log.log("initMarkers abort");
//    req.abort();
//  }
  source && source.cancel("clean previous request");
  var queryUrl = treetrackerApiUrl + "trees?clusterRadius=" + clusterRadius;
  queryUrl = queryUrl + "&zoom_level=" + zoomLevel;
  if (
    currentZoom >= 4 &&
    !(
      (token != null ||
        mapName != null ||
        treeid != null ||
        userid !== null) &&
      firstRender == true
    )
  ) {
    queryUrl = queryUrl + "&bounds=" + viewportBounds;
  }
  queryUrl = queryUrl + getTreeQueryParametersFromRequestedFilters();

  timeline = getQueryStringValue("timeline");
  timeline && (queryUrl += `&timeline=${timeline}`);

  log.log("request:", queryUrl);
  source = CancelToken.source();

  //disable loading icon anyway
  getApp().loadingB(false);


  //disable to use tile totally
  if(true){
    log.warn("quit, use tile server instead, totally");
    clearOverlays(markers);
    getApp().loadingB(false);
    getApp().loaded();
    return;
  }
  //for tile server version, if zoom level > 15, and it isn't cases like
  //map_name, wallet, then do not request for points, just let the tile
  //server works.
  if(
    queryUrl.match(/zoom_level=(16|17|18|19|20|21|22)/) &&
    isUsingTile
  ){
    log.warn("quit, use tile server instead");
    clearOverlays(markers);
    return;
  }


  //loading
  if(!firstRender){
    loadingTimer = setTimeout(() => {
      getApp().loadingB(true);
    }, 3000);
  }

  axios.get(queryUrl,{
    cancelToken: source.token,
  })
    .then(response => {
      //loading
      clearTimeout(loadingTimer);
      getApp().loadingB(false);

      expect(response)
        .defined()
        .property("data")
        .defined()
        .property("data")
        .a(expect.any(Array));
      const {data} = response;
      log.log("initMarkers, get");
      if (userid && data.data.length === 0) {
        showAlert();
      }

      // clear everything
      points = [];
      markerByPointId = {};
      clearOverlays(markers);
      // log.log(data);

      data.data.forEach(function(item,i) {
        if (item.type == "cluster") {
          var centroid = JSON.parse(item.centroid);
          var latLng = new window.L.latLng(
            centroid.coordinates[1],
            centroid.coordinates[0]
          );
          determineInitialSize(latLng);

          var iconUrl = null,
            labelOrigin = null,
            anchor = null;
          if (item.count <= 300) {
            iconUrl = require("./images/cluster_46px.png");
            labelOrigin = new window.L.point(23, 23);
            anchor = new window.L.point(23, 23);
          } else {
            iconUrl = require("./images/cluster_63px.png");
            labelOrigin = new window.L.point(32, 32);
            anchor = new window.L.point(32, 32);
          }

          if (item.count <= 300) {
            iconUrl = require("./images/cluster_46px.png");
          } else {
            iconUrl = require("./images/cluster_63px.png");
          }
          var marker = new window.L.marker(
            latLng,
            {
                icon: new window.L.DivIcon({
                  className: "greenstand-cluster",
                  html: `
                    <div class="greenstand-cluster-box-${item.count <= 300?'small':'large'}"  >
                    <div>${shortenLargeNumber(item.count).toString()}</div>
                    </div>
                  `,
                }),
            });
          marker.addTo(map);

          //add zoomTarget to cluster marker
          marker.zoomTarget = data.zoomTargets?
            data.zoomTargets.reduce((a,c) => {
              if(a){
                return a;
              }else{
                if(c.region_id === item.id){
                  return c;
                }else{
                  return a;
                }
              }
            }, undefined)
            :
            undefined;

          marker.on("click", function() {
            log.debug("marker click");
            log.debug("click marker:", marker);
//            window.google.maps.event.clearListeners(marker, "mouseover");
//            window.google.maps.event.clearListeners(marker, "mouseout");
//            if (item.count <= 300) {
//              marker.setIcon({
//                ...marker.getIcon(),
//                url: require("./images/cluster_46px_clicked.png"),
//              });
//            } else {
//              marker.setIcon({
//                ...marker.getIcon(),
//                url: require("./images/cluster_63px_clicked.png"),
//              });
//            }
            //icon
            window.L.DomUtil.addClass(marker._icon, "clicked");
            if(marker.zoomTarget){
              fetchMarkers = false;
              var zoomLevel = map.getZoom();
              const centroid = JSON.parse(marker.zoomTarget.centroid);
              const position = {
                lat: centroid.coordinates[1],
                lng: centroid.coordinates[0],
              }
              log.log("zoom target:", position);
              map.flyTo(
                window.L.latLng(
                  centroid.coordinates[1],
                  centroid.coordinates[0]
                ),
                zoomLevel + 2,
              );
            }else{
              fetchMarkers = false;
              var zoomLevel = map.getZoom();
              map.flyTo(marker.getLatLng(), zoomLevel+2);
            }
          });

//          //the hover
//          window.google.maps.event.addListener(marker, "mouseover", function(){
//            if (item.count <= 300) {
//              marker.setIcon({
//                ...marker.getIcon(),
//                url: require("./images/cluster_46px_highlight.png"),
//              });
//            } else {
//              marker.setIcon({
//                ...marker.getIcon(),
//                url: require("./images/cluster_63px_highlight.png"),
//              });
//            }
//          });
//
//          window.google.maps.event.addListener(marker, "mouseout", function(){
//            if (item.count <= 300) {
//              marker.setIcon({
//                ...marker.getIcon(),
//                url: require("./images/cluster_46px.png"),
//              });
//            } else {
//              marker.setIcon({
//                ...marker.getIcon(),
//                url: require("./images/cluster_63px.png"),
//              });
//            }
//          });

          markers.push(marker);
        } else if (item.type == "point") {
          var latLng = new window.L.latLng(item.lat, item.lon);
          determineInitialSize(latLng);
//          var infowindow = new window.google.maps.InfoWindow({
//            content: "/img/loading.gif"
//          });

          var marker = new window.L.marker(
            latLng,
            {
                icon: new window.L.DivIcon({
                  className: "greenstand-point",
                  html: `
                    <div class="greenstand-point-box"  >
                    <div></div>
                    </div>
                  `,
                }),
              zIndex: undefined,
//              payload: {
//                id: item["id"]
//              }
            });
          marker.payload = {
            id: item["id"],
            lat: item["lat"],
            lon: item["lon"],
          };
          marker.addTo(map);

          if (
            selectedTreeMarker &&
            marker.payload.id === selectedTreeMarker.payload.id
          ) {
            selectedTreeMarker = marker;
            changeTreeMarkSelected();
          }

//          window.google.maps.event.addListener(marker, "mouseover", function(){
//            const icon = marker.getIcon();
//            selectedTreeMarker && expect(selectedTreeMarker)
//              .defined()
//              .property("payload")
//              .property("id")
//              .number();
//            expect(marker)
//              .property("payload")
//              .property("id")
//              .number();
//            marker.setIcon({
//              ...icon,
//              url: selectedTreeMarker && (selectedTreeMarker.payload.id === marker.payload.id)?
//                require("./images/pin_32px_highlight.png")
//              :
//                require("./images/pin_29px_highlight.png"),
//            });
//          });
//          window.google.maps.event.addListener(marker, "mouseout", function(){
//            const icon = marker.getIcon();
//            selectedTreeMarker && expect(selectedTreeMarker)
//              .defined()
//              .property("payload")
//              .property("id")
//              .number();
//            expect(marker)
//              .property("payload")
//              .property("id")
//              .number();
//            marker.setIcon({
//              ...icon,
//              url: selectedTreeMarker && (selectedTreeMarker.payload.id === marker.payload.id)?
//                require("./images/pin_32px.png")
//              :
//                require("./images/pin_29px.png"),
//            });
//          });

          // set the field for sorting
          item._sort_field = new Date(item.time_created);

          // hold the reference to our points
          points.push(item);
          markerByPointId[item["id"]] = marker;
          markers.push(marker);
        }
      });

      // set the markers once we are done
      setPointMarkerListeners();

      if (firstRender) {
        //loader.classList.remove("active");
        getApp().loaded();
        firstRender = false;
        if (treeid != null) {
          selectedTreeMarker = {
            payload: points[0],
          }
          changeTreeMarkSelected();
          getApp().showPanel(points[0]);
        }
      }
      log.log("init marker finished, loaded:", markers.length);
      isLoadingMarkers = false;
      //debugger;
      log.warn("checkArrow");
      mapModel.checkArrow();
    }).catch(function(thrown){
      if(axios.isCancel(thrown)){
        //change to handle cancel
        log.log("request cancelled because of:", thrown.message);
      }else{
        log.warn("request failed", thrown);
      }
    });
};

// for each point, set the listeners.
// sort first so we can reference the next point
// in chronological order
function setPointMarkerListeners() {
  // points.sort(function(a, b) {
  //     return a._sort_field - b._sort_field;
  // });

  points.forEach(function(point, i) {
    var marker = markerByPointId[point.id];
    expect(marker).defined();
    marker.on("click", function() {
      log.debug("marker click");
//      window.google.maps.event.clearListeners(marker, "mouseover");
//      window.google.maps.event.clearListeners(marker, "mouseout");
      //toggle tree mark
      selectedOldTreeMarker = selectedTreeMarker;
      selectedTreeMarker = marker;
      changeTreeMarkSelected();

      //attache wallet
      if(wallet != null){
        point.attachedWallet = wallet;
      }
      getApp().showPanel(point);
      return;
    });
  });
}

function showAlert() {
  throw Error("not support this fn anymore");
  const alertHtml = `
    <div class="alert alert-info alert-dismissible" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      Could not find any trees associated with userid ${userid}
    </div>
  `;
  // Prevent duplicate alerts after map is re-rendered
  if ($(".alert-container").find(".alert").length === 0) {
    $(alertHtml).prependTo(".alert-container");
  }
}


function changeTreeMarkSelected() {
//  if (selectedOldTreeMarker) {
////TODO to highlight icon
////    selectedOldTreeMarker.setIcon(require("./images/pin_29px.png"));
////    selectedOldTreeMarker.setZIndex(0);
//    window.L.DomUtil.removeClass(selectedOldTreeMarker._icon, "clicked");
//  }
//
//  if (selectedTreeMarker) {
////    selectedTreeMarker.setIcon(require("./images/pin_32px.png"));
////    selectedTreeMarker.setZIndex(99999);
//    window.L.DomUtil.addClass(selectedTreeMarker._icon, "clicked");
//  }
  //new way to hanlde the selected icon
  log.info("change tree mark selected");
  //before set the selected tree icon, remote if any
  if(selectedTreeMarker && selectedTreeMarker.layer){
    log.info("there is a selected tree layer already:", selectedTreeMarker.layer);
    map.removeLayer(selectedTreeMarker.layer);
  }
  
  //set the selected marker
  const markerSelected = new window.L.marker(
    [selectedTreeMarker.payload.lat, selectedTreeMarker.payload.lon],
    {
        icon: new window.L.DivIcon({
          className: "greenstand-point-selected",
          html: `
            <div class="greenstand-point-selected-box"  >
            <div></div>
            </div>
          `,
          //iconSize: [32, 32],
        }),
    }
  );
  markerSelected.payload = {
    id: selectedTreeMarker.payload.id,
  };
  markerSelected.addTo(map);
}

// using an index, get the point and marker and show them
function showMarkerInfoByIndex(index) {
  var point = points[index];
  var marker = markerByPointId[point["id"]];
}

// handle the index for a circular list
function getCircularPointIndex(index) {
  if (index > points.length - 1) {
    index = 0;
  } else if (index < 0) {
    index = points.length - 1;
  }
  return index;
}

// clear the markers from the map and then clear our the array of markers
function clearOverlays(overlays) {
  log.debug("clear overlays");
  //remove
  overlays.forEach(m => {
    map.removeLayer(m);
  });
  overlays = [];
}

// Gets the value of a given querystring in the provided url
function getQueryStringValue(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  let results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getPathVariable(name, url) {
  if (!url) url = window.location.href;
  log.log(url);
  var regex = new RegExp("/" + name + "/(.*)");
  log.log(regex);
  let results = regex.exec(url);
  log.log(results);
  if (!results) return null;
  if (!results[1]) return "";
  return results[1];
}

function getHandleVariable(name, url) {
  if (!url) url = window.location.href;
  log.log(url);
  var regex = new RegExp("/@(.*)");
  log.log(regex);
  let results = regex.exec(url);
  log.log(results);
  if (!results) return null;
  if (!results[1] || getValidInitialPostion() !== null) return "";
  return results[1];
}

// Returns the bounds for the visible area of the map.
// The offset parameter extends the bounds resulting rectangle by a certain percentage.
// For example: 1.1 will return a rectangle with each point (N, S, E, W) 10% farther from the rectangle.
// The offset specification might be useful for preloading trees around the visible area, taking advantage of a single request.
function getViewportBounds(offset) {
  var bounds = map.getBounds();
  if (offset) {
    offset -= 1;
    var east = bounds.getNorthEast().lng;
    var west = bounds.getSouthWest().lng;
    var north = bounds.getNorthEast().lat;
    var south = bounds.getSouthWest().lat;
    // Get the longitude and latitude differences
    var longitudeDifference = (east - west) * offset;
    var latitudeDifference = (north - south) * offset;

    // Move each point farther outside the rectangle
    // To west
    bounds.extend(window.L.latLng(south, west - longitudeDifference));
    // To east
    bounds.extend(window.L.latLng(north, east + longitudeDifference));
    // To south
    bounds.extend(window.L.latLng(south - latitudeDifference, west));
    // To north
    bounds.extend(window.L.latLng(north + latitudeDifference, east));
  }
  return bounds;
}

function toUrlValueLonLat(bounds) {
  var east = bounds.getNorthEast().lng;
  var west = bounds.getSouthWest().lng;
  var north = bounds.getNorthEast().lat;
  var south = bounds.getSouthWest().lat;
  return [east, north, west, south].join();
}

function determineInitialSize(latLng) {
  if (firstRender) {
    log.log("extends initial bounds");
    initialBounds.extend(latLng);
  }
}

function getClusterRadius(zoom) {
  switch (zoom) {
    case 1:
      return 10;
    case 2:
      return 8;
    case 3:
      return 6;
    case 4:
      return 4;
    case 5:
      return 0.8;
    case 6:
      return 0.75;
    case 7:
      return 0.3;
    case 8:
      return 0.099;
    case 9:
      return 0.095;
    case 10:
      return 0.05;
    case 11:
      return 0.03;
    case 12:
      return 0.02;
    case 13:
      return 0.008;
    case 14:
      return 0.005;
    case 15:
      return 0.004;
    case 16:
      return 0.003;
    case 17:
    case 18:
    case 19:
      return 0.0;
    default:
      return 0;
  }
}

function shortenLargeNumber(number) {
  var units = ["K", "M"],
    decimal;

  for (var i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);

    if (number <= -decimal || number >= decimal) {
      return +(number / decimal).toFixed(0) + units[i];
    }
  }
  return number;
}

function fitMapToBoundsForSet(data){
  if(data.length === 0){
    log.warn("quit cuz data is empty");
    return;
  }
  log.error("data:", data);
  const bounds = mapTools.getInitialBounds(
    data.map(i => {
      if(i.type === "cluster"){
        const c = JSON.parse(i.centroid);
        return {
          lat: c.coordinates[1],
          lng: c.coordinates[0],
        };
      }else if(i.type === "point"){
        return {
          lat: i.lat,
          lng: i.lon,
        };
      }
    }),
    window.innerWidth,
    window.innerHeight,
  );
  const {lat, lng} = bounds.center;
  expect(lat).a(expect.any(Number));
  expect(lng).a(expect.any(Number));
  const latLng = window.L.latLng(lat, lng);
//  map.panTo(latLng);
//  map.setZoom(bounds.zoomLevel);
  map.flyTo(latLng, bounds.zoomLevel);
}
 

//Initialize Google Maps and Marker Clusterer
var initialize = function() {
  log.log(window.location.href);
  token = getQueryStringValue("token") || null;
  mapName = getQueryStringValue("map_name") || parseMapName(window.location.hostname) || null;
  treeid = getQueryStringValue("treeid") || null;
  userid = getQueryStringValue("userid") || null;
  flavor = getQueryStringValue("flavor") || null;
  donor = getQueryStringValue("donor") || null;
  wallet = getQueryStringValue("wallet") || null;
  if (wallet == null) {
    wallet = getHandleVariable("wallet") || null;
  }
  log.log(wallet);
  loader = document.getElementById("map-loader");

  var initialZoom = 2;
  var minZoom = 2;

  var linkZoom = parseInt(getQueryStringValue("zoom"));
  if (linkZoom) {
    initialZoom = linkZoom;
  }

  //Fri Jul 17 14:26:03 CST 2020  do not set initial zoom when there is some parameters
  //  if (
  //    token != null ||
  //    organization != null ||
  //    treeid != null ||
  //    userid !== null ||
  //    donor != null
  //  ) {
  //    initialZoom = 10;
  //    minZoom = null; // use the minimum zoom from the current map type
  //  }

  //class freetownOverlay {
  //  constructor(tileSize) {
  //    this.tileSize = tileSize;
  //  }
  //  getTile(coord, zoom, ownerDocument) {
  //    const div = ownerDocument.createElement("div");
  //    const y = (Math.pow(2, zoom) - coord.y - 1)
  //    div.style.backgroundPosition = 'center center';
  //    div.style.backgroundRepeat = 'no-repeat';
  //    div.style.height = this.tileSize.height + 'px';
  //    div.style.width = this.tileSize.width + 'px';
  //    div.tileId = 'x_' + coord.x + '_y_' + coord.y + '_zoom_' + zoom; 
  //    div.style.backgroundImage = 'url(' + "https://treetracker-map-tiles.nyc3.cdn.digitaloceanspaces.com/freetown/" + zoom + "/" + coord.x + "/" + y  + ".png" + ')';
  //    //check if coord is in tile range
  //    if (zoom == 10 && coord.x == 474 && y < 537 && y > 534) {
  //      return div;
  //    } else if (zoom == 11 && coord.x > 947 && coord.x < 950 && y > 1070 && y < 1073) {
  //      return div;
  //    } else if (zoom == 12 && coord.x > 1895 && coord.x < 1899 && y > 2142 && y < 2146) {
  //      return div;
  //    } else if (zoom == 13 && coord.x > 3792 && coord.x < 3798 && y > 4286 && y < 4291) {
  //      return div;
  //    } else if (zoom == 14 && coord.x > 7585 && coord.x < 7595 && y > 8574 && y < 8581) {
  //      return div;
  //    } else if (zoom == 15 && coord.x > 15172 && coord.x < 15190 && y > 17149 && y < 17161) {
  //      return div;
  //    } else if (zoom == 16 && coord.x > 30345 && coord.x < 30379 && y > 34300 && y < 34322) {
  //      return div;
  //    } else if (zoom == 17 && coord.x > 60692 && coord.x < 60758 && y > 68602 && y < 68643) {
  //      return div;
  //    } else if (zoom == 18 && coord.x > 121385 && coord.x < 121516 && y > 137206 && y < 137286) {
  //      return div;
  //    } 
  //  }
  //  releaseTile(tile) {}
  //}
  var mapInitialPosition = getValidInitialPostion() || [20, 0, initialZoom];
  var mapOptions = {
    zoom: +mapInitialPosition[2],
    center: window.L.latLng( +mapInitialPosition[0], +mapInitialPosition[1]),
    minZoom: minZoom,
    //    mapTypeId: "hybrid",
    //    mapTypeControl: false,
    //    streetViewControl: false,
    //    fullscreenControl: false,
    //    backgroundColor: theme.palette.grey.A200,
    zoomControl: false,
  };
  if(mapName != null && !!mapConfig[mapName]) {
    mapOptions.zoom = mapConfig[mapName].zoom;
    mapOptions.center = mapConfig[mapName].center;
  }


  map = window.L.map('map-canvas', mapOptions);
  
  //control
  window.L.control.zoom({
      position: 'bottomright'
  }).addTo(map);

  //google satillite map
//  window.L.gridLayer.googleMutant({
//    maxZoom: 20,
//    type: 'satellite'
//  }).addTo(map);
  const googleSat = window.L.tileLayer(
    'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
      maxZoom: 20,
//      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
//      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      subdomains:['mt0','mt1','mt2','mt3']
    });
  googleSat.addTo(map);

    window.L.TileLayer.FreeTown = window.L.TileLayer.extend({
    getTileUrl: function(coords) {
      const y = Math.pow(2, coords.z) - coords.y - 1;
      const url = `https://treetracker-map-tiles.nyc3.cdn.digitaloceanspaces.com/freetown/${coords.z}/${coords.x}/${y}.png`;
      if (coords.z == 10 && coords.x == 474 && y < 537 && y > 534) {
        return url;
      } else if (coords.z == 11 && coords.x > 947 && coords.x < 950 && y > 1070 && y < 1073) {
        return url;
      } else if (coords.z == 12 && coords.x > 1895 && coords.x < 1899 && y > 2142 && y < 2146) {
        return url;
      } else if (coords.z == 13 && coords.x > 3792 && coords.x < 3798 && y > 4286 && y < 4291) {
        return url;
      } else if (coords.z == 14 && coords.x > 7585 && coords.x < 7595 && y > 8574 && y < 8581) {
        return url;
      } else if (coords.z == 15 && coords.x > 15172 && coords.x < 15190 && y > 17149 && y < 17161) {
        return url;
      } else if (coords.z == 16 && coords.x > 30345 && coords.x < 30379 && y > 34300 && y < 34322) {
        return url;
      } else if (coords.z == 17 && coords.x > 60692 && coords.x < 60758 && y > 68602 && y < 68643) {
        return url;
      } else if (coords.z == 18 && coords.x > 121385 && coords.x < 121516 && y > 137206 && y < 137286) {
        return url;
      }
      return '/';
    }
  });

  window.L.tileLayer.freeTown = function() {
      return new window.L.TileLayer.FreeTown();
  }

  window.L.tileLayer.freeTown('', {
    maxZoom: 20,
    tileSize: window.L.point(256, 256)
  }).addTo(map);

  axios.get('https://treetracker-map-features.fra1.digitaloceanspaces.com/freetown_catchments.geojson')
    .then(response => {
      expect(response)
        .property("data")
        .property("features")
        .a(expect.any(Array));
      const data = response.data.features;
      const style = {
        color: 'green',
        weight: 1,
        opacity: 1,
        fillOpacity: 0
      };
      window.L.geoJSON(
        data, {
          style: style
        }
      ).addTo(map);
    });

  //if isn't cases like wallet, org, then use tile
  if(!token && (mapName === undefined || mapName === null || mapName === "freetown") && !treeid && !userid && !wallet){
    const isFreetown = mapName === "freetown";
    log.info("use tile server");
    isUsingTile = true;
    var baseURL_def = process.env.REACT_APP_TILE_SERVER_URL;
    if(!baseURL_def){
      throw new Error("Tile server url isn't set");
    }
    new window.L.tileLayer(
      baseURL_def + `${isFreetown?"freetown/":""}{z}/{x}/{y}.png`,
      {
        minZoom: 2,
        maxZoom: 20,
      }
    ).addTo(map);
    utfGridLayer = new window.L.utfGrid(
      baseURL_def + `${isFreetown?"freetown/":""}{z}/{x}/{y}.grid.json`,
      {
        minZoom: 2,
        maxZoom: 20,
      }
    );

    utfGridLayer.on('click', function (e) {
      console.log("e:", e);
      if (e.data) {
        console.log('click', e.data);
        const [lon, lat] = JSON.parse(e.data.latlon).coordinates;
        if(e.data.zoom_to){
          log.info("found zoom to:", e.data.zoom_to);
          const [lon, lat] = JSON.parse(e.data.zoom_to).coordinates;
          //NOTE do cluster click
          map.setView([lat, lon], map.getZoom() + 2);
        }else{
          map.setView([lat, lon], map.getZoom() + 2);
        }
        //quit, before, the code below is for openning the tree panel
        return;
  //      map.panTo(e.latlng);
  //      map.setView(e.latlng, map.getZoom() + 2);
  //      points.forEach(function(point, i) {
  //        var marker = markerByPointId[point.id];
  //        expect(marker).defined();
  //        marker.on("click", function() {
  //          log.debug("marker click");
  //    //      window.google.maps.event.clearListeners(marker, "mouseover");
  //    //      window.google.maps.event.clearListeners(marker, "mouseout");
  //          //toggle tree mark
  //          selectedOldTreeMarker = selectedTreeMarker;
  //          selectedTreeMarker = marker;
  //          changeTreeMarkSelected();
  //
  //          //attache wallet
  //          if(wallet != null){
  //            point.attachedWallet = wallet;
  //          }
  //          getApp().showPanel(point);
  //          return;
  //        });
  //      });
        //expect(e.data).property("id").a("number");

        //load points from utf cache
        //TODO this might not be the best way to load the points
        expect(utfGridLayer).property("_cache").defined();
        //fetch all the point data in the cache
        const itemList = Object.values(utfGridLayer._cache).map(e => e.data).filter(e => Object.keys(e).length > 0).reduce((a,c) => a.concat(Object.values(c)),[])
        log.info("loaded data in cache:", itemList.length);

        //filter the duplicate points
        const itemMap = {};
        itemList.forEach(e => itemMap[e.id] = e);
        
        //update the global points 
        points = Object.values(itemMap);
        log.warn("loaded points:", points.length);

        const point = points.reduce((a,c) => {
          //expect(c).property("id").a("number");
          if(c.id === e.data.id){
            return c;
          }else{
            return a;
          }
        }, undefined);
        expect(point).defined();

        //before set the selected tree icon, remote if any
        if(selectedTreeMarker && selectedTreeMarker.layer){
          log.info("there is a selected tree layer already:", selectedTreeMarker.layer);
          map.removeLayer(selectedTreeMarker.layer);
        }
        
        //set the selected marker
        const markerSelected = new window.L.marker(
          [lat, lon],
          {
              icon: new window.L.DivIcon({
                className: "greenstand-point-selected",
                html: `
                  <div class="greenstand-point-selected-box"  >
                  <div></div>
                  </div>
                `,
                iconSize: [32, 32],
              }),
          }
        );
        markerSelected.payload = {
          id: e.data.id,
        };
        markerSelected.addTo(map);
        selectedTreeMarker = {
          payload: e.data,
          layer: markerSelected,
        }

        getApp().showPanel(point);
      } else {
        console.log('click nothing');
      }
    });
    console.warn("utf:", utfGridLayer);
    utfGridLayer.on('mouseover', function (e) {
      console.log("e:", e);
      const [lon, lat] = JSON.parse(e.data.latlon).coordinates;
      markerHighlight = new window.L.marker(
        [lat, lon],
        {
            icon: new window.L.DivIcon({
              className: "greenstand-cluster-highlight",
              html: `
                <div class="greenstand-cluster-highlight-box"  >
                <div></div>
                </div>
              `,
              iconSize: [32, 32],
            }),
        }
      );
      markerHighlight.payload = {
        id: e.data.id
      };
      markerHighlight.addTo(map);
    });
    utfGridLayer.on('mouseout', function (e) {
      console.log("e:", e);
      map.removeLayer(markerHighlight);
    });

    //load all tile
//    utfGridLayer.on("load", function(e){
//      log.info("tile loaded", e);
//      expect(e).property("target").property("_cache").defined();
//      log.warn("datra:", JSON.stringify(e.target._cache));
//      //fetch all the point data in the cache
//      const itemList = Object.values(utfGridLayer._cache).map(e => e.data).filter(e => Object.keys(e).length > 0).reduce((a,c) => a.concat(Object.values(c)),[])
//      log.info("loaded data in cache:", itemList.length);
//
//      //filter the duplicate points
//      const itemMap = {};
//      itemList.forEach(e => itemMap[e.id] = e);
//      
//      //update the global points 
//      points = Object.values(itemMap);
//      log.info("loaded points:", points.length);
//      
//    });
    utfGridLayer.addTo(map);
  }else{
    log.info("do not use tile server");
  }
  // insert freetown overlay
  //  map.overlayMapTypes.insertAt(
  //    0,
  //    new freetownOverlay(new window.google.maps.Size(256, 256))
  //  );

//TODO need to restore this in the future
//  map.data.loadGeoJson(
//    "https://treetracker-map-features.fra1.digitaloceanspaces.com/freetown_catchments.geojson"
//  );
//  map.data.setStyle({
//    strokeWeight: 1,
//    strokeOpacity: 1,
//    strokeColor: 'green'
//  });

  // only fetch when the user has made some sort of action
  //TODO closed
  //  window.google.maps.event.addListener(map, "dragstart", function() {
  //    fetchMarkers = true;
  //    firstInteraction = true;
  //  });

  function registerFirstInteraction() {
    log.trace("registerFirstInteraction");
    firstInteraction = true;
  }

  map.on("click", registerFirstInteraction);

  map.on("mousemove", registerFirstInteraction);

  map.on("zoomend", function() {
    log.debug("zoomend");
    fetchMarkers = true;
  });

  /*
  window.google.maps.event.addListener(map, "idle", function() {
    log.log("triger idle...");
    var zoomLevel = !firstInteraction ? initialZoom : map.getZoom();
    log.log("New zoom level: " + zoomLevel);
    currentZoom = zoomLevel;
    initMarkers(toUrlValueLonLat(getViewportBounds(1.1)), zoomLevel);
  });
  */

  //Fri Jul 17 14:26:56 CST 2020  do not use titlesloaded to set initial bounds
  //use the firstRender in initMarkers fn to load initial bounds
  //  // Adjust map bounds after it’s fully loaded, but only before first interaction
  //  window.google.maps.event.addListener(map, "tilesloaded", function() {
  //    if (
  //      !firstInteraction &&
  //      (token != null ||
  //        organization != null ||
  //        treeid != null ||
  //        userid !== null ||
  //        donor != null)
  //    ) {
  //      log.log("before first interaction, fit the map", initialBounds.toJSON());
  //      map.fitBounds(initialBounds);
  //    }
  //  });

  // Update URL with bounding box
  map.on('moveend', onMapMove);


  map.on("moveend load", function() {
    log.log('IDLE');
    if(firstQuery){
      firstQuery = false
      if(mapName != null){
        initMarkers(toUrlValueLonLat(getViewportBounds(1.1)), mapOptions.zoom);
        return
      }
      let treeQueryParameters = getTreeQueryParametersFromRequestedFilters();
      if(treeQueryParameters == ""){
        var zoomLevel = !firstInteraction ? initialZoom : map.getZoom();
        log.log("New zoom level: " + zoomLevel);
        currentZoom = zoomLevel;
        initMarkers(toUrlValueLonLat(getViewportBounds(1.1)), zoomLevel);
        return 
      }


      let queryZoomLevel = 10;
      var clusterRadius = getQueryStringValue("clusterRadius") || getClusterRadius(queryZoomLevel);

      log.log("Cluster radius: " + clusterRadius);
      //      if (req != null) {
      //        log.log("initMarkers abort");
      //        req.abort();
      //      }
      source && source.cancel("clean previous request");
      var queryUrl = treetrackerApiUrl + "trees?clusterRadius=" + clusterRadius;
      queryUrl = queryUrl + "&zoom_level=" + queryZoomLevel;
      queryUrl = queryUrl + treeQueryParameters;

      log.log("request:", queryUrl);
      source = CancelToken.source();
      axios.get(queryUrl,{
        cancelToken: source.token,
      })
        .then(response => {
          expect(response)
            .property("data")
            .property("data")
            .a(expect.any(Array));
          const data = response.data.data;
          const app = getApp()
          if (userid && data.length === 0) {
            //            showAlert();
            app.loaded();
            app.showMessage(`Could not find any trees associated with userid ${userid}`);
            return;
          }
          /* if variable has word Token and does not return data, 
          redirect to wallet with the same content*/
          if(treeQueryParameters.indexOf("token") >=0 && data.length === 0){
            
            var queryUrl = window.location.href.replace("token","wallet");
         
            log.log(queryUrl);
            
            //redirects the page with wallet in the query instead of token
            window.location.href = queryUrl;
          }
          /* if it is not token and does not return data, show the message */
          else if (data.length === 0) {
            //            showAlert();
            app.loaded();
            app.showMessage(`Could not find any data `);
            return;
          }
          if(data.length == 1){
            // rerun at higher zoom level
            let queryZoomLevel12 = 12
            var queryClusterRadius12 = getQueryStringValue("clusterRadius") || getClusterRadius(queryZoomLevel12);
            var queryUrl = treetrackerApiUrl + "trees?clusterRadius=" + queryClusterRadius12;
            queryUrl = queryUrl + "&zoom_level=" + queryZoomLevel12;
            queryUrl = queryUrl + treeQueryParameters;
            source = CancelToken.source();
            axios.get(queryUrl,{
              cancelToken: source.token,
            }).then(response => {
              expect(response)
                .property("data")
                .property("data")
                .a(expect.any(Array));
              const data = response.data.data;
              fitMapToBoundsForSet(data)
            }).catch(function(thrown){
              if(axios.isCancel(thrown)){
                //change to handle cancel
                log.log("request canceled because of:", thrown.message);
              }else{
                log.log("request failed", thrown);
              }
            });

          } else {
            fitMapToBoundsForSet(data)
          }
        }).catch(function(thrown){
          if(axios.isCancel(thrown)){
            //change to handle cancel
            log.log("request canceled because of:", thrown.message);
          }else{
            log.log("request failed", thrown);
          }
        });

    } else {
      var zoomLevel = map.getZoom();
      log.log("New zoom level: " + zoomLevel);
      currentZoom = zoomLevel;
      initMarkers(toUrlValueLonLat(getViewportBounds(1.1)), zoomLevel);
    }
    mapModel.checkArrow();
  });

  currentZoom = initialZoom;

  //  $("#close-button").click(function() {
  //    $("#tree_info_div").hide("slide", "swing", 600);
  //    treeInfoDivShowing = false;
  //    $("#map-canvas").css("margin-left", "0px");
  //  });

  //initialize MapModel
  log.log("MAKING MAP MODEL");
  mapModel = new MapModel({
    apiUrl: treetrackerApiUrl,
    onShowArrow: handleShowArrow,
    onHideArrow: handleHideArrow,
  });
  mapModel.map = map;
  mapModel.markers = markers;

  //not sure should use it in this way
  map.setView(mapOptions.center, mapOptions.zoom);
};

//window.google.maps.event.addDomListener(window, "load", initialize);
initialize();

function getValidInitialPostion() {
  if (!window.location.pathname.endsWith('z') || !window.location.pathname.startsWith('/@')) {
    return null;
  }
  const arr = window.location.pathname.substring(2, window.location.pathname.length - 1).split(',');
  if (arr.length !== 3 || arr.some(item => isNaN(item))) {
    return null;
  }
  return arr;
}

function onMapMove() {
  const z = map._zoom;
  const bounds = map.getBounds();
  const {lat, lng} = bounds.getCenter();
  //TODO: this cannot replace the query string
  //window.history.replaceState(null, '', `@${lat},${lng},${z}z`);
}

function getNextPoint(point) {
  expect(point).property("id").number();
  const index = points.reduce((a,c,i) => {
    if(c.id === point.id){
      return i;
    }else{
      return a;
    }
  }, -1);
  if(index === -1){
    throw Error("can not find point");
  }
  const nextIndex = (index + 1) % points.length;
  expect(nextIndex).within(0, points.length);
  return points[nextIndex];
}

function getPrevPoint(point){
  expect(point).property("id").number();
  const index = points.reduce((a,c,i) => {
    if(c.id === point.id){
      return i;
    }else{
      return a;
    }
  }, -1);
  if(index === -1){
    throw Error("can not find point");
  }
  const prevIndex = (index - 1)>= 0?
    ((index -1) % points.length)
    :
    points.length + (index -1);
  expect(prevIndex).within(0, points.length);
  return points[prevIndex];
}

function addMarker(LatLng, tree){
  var marker = new window.L.marker(
    LatLng,
    {
      map: map,
      title: "Tree",
//      icon: {
//        url: require("./images/pin_29px.png"),
//      },
      zIndex: undefined,
      payload: {
        id: tree.id,
      }
    });
  marker.addTo(map);
  markers.push(marker);
  expect(tree).property("id").number();
  markerByPointId[tree.id] = marker;
  points.push(tree);
  setPointMarkerListeners();
}

function addMarkerByPixel(top, left, tree){
  const pointLeft = mapTools.getLatLngCoordinateByPixel(top, left, map);
  addMarker(pointLeft, tree);
}

function getCurrentIndex(){
  log.info("getCurrentIndex");
  expect(selectedTreeMarker)
    .property("payload")
    .property("id")
    .number();
  const currentId = selectedTreeMarker.payload.id;
  const index = points.reduce((a,c,i) => {
    if(c.id === currentId){
      return i;
    }else{
      return a;
    }
  }, -1);
  if(index === -1){
    throw Error("can not find point");
  }
  log.info("current index:", index);
  return index;
}

function goNextPoint(){
  log.debug("go to next");
  const index = getCurrentIndex();
  const nextIndex = (index + 1) % points.length;
  expect(nextIndex).within(0, points.length);
  const nextPoint = points[nextIndex];
  if(isUsingTile){
    log.info("with tile, fire on utf grid:", nextPoint);
    utfGridLayer.fire("click", {
      data: nextPoint,
    });
  }else{
    const marker = markerByPointId[nextPoint.id];
    expect(marker).defined();
    marker.fire("click");
  }
}

function goPrevPoint(){
  const index = getCurrentIndex();
  const prevIndex = (index - 1)>= 0?
    ((index -1) % points.length)
    :
    points.length + (index -1);
  expect(prevIndex).within(0, points.length);
  const prevPoint = points[prevIndex];
  if(isUsingTile){
    log.info("with tile, fire on utf grid:", prevPoint);
    utfGridLayer.fire("click", {
      data: prevPoint,
    });
  }else{
    const marker = markerByPointId[prevPoint.id];
    expect(marker).defined();
    marker.fire("click");
  }
}

function hasNextPoint(){
  const index = getCurrentIndex();
  if(index < points.length - 1){
    return true;
  }else{
    return false;
  }
}

function hasPrevPoint(){
  const index = getCurrentIndex();
  if(index > 0){
    return true;
  }else{
    return false;
  }
}

function handleShowArrow(direction){
  getApp().showArrow(direction);
}

function handleHideArrow(){
  log.debug("handleHideArrow");
  getApp().hideArrow();
}

/*
 * Simply re-render the map, just copied the code in 'idle' event 
 */
function rerender(){
  log.debug("rerender map");
  var zoomLevel = map.getZoom();
  log.log("New zoom level: " + zoomLevel);
  currentZoom = zoomLevel;
  initMarkers(toUrlValueLonLat(getViewportBounds(1.1)), zoomLevel);
}

function getApp(){
  const mapElement = document.getElementById("map-canvas");
  const {app} = mapElement;
  expect(app).defined();
  expect(app).property("loaded").defined();
  expect(app).property("loadingB").defined();
  expect(app).property("showPanel").defined();
  expect(app).property("showMessage").defined();
  return app;
}

return {
  getMap: () => map,
  getMapModel: () => mapModel,
  getMarkers: () => markers,
  getMarkerByPointId: () => markerByPointId,
  getLoadingMarkers: () => isLoadingMarkers,
  getPoints: () => points,
  getCurrentIndex,
  getPrevPoint,
  getNextPoint,
  goPrevPoint,
  goNextPoint,
  hasPrevPoint,
  hasNextPoint,
  addMarkerByPixel,
  rerender,
  checkUsingTile: () => isUsingTile,
}

}

export default load;
