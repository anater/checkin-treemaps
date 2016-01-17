window.addEventListener("load", function(){

  var tree = {
      name: "tree",
      children: [
          { name: "JFK", size: 17, city: "New York" },
          { name: "SFO", size: 15, city: "San Francisco" },
          { name: "LGA", size: 8, city: "New York" },
          { name: "LGW", size: 5, city: "London" },
          { name: "DEN", size: 5, city: "Denver" }
      ]
  };

  var width = 500,
      height = 500,
      color = d3.scale.category20c(),
      div = d3.select("body").append("div")
         .style("position", "relative");
  
  var treemap = d3.layout.treemap()
      .size([width, height])
      .value(function(d) { return d.size; });
  
  var node = div.datum(tree).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background-image", function (d) { 
          return "url(img/" + d.name + ".jpg)";})
        .append('div')
        .style("font-size", function(d) {
            // compute font size based on sqrt(area)
            return Math.max(20, 0.18*Math.sqrt(d.area))+'px'; })
        .text(function(d) { return d.children ? null : d.name; })
        .append('span')
        .attr("class", "city")
        .text(function(d){ return d.children ? null : d.city; });

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }

});