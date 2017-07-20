function SearchControl(type, target) {
    
    this.searchType = type;
    this.searchTarget = target;
    
}

function performSearch(urlString, callback, params) {

    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var obj = JSON.parse(xhttp.responseText);
            
            if(callback){
                
                callback(obj, params);
            
            } else {
                    
                return res;
            }
        }
    };
    
    xhttp.open("GET", urlString , true);
    xhttp.send();    
    
}

SearchControl.prototype.searchForType = function(term, type, callback, params) { 
    
    performSearch(this.searchTarget + 'search/' + term + '/' + type, callback, params);
}

SearchControl.prototype.search = function(term, callback, params) {
    
    this.searchForType(term, this.searchType, callback, params);
}

SearchControl.prototype.geoHashSearch = function(coordinates, callback, params) {
    
    performSearch( encodeURI(this.searchTarget + 'geohashsearch/' 
                                        + coordinates.coords[0][1] + '/'
                                        + coordinates.coords[0][0] + '/'
                                        + coordinates.coords[1][1] + '/'
                                        + coordinates.coords[1][0] + '/'
                                        + coordinates.zoom)
                , callback, params);
}