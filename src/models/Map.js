/*
 * The main model for the treetracker model
 */
import  log from "loglevel";
import expect from "expect-runtime";

export default class Map{

  constructor(options){

    //default
    options = {...{
      L: window.L,
      minZoom: 2,
      maxZoom: 20,
      initialCenter: [20, 0],
      tileServerUrl: process.env.REACT_APP_TILE_SERVER_URL,
      debug: true,
    }, ...options};

    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
    log.info("options:", options);
  }

  static formatClusterText(count){
    if(count > 1000){
      return `${Math.round(count/1000)}K`;
    }else{
      return count;
    }
  }

  mount(domElement){
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
    this.layerGoogle.addTo(this.map);

    //tile 
    this.layerTile = new this.L.tileLayer(
      `${this.tileServerUrl}{z}/{x}/{y}.png`,
      {
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
      }
    );
    this.layerTile.addTo(this.map);

    this.layerUtfGrid = new this.L.utfGrid(
      `${this.tileServerUrl}{z}/{x}/{y}.grid.json`,
      {
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
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
        lat,
        lon,
        count: e.data.count,
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

    this.map.on("load", () => {
      log.info("map loaded");
      expect(this.onLoad).defined();
      this.onLoad && this.onLoad();
    });

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

    this.map.setView(this.initialCenter, this.minZoom);
  }

  highlightMarker(data){
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
    if(data.zoom_to){
      log.info("found zoom to:", data.zoom_to);
      const [lon, lat] = JSON.parse(data.zoom_to).coordinates;
      //NOTE do cluster click
      this.map.flyTo([lat, lon], this.map.getZoom() + 2);
    }else{
      this.map.flyTo([lat, lon], this.map.getZoom() + 2);
    }
  }

}
