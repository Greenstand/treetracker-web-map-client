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
      moreEffect: false,
      filters: {},
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

  static parseUtfData(utfData){
    const [lon, lat] = JSON.parse(utfData.latlon).coordinates;
    const data = {
      ...utfData,
      lat,
      lon,
    };
    return data;
  }

  /***************************** methods ***************************/

  async mount(domElement){
    const mapOptions = {
      minZoom: this.minZoom,
      center: this.initialCenter,
      zoomControl: false,
    }
    this.map = this.L.map(domElement, mapOptions);

    //control
    this.control = this.L.control.zoom({
        position: 'bottomright'
    });
    this.control.addTo(this.map);
    this.map.setView(this.initialCenter, this.minZoom);

    //load google map
    await this.loadGoogleSatellite();

    /*
     * The logic is:
     * If there is a filter, then try to zoom in and set the zoom is
     * appropriate for the filter, then load the tile.
     * But if there is a bounds ( maybe the browser was refreshed or jump
     * to the map by a shared link), then jump the bounds directly, 
     * regardless of the initial view for filter.
     */
    if(this.filters.bounds){
      await this.gotoBounds(this.filters.bounds);
    }else{
      await this.loadInitialView();
    }

    //fire load event
    this.onLoad && this.onLoad();

    //load tile
    if(this.filters.treeid){
      log.info("treeid mode do not need tile server");
    }else{
      await this.loadTileServer();
    }

    //mount event
    this.map.on("moveend", e => {
      log.warn("move end", e);
      this.updateUrl();
    });

    await this.loadDebugLayer();

    if(this.filters.treeid){
      await this.loadTree(this.filters.treeid);
    }

  }

  async loadGoogleSatellite(){
    log.warn("load google satellite map");
    this.layerGoogle = this.L.gridLayer.googleMutant({
      maxZoom: this.maxZoom,
      type: 'satellite'
    });
    this.layerGoogle.addTo(this.map);
    //wait loaded
    await new Promise((res, _rej) => {
      this.layerGoogle.once("load", async () => {
        log.warn("google layer loaded");
        res();
      });
    });
  }

  async gotoBounds(bounds){
    const [southWestLng, southWestLat, northEastLng, northEastLat] = 
      bounds.split(",");
    log.warn("go to bounds:", bounds);
    if(this.moreEffect){
      this.map.flyToBounds([
        [southWestLat, southWestLng],
        [northEastLat, northEastLng]
      ]);
      log.warn("waiting bound load...");
      await new Promise((res, _rej) => {
        const boundFinished = () => {
          log.warn("fire bound finished");
          this.map.off("moveend");
          res();
        }
        this.map.on("moveend", boundFinished);
      });
    }else{
      this.map.fitBounds([
        [southWestLat, southWestLng],
        [northEastLat, northEastLng]
      ], {animate: false});
      //no effect, return directly
    }
  }

  async loadTileServer(){
    //tile 
    const filterParameters = this.getFilterParameters();
    this.layerTile = new this.L.tileLayer(
      `${this.tileServerUrl}{z}/{x}/{y}.png${filterParameters && "?" + filterParameters}`,
      {
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        //close to avoid too many requests
        updateWhenZooming: true,
        updateWhenIdle: true,
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
        this.clickMarker(Map.parseUtfData(e.data));
      }
    });

    this.layerUtfGrid.on('mouseover', (e) => {
      log.debug("mouseover:", e);
      this.highlightMarker(Map.parseUtfData(e.data));
    });

    this.layerUtfGrid.on('mouseout', (e) => {
      log.debug("e:", e);
      this.unHighlightMarker();
    });
    this.layerUtfGrid.addTo(this.map);

  }

  async unloadTileServer(){
    if(this.map.hasLayer(this.layerTile)){
      this.map.removeLayer(this.layerTile);
    }else{
      log.warn("try to remove nonexisting tile layer"); 
    }
    if(this.map.hasLayer(this.layerUtfGrid)){
      this.map.removeLayer(this.layerUtfGrid);
    }else{
      log.warn("try to remove nonexisting grid layer"); 
    }
  }

  async loadDebugLayer(){
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

  async loadTree(treeid){
    const res = await this.requester.request({
      url: `${this.apiServerUrl}tree?tree_id=${treeid}`,
    });
    const {lat, lon, id} = res;
    const data = {
      id,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    }
    this.selectMarker(data);
    this.onClickTree && this.onClickTree(data);
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
              iconSize: [32, 32],
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
    if(data.type === "point"){
      this.selectMarker(data);
      this.onClickTree && this.onClickTree(data);
    }else if(data.type === "cluster"){
      if(data.zoom_to){
        log.info("found zoom to:", data.zoom_to);
        const [lon, lat] = JSON.parse(data.zoom_to).coordinates;
        //NOTE do cluster click
        if(this.moreEffect){
          this.map.flyTo([lat, lon], this.map.getZoom() + 2);
        }else{
          this.map.setView([lat, lon], this.map.getZoom() + 2, {animate: false});
        }
      }else{
        if(this.moreEffect){
          this.map.flyTo([data.lat, data.lon], this.map.getZoom() + 2);
        }else{
          this.map.setView([data.lat, data.lon], this.map.getZoom() + 2, {animate: false});
        }
      }
    }else{
      throw new Error("do not support type:", data.type);
    }
  }

  selectMarker(data){
    log.info("change tree mark selected");
    //before set the selected tree icon, remote if any
    this.unselectMarker();
    
    //set the selected marker
    this.layerSelected = new this.L.marker(
      [data.lat, data.lon],
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
    this.layerSelected.payload = data;
    this.layerSelected.addTo(this.map);
  }

  unselectMarker(){
    if(this.map.hasLayer(this.layerSelected)){
      this.map.removeLayer(this.layerSelected);
    }else{
      log.warn("try to remove nonexisting layer selected"); 
    }
  }

  async loadInitialView(){
    let view;
    if(this.filters.userid || this.filters.wallet){
      log.warn("try to get initial bounds");
      const response = await this.requester.request({
        url: `${this.apiServerUrl}trees?clusterRadius=${Map.getClusterRadius(10)}&zoom_level=10&${this.getFilterParameters()}`,
      });
      view = getInitialBounds(
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
    }else if(this.filters.treeid){
      const res = await this.requester.request({
        url: `${this.apiServerUrl}tree?tree_id=${this.filters.treeid}`,
      });
      const {lat, lon} = res;
      view = {
        center: {
          lat,
          lon,
        },
        zoomLevel: 16,
      }
    }

    //jump to initial view
    if(view){
      if(this.moreEffect){
        this.map.flyTo(view.center, view.zoomLevel);
        log.warn("waiting initial view load...");
        await new Promise((res, _rej) => {
          const finished = () => {
            log.warn("fire initial view finished");
            this.map.off("moveend");
            res();
          }
          this.map.on("moveend", finished);
        });
      }else{
        this.map.setView(view.center, view.zoomLevel, {animate: false});
      }
    }
  }

  getFilters(){
    const filters = {};
    if(this.filters.userid){
      filters.userid = this.filters.userid;
    }
    if(this.filters.wallet){
      filters.wallet = this.filters.wallet;
    }
    if(this.filters.treeid){
      filters.treeid = this.filters.treeid;
    }
    if(this.filters.timeline){
      filters.timeline = this.filters.timeline;
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

  goNextPoint(){
    log.info("go next tree");
    const currentPoint = this.layerSelected.payload;
    expect(currentPoint).match({
      lat: expect.any(Number),
    });
    const points = this.getPoints();
    const index = points.reduce((a,c,i) => {
      if(c.id === currentPoint.id){
        return i;
      }else{
        return a;
      }
    },-1);
    if(index !== -1){
      if(index === points.length - 1){
        log.info("no more next");
        return false;
      }else{
        const nextPoint = points[index + 1];
        this.clickMarker(nextPoint);
      }
    }else{
      log.error("can not find the point:", currentPoint, points);
      throw new Error("can not find the point");
    }
  }

  goPrevPoint(){
    log.info("go previous tree");
    const currentPoint = this.layerSelected.payload;
    expect(currentPoint).match({
      lat: expect.any(Number),
    });
    const points = this.getPoints();
    const index = points.reduce((a,c,i) => {
      if(c.id === currentPoint.id){
        return i;
      }else{
        return a;
      }
    },-1);
    if(index !== -1){
      if(index === 0){
        log.info("no more previous");
        return false;
      }else{
        const prevPoint = points[index - 1];
        this.clickMarker(prevPoint);
      }
    }else{
      log.error("can not find the point:", currentPoint, points);
      throw new Error("can not find the point");
    }
  }

  /*
   * To get all the points on the map, (tree markers), now, the way to
   * achieve this is that go through the utf grid and get all data.
   */
  getPoints(){
    //fetch all the point data in the cache
    const itemList = Object.values(this.layerUtfGrid._cache)
      .map(e => e.data).filter(e => Object.keys(e).length > 0)
      .reduce((a,c) => a.concat(Object.values(c)),[])
      .map(data => Map.parseUtfData(data))
      .filter(data => data.type === "point");
    log.info("loaded data in utf cache:", itemList.length);

    //filter the duplicate points
    const itemMap = {};
    itemList.forEach(e => itemMap[e.id] = e);

    //update the global points 
    const points = Object.values(itemMap);
    log.warn("find points:", points.length);
    log.warn("find points:", points);
    return points;
  }

  async rerender(){
    log.info("rerender");
    log.info("reload tile");
    this.unloadTileServer();
    this.loadTileServer();
  }

  /*
   * reset the config of map instance
   */
  setFilter(filters){
    this.filters = filters;
  }

}
