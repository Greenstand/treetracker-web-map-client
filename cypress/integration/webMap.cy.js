import expectRuntime from "expect-runtime";
import * as mapTools from "../../src/mapTools";
const scale = 1;



describe.only("Spin case", () => {

  let data = JSON.parse(`{"data":[{"type":"cluster","id":6632615,"centroid":{"type":"Point","coordinates":[0,0]},"region_type":5,"count":"158"}],"zoomTargets":[{"region_id":6632615,"most_populated_subregion_id":6632420,"total":"100","zoom_level":4,"centroid":{"type":"Point","coordinates":[0,0]}}]}`);

  //deal with location
  data = {data: data.data.map(d => ({...d, centroid: JSON.stringify(d.centroid)})), zoomTargets: data.zoomTargets.map(d => ({...d, centroid: JSON.stringify(d.centroid)}))};

  it("", () => {
    cy.intercept(/\/trees\?.*zoom_level=(2|4|6|8|10|12|14).*/, req => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1);
      })
        .then(() => {
          req.reply(data);
        });
    }).as("requestCluster");
    cy.intercept(/\/trees\?.*zoom_level=16.*/, req => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 4000);
      })
        .then(() => {
          req.reply({
              data:[{type: "point", id: 198033, lat: "0", lon: "0.0002"}],
          });
        });
    }).as("requestTrees");
    cy.visit("http://localhost:3000");
    cy.wait("@requestCluster");
    cy.wait(1000);
    cy.get("div[aria-label=158]").click({force:true});
    cy.wait(1000);
    cy.wait("@requestCluster");
    cy.get("div[aria-label=158]").click({force:true});
    cy.wait(1000);
    cy.wait("@requestCluster");
    cy.get("div[aria-label=158]").click({force:true});
    cy.wait(1000);
    cy.wait("@requestCluster");
    cy.get("div[aria-label=158]").click({force:true});
    cy.wait(1000);
    cy.wait("@requestCluster");
    cy.get("div[aria-label=158]").click({force:true});
    cy.wait(1000);
    cy.wait("@requestCluster");
    cy.get("div[aria-label=158]").click({force:true});
    cy.wait(1000);
    cy.wait("@requestCluster");
    cy.get("div[aria-label=158]").click({force:true});
    cy.wait(1000);
    cy.wait("@requestTrees");
  });

  it.only("load", () => {
    cy.intercept(/\/trees\?.*zoom_level=(2|4|6|8|10|12|14).*/, req => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1);
      })
        .then(() => {
          req.reply(data);
        });
    }).as("requestCluster");
    cy.intercept(/\/trees\?.*zoom_level=16.*/, req => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 4000);
      })
        .then(() => {
          req.reply({
              data:[{type: "point", id: 198033, lat: "0", lon: "0.0002"}],
          });
        });
    }).as("requestTrees");
    cy.visit("http://localhost:3000");
    cy.wait("@requestCluster");
  });

});

describe.skip("Web Map", () => {
  
  before(() => {
    //cy.viewport("iphone-6");
    //most popular screen solution
    cy.viewport(1366,768);
  });

  it("Web map", () => {
    //cy.viewport("ipad-2");
//    cy.viewport("iphone-x");
//    cy.viewport("macbook-13");
    //cy.viewport("samsung-note9");
//    cy.visit("http://localhost:3000/");
//    cy.visit("http://test.dadiorchen.com");
    cy.visit("http://localhost:3000");
    cy.get("img[alt=logo]");
    cy.contains(/137K/,{timeout: 1000*30});
    cy
      .get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers().forEach(marker => {
          if(marker.getLabel().text === "137K"){
            marker.triggerClick();
          };
        });
      });
    cy.wait(1000);
    cy.get("#map-canvas", {timeout:1000*30})
      .should(e1 => {
        expect(e1[0].map.getLoadingMarkers()).to.be.equal(false);
      });
    cy.wait(3000);
    cy.contains(/3/,{timeout: 1000*30});
    cy
      .get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers().forEach(marker => {
          if(marker.getLabel().text === "3"){
            marker.triggerClick();
          };
        });
      });
    cy.wait(1000);
    cy.get("#map-canvas", {timeout:1000*30})
      .should(e1 => {
        expect(e1[0].map.getLoadingMarkers()).to.be.equal(false);
      });
    cy.contains(/2/,{timeout: 1000*30});
    cy
      .get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers().reverse().forEach(marker => {
          if(marker.getLabel().text === "2"){
            marker.triggerClick();
          };
        });
      });
    cy.wait(1000);
    cy.get("#map-canvas", {timeout:1000*30})
      .should(e1 => {
        expect(e1[0].map.getLoadingMarkers()).to.be.equal(false);
      });
    cy.contains(/2/,{timeout: 1000*30});
    cy
      .get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers().forEach(marker => {
          if(marker.getLabel().text === "2"){
            marker.triggerClick();
          };
        });
      });
    cy.wait(1000);
    cy.get("#map-canvas", {timeout:1000*30})
      .should(e1 => {
        expect(e1[0].map.getLoadingMarkers()).to.be.equal(false);
      });
    cy.contains(/1/,{timeout: 1000*30});
    cy
      .get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers().forEach(marker => {
          if(marker.getLabel().text === "1"){
            marker.triggerClick();
          };
        });
      });
    cy.wait(2000);
    cy.get("#map-canvas", {timeout:1000*30})
      .should(e1 => {
        expect(e1[0].map.getLoadingMarkers()).to.be.equal(false);
      });
    cy.get("img[src='/img/pin_29px.png']",{timeout:1000*30});
    cy.get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers()[0].triggerClick();
      });
    cy.contains(/Tree Id: #\d+/);
    //planter pic
    //cy.get("img[src*='1232954293620066732.jpg']");
    cy.contains("Tree Verified");
    cy.contains("Sebastian G");
    cy.contains("11/19/2018 09:10 PM");
    cy.get("#planter-img")
      .find("img")
      .should("has.attr", "src")
      .and("match", /.jpg/);
    cy.get("#tree_img")
      .should("has.attr", "src")
      .and("match", /.jpg/);
    cy.get("#map-canvas")
      .then($map => {
        expect($map[0].map.getPoints()).lengthOf.least(1);
      });
    cy.get("button[title='next tree']")
      .click();
    cy.get("button[title='previous tree']")
      .click();
//    cy.pause();
//    cy.wait(10000*scale);
//    cy.get("#map-canvas")
//      .then(el => {
//        console.log("el:", el);
//        //click
//        el[0].markers.forEach(marker => {
//          console.log("marker:", marker);
//          if(marker.payload.id === 222187){
//            console.log("trigger");
//            marker.triggerClick();
//            //window.google.maps.event.trigger(marker, 'click');
//          };
//        });
//      });
//    cy.contains("Clyde");
//    cy.contains(/#\d+/i);
//    cy.wait(2000*scale);
//    cy.get("button[title='next tree']")
//      .click();
//    cy.wait(2000*scale);
//    cy.get("button[title='next tree']")
//      .click();
  });

  it("SidePanel", () => {
    cy.visit("http://localhost:3000");
    cy.get("img[alt=logo]");
    cy.get("#map-canvas")
      .then($map => {
        expectRuntime($map[0])
          .property("showPanel")
          .actual({
            id: 1,
            first_name: "Dadior",
            last_name: "Chen",
          });
      });
    cy.get("img[src*='greenstand_logo']");
  });

  it.only("ZoomIn", () => {
    cy.visit("http://localhost:3000");
    cy.contains(/\dK/, {timeout: 1000*30});
    //draw the map
    cy.get("#map-canvas")
      .then($mapCanvas => {
        const mapCanvas = $mapCanvas[0];
        expectRuntime(mapCanvas)
          .property("map")
          .defined()
          .property("getMarkers")
          .defined();
        const map = mapCanvas.map.getMap();
        map.setCenter({
          lat: -6.772665100606061,
          lng: 39.220384056645706,
        });
        map.setZoom(16);
      });
    cy.get("div[title=Tree]", {timeout: 1000*30});
    //draw the tree on the left of the screen
    cy.get("#map-canvas")
      .then($mapCanvas => {
        const map = $mapCanvas[0].map;
        map.addMarkerByPixel(300, 20, {
          id:1,
          last_name: "Ezra",
          first_name: "David",
        });
      });
    //click the point which is close to the left edge
    cy.get("#map-canvas")
      .then($mapCanvas => {
        const map = $mapCanvas[0].map;
        const marker = map.getMarkerByPointId()[1];
        expectRuntime(marker).defined();
        marker.triggerClick4Test();
      });
    cy.pause();
    cy.get("div[title='hide']")
      .click();
    cy.get("div[title='show']")
      .should("not.exist");
  });

  it("Loading", () => {
    cy.visit("http://localhost:3000");
    cy.contains(/\dK/, {timeout: 1000*30});
  });

  it("First query case", () => {
    cy.visit("http://localhost:3000/?userid=1");
    cy.contains(/\dK/, {timeout: 1000*30});
  });

  it("Arrow interaction", () => {
    cy.visit("http://localhost:3000");
    cy.contains(/\dK/, {timeout: 1000*30});

    cy.get("#map-canvas")
      .then($mapCanvas => {
        const map = $mapCanvas[0].map.getMap();
        map.setCenter({lat:0, lng:0});
        map.setZoom(10);
      });

    cy.get("#map-canvas")
      .then($mapCanvas => {
        const {hideArrow, showArrow} = $mapCanvas[0].app;
        expectRuntime(hideArrow).a(expectRuntime.any(Function));
        expectRuntime(showArrow).a(expectRuntime.any(Function));
        showArrow("north");
      });
    
    cy.get(".north");

    cy.get("#map-canvas")
      .then($mapCanvas => {
        const {hideArrow, showArrow} = $mapCanvas[0].app;
        expectRuntime(hideArrow).a(expectRuntime.any(Function));
        expectRuntime(showArrow).a(expectRuntime.any(Function));
        showArrow("east");
      });
    
    cy.get(".east");

    cy.get("#map-canvas")
      .then($mapCanvas => {
        const {hideArrow, showArrow} = $mapCanvas[0].app;
        expectRuntime(hideArrow).a(expectRuntime.any(Function));
        expectRuntime(showArrow).a(expectRuntime.any(Function));
        showArrow("south");
      });
    
    cy.get(".south");

    cy.get("#map-canvas")
      .then($mapCanvas => {
        const {hideArrow, showArrow} = $mapCanvas[0].app;
        expectRuntime(hideArrow).a(expectRuntime.any(Function));
        expectRuntime(showArrow).a(expectRuntime.any(Function));
        showArrow("west");
      });
    
    cy.get(".west");

    //open side panel
    cy.get("#map-canvas")
      .then($mapCanvas => {
        const {showPanel} = $mapCanvas[0].app;
        expectRuntime(showPanel).a(expectRuntime.any(Function));
        showPanel({
            id: 1,
            first_name: "Dadior",
            last_name: "Chen",
          });
      });
    
  });

});

