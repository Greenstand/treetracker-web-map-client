import expectRuntime from "expect-runtime";
import * as mapTools from "../../src/mapTools";
const scale = 1;



describe("Main", () => {
  
  before(() => {
    cy.viewport(1440, 754);
  });

  it("basic", () => {
    cy.intercept(/2\/2\/1\.png$/, {fixture: "tile/2-2-1.png"});
    cy.intercept(/2\/2\/1\.grid.json$/, {fixture: "tile/2-2-1.grid.json"})
      .as("level2");
    cy.intercept(/4\/8\/8\.png$/, {fixture: "tile/4-8-8.png"});
    cy.intercept(/4\/8\/8\.grid.json$/, {fixture: "tile/4-8-8.grid.json"})
      .as("level4");
    cy.intercept(/6\/34\/34\.png$/, {fixture: "tile/6-34-34.png"});
    cy.intercept(/6\/34\/34\.grid.json$/, {fixture: "tile/6-34-34.grid.json"})
      .as("level6");
    cy.intercept(/8\/139\/139\.png$/, {fixture: "tile/8-139-139.png"});
    cy.intercept(/8\/139\/139\.grid.json$/, {fixture: "tile/8-139-139.grid.json"})
      .as("level8");
    cy.intercept(/\d+\/\d+\/\d+\.png$/, {fixture: "tile/blank.png"});
    cy.intercept(/\d+\/\d+\/\d+\.grid.json$/, {fixture: "tile/blank.grid.json"});
    cy.visit("http://localhost:3000");
    cy.wait("@level2", {timeout:1000*30});
    cy.get("#map-canvas").trigger("click", 771,420);
    cy.wait("@level4", {timeout: 1000*30});
    cy.get("#map-canvas").trigger("click", 523,448);
    cy.wait("@level6", {timeout: 1000*30});
    cy.get("#map-canvas").trigger("click", 636,526);
    cy.wait("@level8", {timeout: 1000*30});
    cy.get("#map-canvas").trigger("click", 636,526);

    

  });

  it.skip("userid=1", () => {
    cy.intercept(/2\/2\/1\.png$/, {fixture: "tile/2-2-1.png"});
    cy.intercept(/2\/2\/1\.grid.json$/, {fixture: "tile/2-2-1.grid.json"});
    cy.intercept(/\d+\/\d+\/\d+\.png$/, {fixture: "tile/blank.png"});
    cy.intercept(/\d+\/\d+\/\d+\.grid.json$/, {fixture: "tile/blank.grid.json"});
    cy.intercept(/clusterRadius=0.05&zoom_level=10&userid=1$/, {
      fixture: "tile/zoom_level=10&userid=1"
    });
    cy.visit("http://localhost:3000/?userid=1");
  });
});

describe("Spin case", () => {

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

  it("load", () => {
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

describe("Web Map", () => {
  
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

  it("ZoomIn", () => {
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

describe.only("three words", () => {
  const treeSummary = 
      {
        "type": "point",
        "id": 1,
        "lat": "8.376115",
        "lon": "-13.126036666666668"
      };

  const treeInfo = {
      "id": 1,
      "time_created": "2021-01-12T11:31:53.000Z",
      "time_updated": "2021-01-12T11:31:53.000Z",
      "missing": false,
      "priority": false,
      "cause_of_death_id": null,
      "planter_id": 3356,
      "primary_location_id": null,
      "settings_id": null,
      "override_settings_id": null,
      "dead": 0,
      "photo_id": null,
      "image_url": "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2021.01.12.13.32.44_8.376115_-13.126036666666668_59d4eee2-20d3-4498-b071-80fafaa96d68_IMG_20210112_113147_1548552425882643025.jpg",
      "certificate_id": null,
      "estimated_geometric_location": "0101000020E610000042DCC2E087402AC0F111312592C02040",
      "lat": "8.376115",
      "lon": "-13.126036666666668",
      "gps_accuracy": null,
      "active": true,
      "planter_photo_url": "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2021.01.12.13.24.46_8.378525_-13.127123333333335_9989f325-c5af-4a32-91a8-054bc3996267_IMG_20210112_093119_6316728530127104360.jpg",
      "planter_identifier": "076995843",
      "device_id": null,
      "sequence": null,
      "note": "2",
      "verified": false,
      "uuid": "194ca958-9e18-4f6a-b427-5f9a3a995e7c",
      "approved": true,
      "status": "planted",
      "cluster_regions_assigned": true,
      "species_id": null,
      "planting_organization_id": 178,
      "payment_id": null,
      "contract_id": null,
      "token_issued": false,
      "morphology": "seedling",
      "age": "new_tree",
      "species": null,
      "capture_approval_tag": "simple_leaf",
      "rejection_reason": null,
      "matching_hash": null,
      "device_identifier": "413497f62d8b9467",
      "images": null,
      "domain_specific_data": null,
      "token_id": null,
      "species_name": null,
      "first_name": "Anonymoust",
      "last_name": "Planter",
      "user_image_url": null,
      "token_uuid": null,
      "wallet": null,
      "attributes": {},
      "name": "one_two_three",
    }

  it.skip("case: treeid=1", () => {
    //https://dev-k8s.treetracker.org/webmap/trees?clusterRadius=0.05&zoom_level=10&treeid=766857
    cy.intercept(/.*\/trees\?.*treeid=1/, {
      data: [
        treeSummary
    ]});

    cy.intercept(/.*\/tree\?tree_id=1/, treeInfo);
    cy.visit("http://localhost:3000/?treeid=1");
    cy.contains("#1");
  });

  it("case: tree_name=1_2_3", () => {
    cy.intercept(/.*\/tree\?(tree_name=one_two_three|tree_id=1)/, treeInfo);

    cy.visit("http://localhost:3000/?tree_name=one_two_three");
    cy.contains("one_two_three");
  });

});
