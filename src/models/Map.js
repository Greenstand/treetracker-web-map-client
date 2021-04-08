/*
 * The main model for the treetracker model
 */
import  log from "loglevel";
import expect from "expect-runtime";
import Requester from "./Requester";
import {getInitialBounds} from "../mapTools";

export default class Map{

  constructor(options){

    //default
    options = {...{
      L: window.L,
      minZoom: 2,
      maxZoom: 20,
      initialCenter: [20, 0],
      tileServerUrl: process.env.REACT_APP_TILE_SERVER_URL,
      apiServerUrl: process.env.REACT_APP_API,
      width: window.innerWidth,
      height: window.innerHeight,
      debug: true,
    }, ...options};

    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
    //log.warn("options:", options);

    //requester
    this.requester = new Requester();
  }

  /***************************** static ****************************/
  static formatClusterText(count){
    if(count > 1000){
      return `${Math.round(count/1000)}K`;
    }else{
      return count;
    }
  }
  static getClusterRadius(zoom) {
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

  /***************************** methods ***************************/

  async mount(domElement){
    const mapOptions = {
      minZoom: this.minZoom,
      center: this.initialCenter,
    }
    this.map = this.L.map(domElement, mapOptions);


    //google satellite map
    this.layerGoogle = this.L.gridLayer.googleMutant({
      maxZoom: this.maxZoom,
      type: 'satellite'
    });
    this.layerGoogle.once("load", async () => {
      log.warn("google layer loaded");

      /*
       * Backgrond is ready, now load the map, the logic is:
       * If there is a filter, then try to zoom in and set the zoom is
       * appropriate for the filter, then load the tile.
       * But if there is a bounds ( maybe the browser was refreshed or jump
       * to the map by a shared link), then jump the bounds directly, 
       * regardless of the initial view for filter.
       */
      if(this.bounds){
        const [southWestLng, southWestLat, northEastLng, northEastLat] = 
          this.bounds.split(",");
        log.warn("fly to bounds:", this.bounds);
        this.map.flyToBounds([
          [southWestLat, southWestLng],
          [northEastLat, northEastLng]
        ]);
      }else{
        //jump to initial view
        const initialView = await this.getInitialView();
        if(initialView){
          this.map.flyTo(initialView.center, initialView.zoomLevel);
        }
      }

      //fire load event
      this.onLoad && this.onLoad();

      //load tile
      this.loadTileServer();

      this.map.on("moveend", e => {
        log.warn("move end", e);
        this.updateUrl();
      });
    });
    this.layerGoogle.addTo(this.map);

    this.loadDebugLayer();

    this.map.setView(this.initialCenter, this.minZoom);
  }

  loadTileServer(){
    //tile 
    const filterParameters = this.getFilterParameters();
    this.layerTile = new this.L.tileLayer(
      `${this.tileServerUrl}{z}/{x}/{y}.png${filterParameters && "?" + filterParameters}`,
      {
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        //close to avoid too many requests
        updateWhenZooming: false,
        updateWhenIdle: false,
      }
    );
    this.layerTile.addTo(this.map);

    this.layerUtfGrid = new this.L.utfGrid(
      `${this.tileServerUrl}{z}/{x}/{y}.grid.json${filterParameters && "?" + filterParameters}`,
      {
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        //close to avoid too many requests
        updateWhenZooming: false,
        updateWhenIdle: false,
      }
    );
    this.layerUtfGrid.on('click', (e) => {
      log.warn("click:", e);
      if (e.data) {
        this.clickMarker(e.data);
      }
    });

    this.layerUtfGrid.on('mouseover', (e) => {
      log.debug("mouseover:", e);
      const [lon, lat] = JSON.parse(e.data.latlon).coordinates;
      this.highlightMarker({
        ...e.data,
        lat,
        lon,
      });
//      markerHighlight.payload = {
//        id: e.data.id
//      };
    });

    this.layerUtfGrid.on('mouseout', (e) => {
      log.debug("e:", e);
      this.unHighlightMarker();
    });
    this.layerUtfGrid.addTo(this.map);

  }

  loadDebugLayer(){
    //debug
    this.L.GridLayer.GridDebug = this.L.GridLayer.extend({
      createTile: function (coords) {
        const tile = document.createElement('div');
        tile.style.outline = '1px solid green';
        tile.style.fontWeight = 'bold';
        tile.style.fontSize = '14pt';
        tile.style.color = 'white';
        tile.innerHTML = [coords.z, coords.x, coords.y].join('/');
        return tile;
      },
    });
    this.L.gridLayer.gridDebug = (opts) => {
      return new this.L.GridLayer.GridDebug(opts);
    };
    this.map.addLayer(this.L.gridLayer.gridDebug());
  }


  highlightMarker(data){
    if(data.type === "point"){
      this.layerHighlight = new this.L.marker(
        [data.lat, data.lon],
        {
            icon: new this.L.DivIcon({
              className: "greenstand-point-highlight",
              html: `
                <div class="greenstand-point-highlight-box"  >
                <div></div>
                </div>
              `,
            }),
        }
      );
    }else if(data.type === "cluster"){
      this.layerHighlight = new this.L.marker(
        [data.lat, data.lon],
        {
            icon: new this.L.DivIcon({
              className: "greenstand-cluster-highlight",
              html: `
                <div class="greenstand-cluster-highlight-box ${data.count > 1000? '':'small'}"  >
                <div>${Map.formatClusterText(data.count)}</div>
                </div>
              `,
            }),
        }
      );
    }else{
      throw new Error("wrong type:", data);
    }
    this.layerHighlight.addTo(this.map);
  }

  unHighlightMarker(){
    if(this.map.hasLayer(this.layerHighlight)){
      this.map.removeLayer(this.layerHighlight);
    }else{
      log.warn("try to remove nonexisting layer"); 
    }
  }

  clickMarker(data){
    this.unHighlightMarker();
    const [lon, lat] = JSON.parse(data.latlon).coordinates;
    if(data.type === "point"){
    }else if(data.type === "cluster"){
      if(data.zoom_to){
        log.info("found zoom to:", data.zoom_to);
        const [lon, lat] = JSON.parse(data.zoom_to).coordinates;
        //NOTE do cluster click
        this.map.flyTo([lat, lon], this.map.getZoom() + 2);
      }else{
        this.map.flyTo([lat, lon], this.map.getZoom() + 2);
      }
    }else{
      throw new Error("do not support type:", data.type);
    }
  }

  async getInitialView(){
    if(this.userid){
      log.warn("try to get initial bounds");
      const response = await this.requester.request({
        url: `${this.apiServerUrl}trees?clusterRadius=${Map.getClusterRadius(10)}&zoom_level=10&${this.getFilterParameters()}`,
      });
      const view = getInitialBounds(
        response.data.map(i => {
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
        this.width,
        this.height,
      );
      return view;
    }
  }

  getFilters(){
    const filters = {};
    if(this.userid){
      filters.userid = this.userid;
    }
    return filters;
  }

  getFilterParameters(){
    const filter = this.getFilters();
    const queryUrl = Object.keys(filter).reduce((a,c) => {
      return `${c}=${filter[c]}` + (a && `&${a}` || "");
    }, "");
    return queryUrl;
  }

//  getClusterRadius(zoomLevel){
//    //old code
//    //var clusterRadius = getQueryStringValue("clusterRadius") || getClusterRadius(queryZoomLevel);
//    return Map.getClusterRadius(zoomLevel);
//  }

  updateUrl(){
    log.warn("update url");
    window.history.pushState('treetrakcer', '', `/?${this.getFilterParameters()}&bounds=${this.getCurrentBounds()}`);
  }

  getCurrentBounds(){
    return this.map.getBounds().toBBoxString();
  }

  getLeafletMap(){
    return this.map;
  }

}
