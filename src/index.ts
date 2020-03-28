import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { initial,now,Numbers } from "./stats";
 

const calculateRadiusBasedOnAffectedCases = (comunidad: string,data: Numbers[]) => {
  const entry = data.find(item => item.name === comunidad);

  /*const maxAffected = data.reduce(
    (max, item) => (item.value > max ? item.value : max),
    0
  );*/

  const affectedRadiusScale = d3
  .scaleLinear()
  .domain([0, 10000])
  .range([5, 40]); // 50 pixel max radius, we could calculate it relative to width and height

  return entry ? affectedRadiusScale(entry.value) : 0;
};

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

const aProjection = d3Composite
  .geoConicConformalSpain()
  // Let's make the map bigger to fit in our resolution
  .scale(3300)
  // Let's center the map
  .translate([500, 400]);

const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);

svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "country")
  // data loaded from json file
  .attr("d", geoPath as any);

svg
  .selectAll("circle")
  .data(latLongCommunities)
  .enter()
  .append("circle")
  .attr("class", "affected-marker")
  .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name,initial))
  .attr("cx", d => aProjection([d.long, d.lat])[0])
  .attr("cy", d => aProjection([d.long, d.lat])[1]);


  //update buttons
const updateCircles = (data: Numbers[]) => {
    const circles = svg.selectAll("circle");
    circles
      .data(latLongCommunities)
      .merge(circles as any)
      .transition()
      .duration(500)
      .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, data));
  };

document
  .getElementById("Now")
  .addEventListener("click", function handleResultsNow() {
    updateCircles(now);
  });

document
  .getElementById("Initial date")
  .addEventListener("click", function handleResultsInitial() {
    updateCircles(initial);
  });


