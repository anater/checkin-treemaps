//Flickr
  var flickr = new Flickr({api_key: "128b500ab781a63272184b685ed06cd2"});

  function findPhoto(query){
    //console.log(query);
    return new Promise(function(resolve, reject) {
      flickr.photos.search(
        {
          text: query.name,
          sort: "relevance",
          per_page: 5
        }, 
        function(err, result){
          if(err){ 
            reject(Error(err)); 
          }
          var max = result.photos.photo.length;
          var random = Math.floor(Math.random() * max - 1) + 1;
          // set photo
          var photo = result.photos.photo[random];
          // generate photo url
          var img = createPhotoURL(photo.farm, photo.server, photo.id, photo.secret);
          var id = query.id.toString();

          resolve({img, id});
        }
      );
    })
  }

  function createPhotoURL(farmId, serverId, id, secret){
    // example url https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    var farmId = farmId,
        serverId = serverId,
        id = id,
        secret = secret,
        url = "https://farm"+farmId+".staticflickr.com/"+serverId+"/"+id+"_"+secret+"_z.jpg";
    return url;
  }


window.addEventListener("load", function(){

  var source = "https://api.foursquare.com/v2/users/self/venuehistory?oauth_token=KPOJ0YEPENUST3BFX0WNAXIC3TC1FTE5GUQRVXHTGPLXS1B3&v=20160118";

  d3.json(source, function(data) {
    var venues = data.response.venues.items;
    var venueTree = {
      name: 'tree',
      children: []
    };

    for (var i = 0; i < venues.length; i++) {
      var v = venues[i];
      venueTree.children[i]= {
        'id': v.venue.id,
        'size': v.beenHere, 
        'name': v.venue.name, 
        'lat': v.venue.location.lat, 
        'lon': v.venue.location.lat,
        'city': v.venue.location.city,
      }
      venueTree.children[i]['img'] = findPhoto(venueTree.children[i]).then(function(response){
        //console.log(response);
        var e = document.getElementById(response.id);
        var style = "background-image: url('"+response.img+"')";
        e.setAttribute('style', e.getAttribute('style')+style);
        //console.log(e);
      })
    };
    createTreemap(venueTree);
  });
 

  function createTreemap(source){
    //Treemap
    var width = 500,
        height = 500,
        color = d3.scale.category20c(),
        div = d3.select("body").append("div")
           .style("position", "relative");
    
    var treemap = d3.layout.treemap()
        .size([width, height])
        .value(function(d) { 
          return d.size; });
    
    var node = div.datum(source).selectAll(".node")
          .data(treemap.nodes)
          .enter().append("div")
          .attr("class", "node")
          .call(position)
          .attr("id", function(d){
            return d.id; })
          .append('div')
          .style("font-size", function(d) {
            return Math.max(20, 0.18*Math.sqrt(d.area))+'px'; })
          .text(function(d) { 
            return d.children ? null : d.name; })
          .append('span')
          .attr("class", "city")
          .text(function(d){ 
            return d.children ? null : d.city; });

    function position() {
      this.style("left", function(d) { return d.x + "px"; })
          .style("top", function(d) { return d.y + "px"; })
          .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
          .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
    }
  }
});