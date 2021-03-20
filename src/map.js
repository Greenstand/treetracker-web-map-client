import * as mapTools from "./mapTools";
import MapModel from "./MapModel";
import expect from "expect-runtime";
import axios from "axios";
import {sentryDSN} from "./config";
import {theme} from "./App";
import {parseMapName} from "./utils";
import log from "loglevel";
import {mapConfig} from "./mapConfig";

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
var map = undefined; //Google Map object
var mc = undefined; //Marker Clusterer
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
var initialBounds = new window.google.maps.LatLngBounds();
var loader;
var panelLoader;

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

  //loading
  getApp().loadingB(false);
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
          var latLng = new window.google.maps.LatLng(
            centroid.coordinates[1],
            centroid.coordinates[0]
          );
          determineInitialSize(latLng);

          var iconUrl = null,
            labelOrigin = null,
            anchor = null;
          if (item.count <= 300) {
            iconUrl = require("./images/cluster_46px.png");
            labelOrigin = new window.google.maps.Point(23, 23);
            anchor = new window.google.maps.Point(23, 23);
          } else {
            iconUrl = require("./images/cluster_63px.png");
            labelOrigin = new window.google.maps.Point(32, 32);
            anchor = new window.google.maps.Point(32, 32);
          }

          var marker = new window.google.maps.Marker({
            position: latLng,
            map: map,
            label: {
              text: shortenLargeNumber(item.count).toString(),
              color: "#000"
            },
            icon: {
              url: iconUrl,
              labelOrigin: labelOrigin,
              anchor: anchor
            }
          });

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

          window.google.maps.event.addListener(marker, "click", function() {
            window.google.maps.event.clearListeners(marker, "mouseover");
            window.google.maps.event.clearListeners(marker, "mouseout");
            if (item.count <= 300) {
              marker.setIcon({
                ...marker.getIcon(),
                url: require("./images/cluster_46px_clicked.png"),
              });
            } else {
              marker.setIcon({
                ...marker.getIcon(),
                url: require("./images/cluster_63px_clicked.png"),
              });
            }
            if(marker.zoomTarget){
              fetchMarkers = false;
              var zoomLevel = map.getZoom();
              map.setZoom(zoomLevel + 2);
              const centroid = JSON.parse(marker.zoomTarget.centroid);
              const position = {
                lat: centroid.coordinates[1],
                lng: centroid.coordinates[0],
              }
              log.log("zoom target:", position);
              map.panTo(position);
            }else{
              fetchMarkers = false;
              var zoomLevel = map.getZoom();
              map.setZoom(zoomLevel + 2);
              map.panTo(marker.position);
            }
          });

          //the hover
          window.google.maps.event.addListener(marker, "mouseover", function(){
            if (item.count <= 300) {
              marker.setIcon({
                ...marker.getIcon(),
                url: require("./images/cluster_46px_highlight.png"),
              });
            } else {
              marker.setIcon({
                ...marker.getIcon(),
                url: require("./images/cluster_63px_highlight.png"),
              });
            }
          });

          window.google.maps.event.addListener(marker, "mouseout", function(){
            if (item.count <= 300) {
              marker.setIcon({
                ...marker.getIcon(),
                url: require("./images/cluster_46px.png"),
              });
            } else {
              marker.setIcon({
                ...marker.getIcon(),
                url: require("./images/cluster_63px.png"),
              });
            }
          });

          marker.triggerClick = () => {
            window.google.maps.event.trigger(marker, "click");
          };
          markers.push(marker);
        } else if (item.type == "point") {
          var latLng = new window.google.maps.LatLng(item.lat, item.lon);
          determineInitialSize(latLng);
          var infowindow = new window.google.maps.InfoWindow({
            content: "/img/loading.gif"
          });

          var marker = new window.google.maps.Marker({
            position: latLng,
            map: map,
            title: "Tree",
            icon: {
              url: require("./images/pin_29px.png"),
            },
            zIndex: undefined,
            payload: {
              id: item["id"]
            }
          });

          if (
            selectedTreeMarker &&
            marker.payload.id === selectedTreeMarker.payload.id
          ) {
            selectedTreeMarker = marker;
            changeTreeMarkSelected();
          }

          window.google.maps.event.addListener(marker, "mouseover", function(){
            const icon = marker.getIcon();
            selectedTreeMarker && expect(selectedTreeMarker)
              .defined()
              .property("payload")
              .property("id")
              .number();
            expect(marker)
              .property("payload")
              .property("id")
              .number();
            marker.setIcon({
              ...icon,
              url: selectedTreeMarker && (selectedTreeMarker.payload.id === marker.payload.id)?
                require("./images/pin_32px_highlight.png")
              :
                require("./images/pin_29px_highlight.png"),
            });
          });
          window.google.maps.event.addListener(marker, "mouseout", function(){
            const icon = marker.getIcon();
            selectedTreeMarker && expect(selectedTreeMarker)
              .defined()
              .property("payload")
              .property("id")
              .number();
            expect(marker)
              .property("payload")
              .property("id")
              .number();
            marker.setIcon({
              ...icon,
              url: selectedTreeMarker && (selectedTreeMarker.payload.id === marker.payload.id)?
                require("./images/pin_32px.png")
              :
                require("./images/pin_29px.png"),
            });
          });

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
        // create infowindow object
        var infowindow = new window.google.maps.InfoWindow({
          content: "<div style='float:left'><img src='/img/TipPopupIcon.png' height=40 width=40></div><div style='float:right; padding: 10px;'><b>Click on the cluster to zoom into trees</b></div>"
        });
        //
        if (!checkSession()) { //only if the user is new
          // add the infowindow to a random starting marker to be visible by default when the user first loads the screen
          // Close it temporarily
          //infowindow.open(map, markers[Math.floor(Math.random() * markers.length)]);
        }

        //loader.classList.remove("active");
        getApp().loaded();
        firstRender = false;
        if (treeid != null) {
          getApp().showPanel(points[0]);
        }
      }
      log.log("init marker finished, loaded:", markers.length);
      isLoadingMarkers = false;
      //debugger;
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

  panelLoader = document.getElementById("tree-info-loader");

  points.forEach(function(point, i) {
    var marker = markerByPointId[point.id];
    expect(marker).defined();
    window.google.maps.event.addListener(marker, "click", function() {
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
//      panelLoader.classList.add("active");
//      showMarkerInfo(point, marker, i);
//      $("#tree-image").on("load", function() {
//        panelLoader.classList.remove("active");
//      });
    });
    marker.triggerClick4Test = () => {
      window.google.maps.event.trigger(marker, "click");
    };
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

// set up and show the marker info
function showMarkerInfo(point, marker, index) {
  panelLoader = document.getElementById("tree-info-loader");

  $("#tree_info_div").show("slide", "swing", 600);
  if (treeInfoDivShowing == false) {
    treeInfoDivShowing = true;
    if (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    ) {
      $("#map-canvas").animate(
        {
          margin: "0 0 0 20vw"
        },
        700,
        function() {
          //Animation Complete
        }
      );
    } else {
      $("#map-canvas").animate(
        {
          margin: "0 0 0 354px"
        },
        700,
        function() {
          //Animation Complete
        }
      );
    }
  }

  //toggle tree mark
  selectedOldTreeMarker = selectedTreeMarker;
  selectedTreeMarker = marker;
  changeTreeMarkSelected();

  // always center this one
  map.panTo(marker.getPosition());

  $("#create-data").html(
    moment(point["time_created"]).format("MM/DD/YYYY hh:mm A")
  );
  if (wallet != null) {
    $("#created_on").hide();
    $("#tree_id_holder").hide();
    $("#impact-owner-data").html("@" + wallet);
    $("#status-data").html("Token issued");
    $("#token-id-data").html(point["token_uuid"]);
  } else {
    $("#sponsor").hide();
    $("#token_holder").hide();
  }
  $("#updated-data").html(point["time_updated"]);
  $("#gps-accuracy-data").html(point["gps_accuracy"]);
  $("#latitude-data").html(point["lat"]);
  $("#longitude-data").html(point["lon"]);
  if (point["missing"]) {
    $("#missing-data").html(YES);
  } else {
    $("#missing-data").html(NO);
  }
  if (point["dead"]) {
    $("#dead-data").html(YES);
  } else {
    $("#dead-data").html(NO);
  }
  $("#tree-image").attr("src", point["image_url"]);
  $("#tree-id").html(point["id"]);
  $("#planter_name").html(
    point["first_name"] + " " + point["last_name"].slice(0, 1)
  );
  if (point["user_image_url"]) {
    $("#planter_image").attr("src", point["user_image_url"]);
  } else {
    $("#planter_image").attr("src", "/img/LogoOnly_Bright_Green100x100.png");
  }
  $("#tree_next").val(getCircularPointIndex(index + 1));
  $("#tree_prev").val(getCircularPointIndex(index - 1));

  $("#tree_next")
    .off("click")
    .on("click", function() {
      fetchMarkers = false;
      var index = parseInt($(this).val(), 10);
      panelLoader.classList.add("active");
      showMarkerInfoByIndex(index);
      $("#tree-image").on("load", function() {
        panelLoader.classList.remove("active");
      });
    });

  $("#tree_prev")
    .off("click")
    .on("click", function() {
      fetchMarkers = false;
      var index = parseInt($(this).val(), 10);
      panelLoader.classList.add("active");
      showMarkerInfoByIndex(index);
      $("#tree-image").on("load", function() {
        panelLoader.classList.remove("active");
      });
    });
}

function changeTreeMarkSelected() {
  if (selectedOldTreeMarker) {
    selectedOldTreeMarker.setIcon(require("./images/pin_29px.png"));
    selectedOldTreeMarker.setZIndex(0);
  }

  if (selectedTreeMarker) {
    selectedTreeMarker.setIcon(require("./images/pin_32px.png"));
    selectedTreeMarker.setZIndex(window.google.maps.Marker.MAX_ZINDEX);
  }
}

// using an index, get the point and marker and show them
function showMarkerInfoByIndex(index) {
  var point = points[index];
  var marker = markerByPointId[point["id"]];
  showMarkerInfo(point, marker, index);
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
  //log.log(overlays);
  for (var i = 0; i < overlays.length; i++) {
    //log.log(i);
    overlays[i].setMap(null);
  }
  overlays.length = 0;
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
  if (!results[1]) return "";
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
    var east = bounds.getNorthEast().lng();
    var west = bounds.getSouthWest().lng();
    var north = bounds.getNorthEast().lat();
    var south = bounds.getSouthWest().lat();
    // Get the longitude and latitude differences
    var longitudeDifference = (east - west) * offset;
    var latitudeDifference = (north - south) * offset;

    // Move each point farther outside the rectangle
    // To west
    bounds.extend(new window.google.maps.LatLng(south, west - longitudeDifference));
    // To east
    bounds.extend(new window.google.maps.LatLng(north, east + longitudeDifference));
    // To south
    bounds.extend(new window.google.maps.LatLng(south - latitudeDifference, west));
    // To north
    bounds.extend(new window.google.maps.LatLng(north + latitudeDifference, east));
  }
  return bounds;
}

function toUrlValueLonLat(bounds) {
  var east = bounds.getNorthEast().lng();
  var west = bounds.getSouthWest().lng();
  var north = bounds.getNorthEast().lat();
  var south = bounds.getSouthWest().lat();
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
  map.panTo(bounds.center);
  map.setZoom(bounds.zoomLevel);
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

class freetownOverlay {
  constructor(tileSize) {
    this.tileSize = tileSize;
  }
  getTile(coord, zoom, ownerDocument) {
    const div = ownerDocument.createElement("div");
    const y = (Math.pow(2, zoom) - coord.y - 1)
    div.style.backgroundPosition = 'center center';
    div.style.backgroundRepeat = 'no-repeat';
    div.style.height = this.tileSize.height + 'px';
    div.style.width = this.tileSize.width + 'px';
    div.tileId = 'x_' + coord.x + '_y_' + coord.y + '_zoom_' + zoom; 
    div.style.backgroundImage = 'url(' + "https://treetracker-map-tiles.nyc3.digitaloceanspaces.com/freetown/" + zoom + "/" + coord.x + "/" + y  + ".png" + ')';
    //check if coord is in tile range
    if (zoom == 10 && coord.x == 474 && y < 537 && y > 534) {
      return div;
    } else if (zoom == 11 && coord.x > 947 && coord.x < 950 && y > 1070 && y < 1073) {
      return div;
    } else if (zoom == 12 && coord.x > 1895 && coord.x < 1899 && y > 2142 && y < 2146) {
      return div;
    } else if (zoom == 13 && coord.x > 3792 && coord.x < 3798 && y > 4286 && y < 4291) {
      return div;
    } else if (zoom == 14 && coord.x > 7585 && coord.x < 7595 && y > 8574 && y < 8581) {
      return div;
    } else if (zoom == 15 && coord.x > 15172 && coord.x < 15190 && y > 17149 && y < 17161) {
      return div;
    } else if (zoom == 16 && coord.x > 30345 && coord.x < 30379 && y > 34300 && y < 34322) {
      return div;
    } else if (zoom == 17 && coord.x > 60692 && coord.x < 60758 && y > 68602 && y < 68643) {
      return div;
    } else if (zoom == 18 && coord.x > 121385 && coord.x < 121516 && y > 137206 && y < 137286) {
      return div;
    } 
  }
  releaseTile(tile) {}
}


  var mapOptions = {
    zoom: initialZoom,
    center: { lat: 20, lng: 0 },
    minZoom: minZoom,
    mapTypeId: "hybrid",
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
//    backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.grey.A200,
  };
   if(mapName != null && !!mapConfig[mapName]) {
    mapOptions.zoom = mapConfig[mapName].zoom;
    mapOptions.center = mapConfig[mapName].center;
  }


  map = new window.google.maps.Map(document.getElementById("map-canvas"), mapOptions);
// insert freetown overlay
  map.overlayMapTypes.insertAt(
    0,
    new freetownOverlay(new window.google.maps.Size(256, 256))
  );
  map.data.loadGeoJson(
    "https://treetracker-map-features.fra1.digitaloceanspaces.com/freetown_catchments.geojson"
  );
  map.data.setStyle({
    strokeWeight: 1,
    strokeOpacity: 1,
    strokeColor: 'green'
  });

  // only fetch when the user has made some sort of action
  window.google.maps.event.addListener(map, "dragstart", function() {
    fetchMarkers = true;
    firstInteraction = true;
  });

  function registerFirstInteraction() {
    firstInteraction = true;
  }

  window.google.maps.event.addListener(map, "click", registerFirstInteraction);

  window.google.maps.event.addListener(map, "mousemove", registerFirstInteraction);

  window.google.maps.event.addListener(map, "zoom_changed", function() {
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


  window.google.maps.event.addListener(map, "idle", function() {
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
          if (data.length === 0) {
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
};

window.google.maps.event.addDomListener(window, "load", initialize);

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
  var marker = new window.google.maps.Marker({
    position: LatLng,
    map: map,
    title: "Tree",
    icon: {
      url: require("./images/pin_29px.png"),
    },
    zIndex: undefined,
    payload: {
      id: tree.id,
    }
  });
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
  return index;
}

function goNextPoint(){
  const index = getCurrentIndex();
  const nextIndex = (index + 1) % points.length;
  expect(nextIndex).within(0, points.length);
  const nextPoint = points[nextIndex];
  const marker = markerByPointId[nextPoint.id];
  expect(marker).defined();
  marker.triggerClick4Test();
}

function goPrevPoint(){
  const index = getCurrentIndex();
  const prevIndex = (index - 1)>= 0?
    ((index -1) % points.length)
    :
    points.length + (index -1);
  expect(prevIndex).within(0, points.length);
  const prevPoint = points[prevIndex];
  const marker = markerByPointId[prevPoint.id];
  expect(marker).defined();
  marker.triggerClick4Test();
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
  getPrevPoint,
  getNextPoint,
  goPrevPoint,
  goNextPoint,
  hasPrevPoint,
  hasNextPoint,
  addMarkerByPixel,
  rerender,
}

}

export default load;
