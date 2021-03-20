import * as mapTools from "./mapTools";
import React from "react";
import {mount} from "cypress-react-unit-test";
import expectRuntime from "expect-runtime";

const TILE_SIZE = 256;
// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng: google.maps.LatLng) {
  let siny = Math.sin((latLng.lat() * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}

describe("mapTools", () => {

  it("map", () => {
    function Test(){
      React.useEffect(() => {
        console.log("load map...");
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDUGv1-FFd7NFUS6HWNlivbKwETzuIPdKE&libraries=geometry';
        script.id = 'googleMaps';
        document.body.appendChild(script);

        script.onload = () => {
          console.log("loaded map file");
          const chicago = new window.google.maps.LatLng(41.85, -87.65);
          const map = new window.google.maps.Map(document.getElementById("map-canvas"), {
            zoom: 3,
            center: chicago,
          });
          //marker
          const marker = new window.google.maps.Marker({
            position: chicago,
            map,
          });
          window.google.maps.event.addListener(map, "idle", function(){
            try{

              const scale = 1 << map.getZoom();
              const worldCoordinate = project(chicago);
              const pixelCoordinate = new google.maps.Point(
                Math.floor(worldCoordinate.x * scale),
                Math.floor(worldCoordinate.y * scale),
              );
              console.log("pixel coord:", pixelCoordinate);

              const bounds = map.getBounds();
              console.log("bounds:", bounds, map.getBounds());
              new window.google.maps.Marker({
                position: {
                  lat: chicago.lat(),
                  lng: bounds.getSouthWest().lng(),
                },
                map,
              });
              const worldCoordinate2 = project(new window.google.maps.LatLng(chicago.lat(), bounds.getSouthWest().lng()));
              const pixelCoordinate2 = new google.maps.Point(
                Math.floor(worldCoordinate2.x * scale),
                Math.floor(worldCoordinate2.y * scale),
              );
              console.log("pixel coordinate 2:", pixelCoordinate2);

              //put a marker on position, with pixel coordinate 20,20
              const mapDiv = document.getElementById("map-canvas");
              expectRuntime(mapDiv).defined();
              const width = mapDiv.clientWidth;
              expectRuntime(width).above(0);
              const height = mapDiv.clientHeight;
              expectRuntime(height).above(0);
              console.log("width:", width);
              console.log("height:", height);
              const position = mapTools.getLatLngCoordinateByPixel(height/2, width, map);
              new window.google.maps.Marker({
                position: position,
                map,
              });
            }catch(e){
              console.error(e);
            }
          });
        }
      }, []);
      return (
        <div id="map-canvas" style={{
          width: "100%",
          height: "100vh",
        }}></div>
      )
    }

    mount(<Test/>);
  });
});

describe("Test getPixelCoordinateByLatLng", () => {

  it.only("", () => {
    let map;
    function Test(){
      React.useEffect(() => {
        console.log("load map...");
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDUGv1-FFd7NFUS6HWNlivbKwETzuIPdKE&libraries=geometry';
        script.id = 'googleMaps';
        document.body.appendChild(script);

        script.onload = () => {
          console.log("loaded map file");
          const chicago = new window.google.maps.LatLng(41.85, -87.65);
          map = new window.google.maps.Map(document.getElementById("map-canvas"), {
            zoom: 8,
            center: chicago,
          });
          //marker
          const marker = new window.google.maps.Marker({
            position: chicago,
            map,
          });
          window.google.maps.event.addListener(map, "idle", function(){
            //calculate the corner
            try{
              const bounds = map.getBounds();
              const northWest = new window.google.maps.LatLng(
                map.getBounds().getNorthEast().lat(),
                map.getBounds().getSouthWest().lng());
              const eastSouth = new window.google.maps.LatLng(
                map.getBounds().getSouthWest().lat(),
                map.getBounds().getNorthEast().lng());
              let result = mapTools.getPixelCoordinateByLatLng(northWest.lat(),northWest.lng(),map);
              console.log("Result:", result);
              //check, the north west corner shoud be the 0,0 corner of the HTML div
              expectRuntime(result).match({
                top: 0,
                left: 0,
              });
              //a point that is located at the point on the above and left of the north west corner
              result = mapTools.getPixelCoordinateByLatLng(northWest.lat()+0.001,northWest.lng()-0.001,map);
              console.log("Result:", result);
              //check, the north west corner shoud be the 0,0 corner of the HTML div
              expectRuntime(result.top).below(0);
              expectRuntime(result.left).below(0);

              //a point that is located at the point on the below and right of the east south corner
              result = mapTools.getPixelCoordinateByLatLng(eastSouth.lat()-0.001,eastSouth.lng()+0.001,map);
              console.log("Result:", result);
              //check, the north west corner shoud be the 0,0 corner of the HTML div
              const div = document.getElementById("map-canvas");
              console.log("dive:", div.clientHeight, div.clientWidth);
              expectRuntime(result.top).above(div.clientHeight);
              expectRuntime(result.left).above(div.clientWidth);
            }catch(e){
              console.log(e);
            }
          });
        }
      }, []);
      return (
        <div id="map-canvas" style={{
          width: "100%",
          height: "100vh",
        }}></div>
      )
    }

    mount(<Test/>);
  });
});

