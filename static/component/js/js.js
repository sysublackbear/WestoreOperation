var filterScript = function(str){
    var text = document.createTextNode(str),
        parser = document.createElement("div"),
        value = "";
    parser.appendChild(text);
    value = parser.innerHTML;
    text = null; parser = null;
    return value;
}

var preEleList = document.getElementsByTagName('pre');
console.log(preEleList);
for(var i = 0; i < preEleList.length; i++){
	preEleList[i].innerHTML = filterScript(preEleList[i].innerHTML);
}


var parentNode = document.getElementById("myTab");
parentNode.onclick = function(e){
    e = e || event;
    var childArr = parentNode.children || parentNode.childNodes;
    for(var i = 0; i< childArr.length; i++){
        var childNode = childArr[i]
        if(childNode.tagName && childNode.tagName.toUpperCase() == "LI"){
            childNode.className = childNode.className.replace(/\s*active/g, "");
        }
    }
    var curNode = e.srcElement ? e.srcElement : e.target;
    if(curNode.tagName && curNode.tagName.toUpperCase() == "A"){
		var liNode = curNode.parentNode;
        liNode.className += " active";
    }
}
