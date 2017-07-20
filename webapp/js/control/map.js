function MapControl(targetId, markerList, searchControl) {
    var self = this;
    
    this.markers = markerList;

    this.markerVectorSource = new ol.source.Vector({
        features: this.markers //add an array of features
    });


    this.markerVectorLayer = new ol.layer.Vector({
        source: this.markerVectorSource
    });    


    this.map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          this.markerVectorLayer
        ],
        target: targetId,
        controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions}*/  ({
            collapsible: true
          })
        }),
        view: new ol.View({
          center: [0, 0],
          zoom: 2
        })
    });
    
    
    function addAllDecoded(hash) {
                
        var res = [];
                
        for(var i = 0; i<hash.length;i++){
            res.push(Geohash.decode(hash[i]));
        }

        self.addAllWithProps(res, 'lat', 'lon');
    }
    
    this.map.on('moveend', function(){
        
        var viewBoxCoordinates = this.getTopLeftBottomRightCoordinates();
        var mapZoom = this.getZoom();
        
        searchControl.geoHashSearch({coords : viewBoxCoordinates, zoom :mapZoom }, addAllDecoded);
        
    },this);
}

MapControl.prototype.getBoundingBox = function() {
    
    var view = this.map.getView();
    
    return view.calculateExtent(this.map.getSize());
}

MapControl.prototype.getTopLeftBottomRightCoordinates = function () {
    var botRight =  ol.extent.getBottomRight(this.getBoundingBox());
    var topLeft = ol.extent.getTopLeft(this.getBoundingBox());
    
    var pointBotRight         = new ol.geom.Point(ol.proj.transform([ botRight[1] , botRight[0] ], 'EPSG:3857', 'EPSG:4326' ));
    var pointTopLeft          = new ol.geom.Point(ol.proj.transform([ topLeft[1] , topLeft[0] ], 'EPSG:3857', 'EPSG:4326' ));
    
    return [pointBotRight.getCoordinates(), pointTopLeft.getCoordinates()];
}

MapControl.prototype.getRawCenterView = function() {
    
    var view = this.map.getView();
    
    return view.getCenter();
}

MapControl.prototype.getCenterViewForSRID = function(srid) {
    
    var rawCenterView = this.getRawCenterView();
    var point         = new ol.geom.Point(ol.proj.transform([ rawCenterView[1] , rawCenterView[0]  ], 'EPSG:3857', 'EPSG:' + srid ));
    
    return point;
}

MapControl.prototype.getDistanceFromCenter = function() {
    
    var centerPoint     = this.getCenterViewForSRID(4326);
    var topRightExtent  = ol.extent.getTopRight(this.getBoundingBox());
    var topRightPoint   = new ol.geom.Point(ol.proj.transform([ topRightExtent[1] , topRightExtent[0]  ], 'EPSG:3857', 'EPSG:4326'));
    
    return ol.sphere.WGS84.haversineDistance(centerPoint.getExtent(), topRightPoint.getExtent()) ;
    
}

MapControl.prototype.addAll = function(locations) {
    
    this.markerVectorSource.clear();
    
    for (var i = 0; i < locations.length; i++) {

        var point = new ol.geom.Point(ol.proj.transform([ parseFloat(locations[i].lng),parseFloat(locations[i].lat) ], 'EPSG:4326', 'EPSG:3857'));

        var iconFeature = new ol.Feature({
          geometry: point,
          name: locations[i].name
        });

        this.markerVectorSource.addFeature(iconFeature);
    }
}

MapControl.prototype.addAllWithProps = function(locations, propertyLat, propertyLng) {
    
    this.markerVectorSource.clear();
    
    for (var i = 0; i < locations.length; i++) {

        var point = new ol.geom.Point(ol.proj.transform([ parseFloat(locations[i][propertyLng]),parseFloat(locations[i][propertyLat]) ], 'EPSG:4326', 'EPSG:3857'));

        var iconFeature = new ol.Feature({
          geometry: point,
          name: locations[i].name
        });

        this.markerVectorSource.addFeature(iconFeature);
    }
}

MapControl.prototype.getZoom = function() {
    return this.map.getView().getZoom();
} 