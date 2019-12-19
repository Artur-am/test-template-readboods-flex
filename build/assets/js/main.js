let resize = [];

function ClearElement(el){
	if (el.lastChild){
		while (el.hasChildNodes()){
			el.removeChild(el.lastChild);
		}
	}
}
function CreateElement(data) {
    let tag = document.createElement(data.tag);
    if ("class" in data) {
        tag.classList.add(data.class);
    }
    if ("attribute" in data) {
        for (let att in data.attribute) {
            tag.setAttribute(att, data.attribute[att]);
        }
    }
    if ("content" in data) {
        tag.innerText = data.content;
    }
    return tag;
}

function HTMLRender(element, data) {
    function render(el, data) {
        let item = null;
        for (let d of data.el) {
            item = CreateElement(d);
            el.appendChild(item);

            if ("event" in d) {
                for(let event in d.event){
                    item.addEventListener(event, d.event[event]);
                }
            }
            
            if (d.el && d.el[0]) {
                render(item, d);
            }
        }
    }
    let creat = function(obj){
        let parent = CreateElement(obj);
        render(parent, obj);
        element.appendChild(parent);
        return parent;
    };
    let el = null;
    if(Array.isArray(data)){
        for(let item of data){
            el.push(creat(item.el));
        }
    }else{
        el = creat(data.el);
    }

    return el;
}
function getCSSProperty(el, property){
    let res = 0;

    if(el.style[property]){
        res = el.style[property];
    }else{
        res = getComputedStyle(el)[property];
    }
    res = +( res.replace(/[^\d]/g, '') );

    return isNaN(res) ? 0 : res;
}
function LoadFile(attribute, tag, status = false){
    if(!status){
        return HTMLRender(document.body, {
            "el" : {
                "tag" : tag,
                "attribute" : attribute,
                "el" : []
            }
        });
    }
}

(function( items ){
    if( 0 == items.length ){ /* ... */ return null;}

    function Carousel(carousel){
    
        let carouselBody = carousel.getElementsByClassName('carousel-body')[0];
        let items = carouselBody.children;
    
        let itemInfo = ( items[0].clientWidth + getCSSProperty( items[0], "marginRight" ) );
    
        let classNameNavItemActive = "active";
        let scrollN = 1;
    
        let scroll_start = 0;
        let scroll_end = ~~( carouselBody.clientWidth / itemInfo );
        let previousId = 0;
    
        function Clicked( ev, el ){
    
            let id = 0;
            for( let item of carousel.querySelectorAll(".carousel-nav > ul > li") ){
                if(el == item){
                    break;
                }
                id++;
            }
    
            scroll_start = id;
    
            if(previousId > id){
                scroll_end -= previousId - id;
            }else{
                scroll_end += ( id - previousId);
            }
            
            Update();
            previousId = id;
        }
    
        function Update(){
            let n = 0;
    
            for( let item of items ){
                if(
                    (scroll_start > n) ||
                    ((scroll_end - 1) < n)
                ){
                    item.classList.add('hidden');
                }else{
                    item.classList.remove('hidden');
                }
                n++;
            }
    
            let removeClassName = carousel.querySelectorAll('.carousel-nav-circle.' + classNameNavItemActive)[0];
    
            if(removeClassName){
                removeClassName.classList.remove(classNameNavItemActive);
            }
            carousel.querySelectorAll('.carousel-nav-circle')[scroll_start].classList.add(classNameNavItemActive);
        }
    
        function CreateNav(){
    
            let hiddenCount = items.length - scroll_end;
    
            let navItems = carousel.getElementsByClassName("carousel-nav")[0];
    
            let navItem = function(){
                return {
                    "tag" : "li",
                    "attribute" : {
                        "class" : 'carousel-nav-circle'
                    },
                    "content" : "",
                    "event" : {
                        "click" : function(ev){ Clicked(ev, this) }
                    }
                };
            };
            let data = {
                "el" : {
                    "tag" : "ul",
                    "el" : []
                }
            };
    
            for(let n = 0, count = hiddenCount / scrollN; n <= count; n++){
    
                data.el.el.push( navItem() );
    
            }
    
            if(navItems.children.length > 0){
                ClearElement(navItems);
            }
    
            HTMLRender(navItems, data);
    
            Update();
        }
    
        function Media(){
            scroll_start = 0;
            previousId = scroll_start;
            scroll_end = ~~( carouselBody.clientWidth / itemInfo );
    
            CreateNav();
        }
    
        CreateNav();
    
        resize.push({
            "fun" : function(){ Media(); }
        });
    }

    for(let item of items){
        Carousel(item);
    }

}( Array.from( document.getElementsByClassName("carousel") ) ) );

(function( map ){
    if( !(map instanceof HTMLElement) ){ /* ... */ return null;}

        function MapLayers(){
        	let mapbox = function(id){
        		return L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
        			"id" : id,
        			"attribution" : 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,' +
        							'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        							'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        		});
        	};
        
        	return {
        		"openstreetmap" : L.tileLayer(
        			"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        			{
        				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        			}
        		),
        		"mapbox.streets" : mapbox("mapbox.streets"),
        		"mapbox.light" : mapbox("mapbox.light")
        	};
        }
        
        function MapMarker(){
        	return [
        		{
        			"latLng" : [ 50.5251027, 30.3488003 ],
        			"text" : "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa."
        		}
        	]
        }
        
        function AddMarker(map){
        	let markers = MapMarker();
        
        	for(marker of markers){
        		L.marker(marker.latLng).addTo(map)
                	.bindPopup(marker.text);
        	}
        }
        
        function Leaflet(latlng){
        	let mapLayers = new MapLayers();
        	let defaultMap = "mapbox.streets";
        
        	let map = L.map('map', {
        		center: latlng,
        		zoom: 10,
        		layers: mapLayers[defaultMap]
        	});
        
        	AddMarker(map);
        	
        	L.control.layers(mapLayers).addTo(map);
        }
        
        function Contacts(){
        	let latlng = [50.5251027, 30.3488003];
            Leaflet(latlng);
        }

        let leafletjs = LoadFile({
            "src" : "https://unpkg.com/leaflet@1.5.1/dist/leaflet.js",
            "integrity" : "sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og==",
            "crossorigin" : "",
            "async": false
        },
        "script"
    );

    let leafletcss = LoadFile({
        "rel" : "stylesheet",
        "href" : "https://unpkg.com/leaflet@1.5.1/dist/leaflet.css",
        "integrity" : "sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==",
        "crossorigin" : ""
        },
        "link"
    );
    
    leafletjs.addEventListener("load", Contacts);

    leafletjs.addEventListener("onerror ", function(){
        leafletjs = LoadFile({
                "src" : "./assets/lib/leafletjs-1.5.1/leafletjs.js"
            },
            "script"
        );
        leafletjs.addEventListener("load", Contacts);
    });

    leafletcss.addEventListener("onerror ", function(){
        LoadFile({
                "rel" : "stylesheet",
                "href" : "./assets/lib/leafletjs-1.5.1/leafletjs.css"
            },
            "link"
        );
    });

}( document.getElementById("map") ));

function WindowResize(ev){
    for(let collback of resize){
        collback.fun();
    }
}

window.addEventListener("resize", WindowResize);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCByZXNpemUgPSBbXTtcclxuXHJcbmZ1bmN0aW9uIENsZWFyRWxlbWVudChlbCl7XHJcblx0aWYgKGVsLmxhc3RDaGlsZCl7XHJcblx0XHR3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKXtcclxuXHRcdFx0ZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gQ3JlYXRlRWxlbWVudChkYXRhKSB7XHJcbiAgICBsZXQgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkYXRhLnRhZyk7XHJcbiAgICBpZiAoXCJjbGFzc1wiIGluIGRhdGEpIHtcclxuICAgICAgICB0YWcuY2xhc3NMaXN0LmFkZChkYXRhLmNsYXNzKTtcclxuICAgIH1cclxuICAgIGlmIChcImF0dHJpYnV0ZVwiIGluIGRhdGEpIHtcclxuICAgICAgICBmb3IgKGxldCBhdHQgaW4gZGF0YS5hdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgdGFnLnNldEF0dHJpYnV0ZShhdHQsIGRhdGEuYXR0cmlidXRlW2F0dF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChcImNvbnRlbnRcIiBpbiBkYXRhKSB7XHJcbiAgICAgICAgdGFnLmlubmVyVGV4dCA9IGRhdGEuY29udGVudDtcclxuICAgIH1cclxuICAgIHJldHVybiB0YWc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEhUTUxSZW5kZXIoZWxlbWVudCwgZGF0YSkge1xyXG4gICAgZnVuY3Rpb24gcmVuZGVyKGVsLCBkYXRhKSB7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBudWxsO1xyXG4gICAgICAgIGZvciAobGV0IGQgb2YgZGF0YS5lbCkge1xyXG4gICAgICAgICAgICBpdGVtID0gQ3JlYXRlRWxlbWVudChkKTtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoXCJldmVudFwiIGluIGQpIHtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgZXZlbnQgaW4gZC5ldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBkLmV2ZW50W2V2ZW50XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChkLmVsICYmIGQuZWxbMF0pIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlcihpdGVtLCBkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBjcmVhdCA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICAgICAgbGV0IHBhcmVudCA9IENyZWF0ZUVsZW1lbnQob2JqKTtcclxuICAgICAgICByZW5kZXIocGFyZW50LCBvYmopO1xyXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQocGFyZW50KTtcclxuICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgfTtcclxuICAgIGxldCBlbCA9IG51bGw7XHJcbiAgICBpZihBcnJheS5pc0FycmF5KGRhdGEpKXtcclxuICAgICAgICBmb3IobGV0IGl0ZW0gb2YgZGF0YSl7XHJcbiAgICAgICAgICAgIGVsLnB1c2goY3JlYXQoaXRlbS5lbCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICAgIGVsID0gY3JlYXQoZGF0YS5lbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVsO1xyXG59XHJcbmZ1bmN0aW9uIGdldENTU1Byb3BlcnR5KGVsLCBwcm9wZXJ0eSl7XHJcbiAgICBsZXQgcmVzID0gMDtcclxuXHJcbiAgICBpZihlbC5zdHlsZVtwcm9wZXJ0eV0pe1xyXG4gICAgICAgIHJlcyA9IGVsLnN0eWxlW3Byb3BlcnR5XTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJlcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpW3Byb3BlcnR5XTtcclxuICAgIH1cclxuICAgIHJlcyA9ICsoIHJlcy5yZXBsYWNlKC9bXlxcZF0vZywgJycpICk7XHJcblxyXG4gICAgcmV0dXJuIGlzTmFOKHJlcykgPyAwIDogcmVzO1xyXG59XHJcbmZ1bmN0aW9uIExvYWRGaWxlKGF0dHJpYnV0ZSwgdGFnLCBzdGF0dXMgPSBmYWxzZSl7XHJcbiAgICBpZighc3RhdHVzKXtcclxuICAgICAgICByZXR1cm4gSFRNTFJlbmRlcihkb2N1bWVudC5ib2R5LCB7XHJcbiAgICAgICAgICAgIFwiZWxcIiA6IHtcclxuICAgICAgICAgICAgICAgIFwidGFnXCIgOiB0YWcsXHJcbiAgICAgICAgICAgICAgICBcImF0dHJpYnV0ZVwiIDogYXR0cmlidXRlLFxyXG4gICAgICAgICAgICAgICAgXCJlbFwiIDogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG4oZnVuY3Rpb24oIGl0ZW1zICl7XHJcbiAgICBpZiggMCA9PSBpdGVtcy5sZW5ndGggKXsgLyogLi4uICovIHJldHVybiBudWxsO31cclxuXHJcbiAgICBmdW5jdGlvbiBDYXJvdXNlbChjYXJvdXNlbCl7XHJcbiAgICBcclxuICAgICAgICBsZXQgY2Fyb3VzZWxCb2R5ID0gY2Fyb3VzZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2Fyb3VzZWwtYm9keScpWzBdO1xyXG4gICAgICAgIGxldCBpdGVtcyA9IGNhcm91c2VsQm9keS5jaGlsZHJlbjtcclxuICAgIFxyXG4gICAgICAgIGxldCBpdGVtSW5mbyA9ICggaXRlbXNbMF0uY2xpZW50V2lkdGggKyBnZXRDU1NQcm9wZXJ0eSggaXRlbXNbMF0sIFwibWFyZ2luUmlnaHRcIiApICk7XHJcbiAgICBcclxuICAgICAgICBsZXQgY2xhc3NOYW1lTmF2SXRlbUFjdGl2ZSA9IFwiYWN0aXZlXCI7XHJcbiAgICAgICAgbGV0IHNjcm9sbE4gPSAxO1xyXG4gICAgXHJcbiAgICAgICAgbGV0IHNjcm9sbF9zdGFydCA9IDA7XHJcbiAgICAgICAgbGV0IHNjcm9sbF9lbmQgPSB+figgY2Fyb3VzZWxCb2R5LmNsaWVudFdpZHRoIC8gaXRlbUluZm8gKTtcclxuICAgICAgICBsZXQgcHJldmlvdXNJZCA9IDA7XHJcbiAgICBcclxuICAgICAgICBmdW5jdGlvbiBDbGlja2VkKCBldiwgZWwgKXtcclxuICAgIFxyXG4gICAgICAgICAgICBsZXQgaWQgPSAwO1xyXG4gICAgICAgICAgICBmb3IoIGxldCBpdGVtIG9mIGNhcm91c2VsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2Fyb3VzZWwtbmF2ID4gdWwgPiBsaVwiKSApe1xyXG4gICAgICAgICAgICAgICAgaWYoZWwgPT0gaXRlbSl7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgc2Nyb2xsX3N0YXJ0ID0gaWQ7XHJcbiAgICBcclxuICAgICAgICAgICAgaWYocHJldmlvdXNJZCA+IGlkKXtcclxuICAgICAgICAgICAgICAgIHNjcm9sbF9lbmQgLT0gcHJldmlvdXNJZCAtIGlkO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHNjcm9sbF9lbmQgKz0gKCBpZCAtIHByZXZpb3VzSWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICAgICAgcHJldmlvdXNJZCA9IGlkO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIFVwZGF0ZSgpe1xyXG4gICAgICAgICAgICBsZXQgbiA9IDA7XHJcbiAgICBcclxuICAgICAgICAgICAgZm9yKCBsZXQgaXRlbSBvZiBpdGVtcyApe1xyXG4gICAgICAgICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgICAgICAgICAgKHNjcm9sbF9zdGFydCA+IG4pIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKChzY3JvbGxfZW5kIC0gMSkgPCBuKVxyXG4gICAgICAgICAgICAgICAgKXtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG4rKztcclxuICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIGxldCByZW1vdmVDbGFzc05hbWUgPSBjYXJvdXNlbC5xdWVyeVNlbGVjdG9yQWxsKCcuY2Fyb3VzZWwtbmF2LWNpcmNsZS4nICsgY2xhc3NOYW1lTmF2SXRlbUFjdGl2ZSlbMF07XHJcbiAgICBcclxuICAgICAgICAgICAgaWYocmVtb3ZlQ2xhc3NOYW1lKXtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzTmFtZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZU5hdkl0ZW1BY3RpdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhcm91c2VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJvdXNlbC1uYXYtY2lyY2xlJylbc2Nyb2xsX3N0YXJ0XS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZU5hdkl0ZW1BY3RpdmUpO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIENyZWF0ZU5hdigpe1xyXG4gICAgXHJcbiAgICAgICAgICAgIGxldCBoaWRkZW5Db3VudCA9IGl0ZW1zLmxlbmd0aCAtIHNjcm9sbF9lbmQ7XHJcbiAgICBcclxuICAgICAgICAgICAgbGV0IG5hdkl0ZW1zID0gY2Fyb3VzZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcm91c2VsLW5hdlwiKVswXTtcclxuICAgIFxyXG4gICAgICAgICAgICBsZXQgbmF2SXRlbSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIFwidGFnXCIgOiBcImxpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhdHRyaWJ1dGVcIiA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiIDogJ2Nhcm91c2VsLW5hdi1jaXJjbGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBcImNvbnRlbnRcIiA6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJldmVudFwiIDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsaWNrXCIgOiBmdW5jdGlvbihldil7IENsaWNrZWQoZXYsIHRoaXMpIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIFwiZWxcIiA6IHtcclxuICAgICAgICAgICAgICAgICAgICBcInRhZ1wiIDogXCJ1bFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZWxcIiA6IFtdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICBcclxuICAgICAgICAgICAgZm9yKGxldCBuID0gMCwgY291bnQgPSBoaWRkZW5Db3VudCAvIHNjcm9sbE47IG4gPD0gY291bnQ7IG4rKyl7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGRhdGEuZWwuZWwucHVzaCggbmF2SXRlbSgpICk7XHJcbiAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIGlmKG5hdkl0ZW1zLmNoaWxkcmVuLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgQ2xlYXJFbGVtZW50KG5hdkl0ZW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIEhUTUxSZW5kZXIobmF2SXRlbXMsIGRhdGEpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIE1lZGlhKCl7XHJcbiAgICAgICAgICAgIHNjcm9sbF9zdGFydCA9IDA7XHJcbiAgICAgICAgICAgIHByZXZpb3VzSWQgPSBzY3JvbGxfc3RhcnQ7XHJcbiAgICAgICAgICAgIHNjcm9sbF9lbmQgPSB+figgY2Fyb3VzZWxCb2R5LmNsaWVudFdpZHRoIC8gaXRlbUluZm8gKTtcclxuICAgIFxyXG4gICAgICAgICAgICBDcmVhdGVOYXYoKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBDcmVhdGVOYXYoKTtcclxuICAgIFxyXG4gICAgICAgIHJlc2l6ZS5wdXNoKHtcclxuICAgICAgICAgICAgXCJmdW5cIiA6IGZ1bmN0aW9uKCl7IE1lZGlhKCk7IH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IobGV0IGl0ZW0gb2YgaXRlbXMpe1xyXG4gICAgICAgIENhcm91c2VsKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxufSggQXJyYXkuZnJvbSggZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcm91c2VsXCIpICkgKSApO1xyXG5cclxuKGZ1bmN0aW9uKCBtYXAgKXtcclxuICAgIGlmKCAhKG1hcCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSApeyAvKiAuLi4gKi8gcmV0dXJuIG51bGw7fVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBNYXBMYXllcnMoKXtcclxuICAgICAgICBcdGxldCBtYXBib3ggPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgXHRcdHJldHVybiBMLnRpbGVMYXllcihcImh0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQve2lkfS97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYldGd1ltOTRJaXdpWVNJNkltTnBlalk0TlhWeWNUQTJlbVl5Y1hCbmRIUnFjbVozTjNnaWZRLnJKY0ZJRzIxNEFyaUlTTGJCNkI1YXdcIiwge1xyXG4gICAgICAgIFx0XHRcdFwiaWRcIiA6IGlkLFxyXG4gICAgICAgIFx0XHRcdFwiYXR0cmlidXRpb25cIiA6ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywnICtcclxuICAgICAgICBcdFx0XHRcdFx0XHRcdCc8YSBocmVmPVwiaHR0cHM6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4sICcgK1xyXG4gICAgICAgIFx0XHRcdFx0XHRcdFx0J0ltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vXCI+TWFwYm94PC9hPidcclxuICAgICAgICBcdFx0fSk7XHJcbiAgICAgICAgXHR9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIFx0cmV0dXJuIHtcclxuICAgICAgICBcdFx0XCJvcGVuc3RyZWV0bWFwXCIgOiBMLnRpbGVMYXllcihcclxuICAgICAgICBcdFx0XHRcImh0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nXCIsXHJcbiAgICAgICAgXHRcdFx0e1xyXG4gICAgICAgIFx0XHRcdFx0YXR0cmlidXRpb246ICcmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycydcclxuICAgICAgICBcdFx0XHR9XHJcbiAgICAgICAgXHRcdCksXHJcbiAgICAgICAgXHRcdFwibWFwYm94LnN0cmVldHNcIiA6IG1hcGJveChcIm1hcGJveC5zdHJlZXRzXCIpLFxyXG4gICAgICAgIFx0XHRcIm1hcGJveC5saWdodFwiIDogbWFwYm94KFwibWFwYm94LmxpZ2h0XCIpXHJcbiAgICAgICAgXHR9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBNYXBNYXJrZXIoKXtcclxuICAgICAgICBcdHJldHVybiBbXHJcbiAgICAgICAgXHRcdHtcclxuICAgICAgICBcdFx0XHRcImxhdExuZ1wiIDogWyA1MC41MjUxMDI3LCAzMC4zNDg4MDAzIF0sXHJcbiAgICAgICAgXHRcdFx0XCJ0ZXh0XCIgOiBcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ZXIgYWRpcGlzY2luZyBlbGl0LiBBZW5lYW4gY29tbW9kbyBsaWd1bGEgZWdldCBkb2xvci4gQWVuZWFuIG1hc3NhLlwiXHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdF1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gQWRkTWFya2VyKG1hcCl7XHJcbiAgICAgICAgXHRsZXQgbWFya2VycyA9IE1hcE1hcmtlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFx0Zm9yKG1hcmtlciBvZiBtYXJrZXJzKXtcclxuICAgICAgICBcdFx0TC5tYXJrZXIobWFya2VyLmxhdExuZykuYWRkVG8obWFwKVxyXG4gICAgICAgICAgICAgICAgXHQuYmluZFBvcHVwKG1hcmtlci50ZXh0KTtcclxuICAgICAgICBcdH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gTGVhZmxldChsYXRsbmcpe1xyXG4gICAgICAgIFx0bGV0IG1hcExheWVycyA9IG5ldyBNYXBMYXllcnMoKTtcclxuICAgICAgICBcdGxldCBkZWZhdWx0TWFwID0gXCJtYXBib3guc3RyZWV0c1wiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFx0bGV0IG1hcCA9IEwubWFwKCdtYXAnLCB7XHJcbiAgICAgICAgXHRcdGNlbnRlcjogbGF0bG5nLFxyXG4gICAgICAgIFx0XHR6b29tOiAxMCxcclxuICAgICAgICBcdFx0bGF5ZXJzOiBtYXBMYXllcnNbZGVmYXVsdE1hcF1cclxuICAgICAgICBcdH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFx0QWRkTWFya2VyKG1hcCk7XHJcbiAgICAgICAgXHRcclxuICAgICAgICBcdEwuY29udHJvbC5sYXllcnMobWFwTGF5ZXJzKS5hZGRUbyhtYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBDb250YWN0cygpe1xyXG4gICAgICAgIFx0bGV0IGxhdGxuZyA9IFs1MC41MjUxMDI3LCAzMC4zNDg4MDAzXTtcclxuICAgICAgICAgICAgTGVhZmxldChsYXRsbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxlYWZsZXRqcyA9IExvYWRGaWxlKHtcclxuICAgICAgICAgICAgXCJzcmNcIiA6IFwiaHR0cHM6Ly91bnBrZy5jb20vbGVhZmxldEAxLjUuMS9kaXN0L2xlYWZsZXQuanNcIixcclxuICAgICAgICAgICAgXCJpbnRlZ3JpdHlcIiA6IFwic2hhNTEyLUdmZlBNRjNSdk1lWXljMUxXTUh0SzhFYlB2MGlOWjgvb1R0SFB4OS9jYzJJTHhRK3U5MDVxSXdkcFVMYXFEa3lCS2dPYUI1N1FUTWc3enRnOEptMk9nPT1cIixcclxuICAgICAgICAgICAgXCJjcm9zc29yaWdpblwiIDogXCJcIixcclxuICAgICAgICAgICAgXCJhc3luY1wiOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzY3JpcHRcIlxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgbGVhZmxldGNzcyA9IExvYWRGaWxlKHtcclxuICAgICAgICBcInJlbFwiIDogXCJzdHlsZXNoZWV0XCIsXHJcbiAgICAgICAgXCJocmVmXCIgOiBcImh0dHBzOi8vdW5wa2cuY29tL2xlYWZsZXRAMS41LjEvZGlzdC9sZWFmbGV0LmNzc1wiLFxyXG4gICAgICAgIFwiaW50ZWdyaXR5XCIgOiBcInNoYTUxMi14d0UvQXo5enJqQklwaEFjQmIzRjZKVnF4ZjQ2K0NETHdmTE1IbG9OdTZLRVFDQVdpNkhjRFViZU9mQklwdEY3dGNDenVzS0ZqRncyeXV2RXBETDl3UT09XCIsXHJcbiAgICAgICAgXCJjcm9zc29yaWdpblwiIDogXCJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJsaW5rXCJcclxuICAgICk7XHJcbiAgICBcclxuICAgIGxlYWZsZXRqcy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBDb250YWN0cyk7XHJcblxyXG4gICAgbGVhZmxldGpzLmFkZEV2ZW50TGlzdGVuZXIoXCJvbmVycm9yIFwiLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGxlYWZsZXRqcyA9IExvYWRGaWxlKHtcclxuICAgICAgICAgICAgICAgIFwic3JjXCIgOiBcIi4vYXNzZXRzL2xpYi9sZWFmbGV0anMtMS41LjEvbGVhZmxldGpzLmpzXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJzY3JpcHRcIlxyXG4gICAgICAgICk7XHJcbiAgICAgICAgbGVhZmxldGpzLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIENvbnRhY3RzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGxlYWZsZXRjc3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9uZXJyb3IgXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgTG9hZEZpbGUoe1xyXG4gICAgICAgICAgICAgICAgXCJyZWxcIiA6IFwic3R5bGVzaGVldFwiLFxyXG4gICAgICAgICAgICAgICAgXCJocmVmXCIgOiBcIi4vYXNzZXRzL2xpYi9sZWFmbGV0anMtMS41LjEvbGVhZmxldGpzLmNzc1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwibGlua1wiXHJcbiAgICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxufSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIikgKSk7XHJcblxyXG5mdW5jdGlvbiBXaW5kb3dSZXNpemUoZXYpe1xyXG4gICAgZm9yKGxldCBjb2xsYmFjayBvZiByZXNpemUpe1xyXG4gICAgICAgIGNvbGxiYWNrLmZ1bigpO1xyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBXaW5kb3dSZXNpemUpOyJdLCJmaWxlIjoibWFpbi5qcyJ9
