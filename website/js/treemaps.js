window.addEventListener("load", function(){

  console.log("loaded");

  var tree = {
      name: "tree",
      children: [
          { name: "JFK", size: 17 },
          { name: "SFO", size: 15 },
          { name: "LGA", size: 8 },
          { name: "LGW", size: 5 },
          { name: "DEN", size: 5 }
      ]
  };

  var width = 500,
      height = 500,
      color = d3.scale.category20c(),
      div = d3.select("body").append("div")
         .style("position", "relative");
  
  var treemap = d3.layout.treemap()
      .size([width, height])
      .sticky(true)
      .value(function(d) { return d.size; });
  
  var node = div.datum(tree).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background-color", function(d) {
            return d.name == 'tree' ? '#fff' : color(d.parent.name); })
        .style("background-image", function (d) { 
          return "url(img/" + d.name + ".jpg)";})
        .append('div')
        .style("font-size", function(d) {
            // compute font size based on sqrt(area)
            return Math.max(20, 0.18*Math.sqrt(d.area))+'px'; })
        .text(function(d) { return d.children ? null : d.name; });

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }

});