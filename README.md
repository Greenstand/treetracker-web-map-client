# Treetracker Web

## Current Milestones and Issue Topics

Developers please see current milestones here:  
https://github.com/Greenstand/treetracker-web-map/milestones


Big picture UX/UI challenges are tracked at:  
https://github.com/Greenstand/treetracker-web-map/issues?q=is%3Aissue+is%3Aopen+label%3AUX%2FUI

&nbsp;
&nbsp;

## Project Description

Displays location and details of all trees that have been tracked.

Live map is at [www.treetracker.org](https://www.treetracker.org)

For more details see the [Tree Tracker Web Map Wiki] (https://github.com/Greenstand/treetracker-web-map-client/wiki)

&nbsp;
&nbsp;

## Development Environment Quick Start

### Using online DB (Recommended)

#### Frontend Only
1. Make sure all npm modules are installed for client.
```
npm i
```
2. Open .env from the project root.  It should contain only the following lines
```
REACT_APP_API=https://dev-k8s.treetracker.org/webmap/
```
3. Start the client
```
npm start
```
4. Open the web map in the browser with URL: http://localhost:3000

### How to test

We use Jest to build tests.

1. To test client
```
npm test
```

### Alternative development environment for MS Windows (Works on Linux and Mac also)
On Windows, the easiest way to develop and debug Node.js applications is using Visual Studio Code.
It comes with Node.js support out of the box.

https://code.visualstudio.com/docs

&nbsp;
&nbsp;


## Clustering Basics

For performance and UX purposes, since this map needs to deal with an enormous amount of trees, a clustering strategy is used to group those trees, showing information in a way that is more digestible for the end-user.

Although this feature is already implemented, performance optimizations are a work in progress.

### Overriding clustering and map initial zoom for testing

When there is a need to tweak the clusterization behavior, the **cluster radius** and **zoom** can be overridden specifying query strings.
For example, if you need to load the map with an initial zoom level of 15, and a radius of 0.001 you will access it like this:

dev.treetracker.org?**zoom=15&clusterRadius=0.001**

To find the correct value for the cluster radius in a given zoom level, play with some ranges between 0.1 and 0.00025. However, feel free to experiment however you like.

When these values are overridden, you can zoom and drag the map freely, while keeping the same clusterization behaviors.

Another useful tool to use in conjunction with this is the web browser's console (in Chrome or Firefox, hit F12 to open it). Whenever the map is updated, current zoom level and cluster radius used will be output to the console, so you have a better idea of what is going on.

Future: 
* Filters and Statistics
* View photo together with tree data
* View planter profile. 


