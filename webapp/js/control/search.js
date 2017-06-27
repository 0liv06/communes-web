function SearchControl(type, target) {
    
    this.searchType = type;
    this.searchTarget = target;
    
}

SearchControl.prototype.searchForType = function(term, type, callback, params) {
    
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var obj = JSON.parse(xhttp.responseText);

            callback(obj, params);
        }
    };
    
    xhttp.open("GET", this.searchTarget + term + '/' + type , true);
    xhttp.send();    
}

SearchControl.prototype.search = function(term, callback, params) {
    
    this.searchForType(term, this.searchType, callback, params);
}