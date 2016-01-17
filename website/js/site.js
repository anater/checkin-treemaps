// Data
  var tree = {
      name: "tree",
      children: [
          { name: "JFK", size: 17, city: "New York", img: "" },
          { name: "SFO", size: 15, city: "San Francisco", img: "" },
          { name: "LGA", size: 8, city: "New York", img: "" },
          { name: "LGW", size: 5, city: "London", img: "" },
          { name: "DEN", size: 5, city: "Denver", img: "" }
      ]
  };

//Flickr
  var flickr = new Flickr({
    api_key: "128b500ab781a63272184b685ed06cd2"
  });

  function findPhoto(){
    this.style("background-image", function(d){
      flickr.photos.search({
        text: d.name,
        sort: "interestingness-desc"
      }, 
      function(err, result){
        if(err){ 
          throw new Error(err); 
        }
        else if(result){
          // set photo
          var photo = result.photos.photo[0];
          // generate photo url
          //var img = 

          return "url(" + createPhotoURL(photo.farm, photo.server, photo.id, photo.secret) + ")";
        }
      });
    });
  }

  function createPhotoURL(farmId, serverId, id, secret){
    // example url https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    var farmId = farmId,
        serverId = serverId,
        id = id,
        secret = secret,
        url = "https://farm"+farmId+".staticflickr.com/"+serverId+"/"+id+"_"+secret+".jpg";
    return url;
  }


window.addEventListener("load", function(){

  //Treemap
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
        .call(findPhoto)
        //.style("background-image", function(d) { 
        //  return "url(" + findPhoto(d.name, function(img){console.log(img)}) + ")" ;})
        .append('div')
        .style("font-size", function(d) {
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