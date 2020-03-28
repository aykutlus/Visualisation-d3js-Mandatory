# Spain COVID-19 Visualisation

In below map, infected cases are shown by circles. With button, it can be seen evaluation of confirmed cases in Spain. 

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/35189163/77831237-464b5d80-712e-11ea-98e7-eb0d4a4af995.gif)


# Installation

==> Run npm install on your visual studio to insall 

# Visualisation

==> Run npm start to see the map

# Explanation

Calculation of radius' circles                                                                                                 
```
const calculateRadiusBasedOnAffectedCases = (comunidad: string, data: Numbers[]) => {
  const entry = data.find(item => item.name === comunidad);

  /*const maxAffected = data.reduce(
    (max, item) => (item.value > max ? item.value : max),
    0
  );*/

  const affectedRadiusScale = d3
    .scaleLinear()
    .domain([0, 9000])
    .range([5, 40]); // 50 pixel max radius, we could calculate it relative to width and height

  return entry ? affectedRadiusScale(entry.value) : 0;
};
```
MaxAffecfed case could be calculated and put it to the domain scale but in this case I preferred giving its value by hand.


Update circles 
```
const updateCircles = (data: Numbers[]) => {
  const circles = svg.selectAll("circle");
  circles
    .data(latLongCommunities)
    .merge(circles as any)
    .transition()
    .duration(500)
    .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, data))
};
```

Application of update circle
```
document
  .getElementById("Initial date")
  .addEventListener("click", function handleResultsInitial() {
    updateCircles(initial)
  });

document
  .getElementById("Now")
  .addEventListener("click", function handleResultsNow() {
    updateCircles(now)
  });
  ```
 



