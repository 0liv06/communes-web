function MapControl(targetId, markerList) {

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
