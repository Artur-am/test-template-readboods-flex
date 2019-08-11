let resize = [];

function ClearElement(el){
	if (el.lastChild){
		while (el.hasChildNodes()){
			el.removeChild(el.lastChild);
		}
	}
}
function Route(el, collback){
    if(el){
        collback(el);
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

Route(
    Array.from( document.getElementsByClassName("carousel") ),
    (items) => {
        function Carousel(carousel){
        
            let carouselBody = carousel.getElementsByClassName("carousel-body")[0];
        
            let maxPostId = 0;
            let classNameNavItem = "active";
        
            function ClicledItem(ev, el){
                el = el != window ? el : null;
                let id = 0;
                let items = carousel.querySelectorAll(".carouse-nav > ul > li");
        
                for(let item of items){
                    if(el == item){
                        break;
                    }
                    id++;
                }
        
                let n = 0;
                for(let item of carouselBody.children){
                    if(n < id){
                        item.classList.add("hidden");
                    }else{
                        if( ((maxPostId - 1) > n ) || ( ((maxPostId - 1) + id) >= n) ){
                            item.classList.remove("hidden");
                        }else{
                            item.classList.add("hidden");
                        }
                    }
                    n++;
                }
        
                let removeClass = carousel.querySelector(".carouse-nav > ul > li.active");
                if(removeClass){
                    removeClass.classList.remove(classNameNavItem);
                }
                items[id].classList.add(classNameNavItem);
            }
        
            function CreateCarouselNavigation(){
        
                let pushObjItem = function(className){
                    return { "tag" : "li", "attribute" : { "class" : "carousel-nav-circle" + className }, "content" : "", "event" : { "click" : function(ev){ ClicledItem(ev, this) }  } };
                };
        
                let data = {
                    "el" : {
                        "tag" : "ul",
                        "el" : []
                    }
                };
        
                for(let n = 0, countItem = carouselBody.children.length - (maxPostId - 1); n < countItem; n++){
                    data.el.el.push( pushObjItem( (n == 0) ? " " +classNameNavItem : "") );
                }
        
                HTMLRender(carousel.getElementsByClassName("carouse-nav")[0], data);
            }
        
            function CarouselScroll(){
                let parentWidth = carouselBody.clientWidth;
                let marginRight = getCSSProperty( carouselBody.children[0], "marginRight" );
                let itemWidth = marginRight + carouselBody.children[0].clientWidth;
            
                maxPostId = ~~(parentWidth / itemWidth );
        
                for(let n = maxPostId, length = carouselBody.children.length; n < length; n++){
                    carouselBody.children[n].classList.add("hidden");
                }
        
            }
        
            function Media(){
                if(carousel.getElementsByClassName("carouse-nav")[0]){
                    ClearElement(
                        carousel.getElementsByClassName("carouse-nav")[0]
                    );
                }
                for(let n = 0, length = carouselBody.children.length; n < length; n++){
                    carouselBody.children[n].classList.remove("hidden");
                }
                CarouselScroll();
                CreateCarouselNavigation();
            }
        
            CarouselScroll();
            CreateCarouselNavigation();
        
            resize.push({
                "fun" : function(){ Media(); }
            });
        }

        for(let item of items){
            Carousel(item);
        }

    }
);

Route(
    document.getElementById("map"),
    (map) => {
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
    }
);

function WindowResize(ev){
    for(let collback of resize){
        collback.fun();
    }
}

window.addEventListener("resize", WindowResize);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCByZXNpemUgPSBbXTtcclxuXHJcbmZ1bmN0aW9uIENsZWFyRWxlbWVudChlbCl7XHJcblx0aWYgKGVsLmxhc3RDaGlsZCl7XHJcblx0XHR3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKXtcclxuXHRcdFx0ZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gUm91dGUoZWwsIGNvbGxiYWNrKXtcclxuICAgIGlmKGVsKXtcclxuICAgICAgICBjb2xsYmFjayhlbCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gQ3JlYXRlRWxlbWVudChkYXRhKSB7XHJcbiAgICBsZXQgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkYXRhLnRhZyk7XHJcbiAgICBpZiAoXCJjbGFzc1wiIGluIGRhdGEpIHtcclxuICAgICAgICB0YWcuY2xhc3NMaXN0LmFkZChkYXRhLmNsYXNzKTtcclxuICAgIH1cclxuICAgIGlmIChcImF0dHJpYnV0ZVwiIGluIGRhdGEpIHtcclxuICAgICAgICBmb3IgKGxldCBhdHQgaW4gZGF0YS5hdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgdGFnLnNldEF0dHJpYnV0ZShhdHQsIGRhdGEuYXR0cmlidXRlW2F0dF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChcImNvbnRlbnRcIiBpbiBkYXRhKSB7XHJcbiAgICAgICAgdGFnLmlubmVyVGV4dCA9IGRhdGEuY29udGVudDtcclxuICAgIH1cclxuICAgIHJldHVybiB0YWc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEhUTUxSZW5kZXIoZWxlbWVudCwgZGF0YSkge1xyXG4gICAgZnVuY3Rpb24gcmVuZGVyKGVsLCBkYXRhKSB7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBudWxsO1xyXG4gICAgICAgIGZvciAobGV0IGQgb2YgZGF0YS5lbCkge1xyXG4gICAgICAgICAgICBpdGVtID0gQ3JlYXRlRWxlbWVudChkKTtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoXCJldmVudFwiIGluIGQpIHtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgZXZlbnQgaW4gZC5ldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBkLmV2ZW50W2V2ZW50XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChkLmVsICYmIGQuZWxbMF0pIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlcihpdGVtLCBkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBjcmVhdCA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICAgICAgbGV0IHBhcmVudCA9IENyZWF0ZUVsZW1lbnQob2JqKTtcclxuICAgICAgICByZW5kZXIocGFyZW50LCBvYmopO1xyXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQocGFyZW50KTtcclxuICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgfTtcclxuICAgIGxldCBlbCA9IG51bGw7XHJcbiAgICBpZihBcnJheS5pc0FycmF5KGRhdGEpKXtcclxuICAgICAgICBmb3IobGV0IGl0ZW0gb2YgZGF0YSl7XHJcbiAgICAgICAgICAgIGVsLnB1c2goY3JlYXQoaXRlbS5lbCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICAgIGVsID0gY3JlYXQoZGF0YS5lbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVsO1xyXG59XHJcbmZ1bmN0aW9uIGdldENTU1Byb3BlcnR5KGVsLCBwcm9wZXJ0eSl7XHJcbiAgICBsZXQgcmVzID0gMDtcclxuXHJcbiAgICBpZihlbC5zdHlsZVtwcm9wZXJ0eV0pe1xyXG4gICAgICAgIHJlcyA9IGVsLnN0eWxlW3Byb3BlcnR5XTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJlcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpW3Byb3BlcnR5XTtcclxuICAgIH1cclxuICAgIHJlcyA9ICsoIHJlcy5yZXBsYWNlKC9bXlxcZF0vZywgJycpICk7XHJcblxyXG4gICAgcmV0dXJuIGlzTmFOKHJlcykgPyAwIDogcmVzO1xyXG59XHJcbmZ1bmN0aW9uIExvYWRGaWxlKGF0dHJpYnV0ZSwgdGFnLCBzdGF0dXMgPSBmYWxzZSl7XHJcbiAgICBpZighc3RhdHVzKXtcclxuICAgICAgICByZXR1cm4gSFRNTFJlbmRlcihkb2N1bWVudC5ib2R5LCB7XHJcbiAgICAgICAgICAgIFwiZWxcIiA6IHtcclxuICAgICAgICAgICAgICAgIFwidGFnXCIgOiB0YWcsXHJcbiAgICAgICAgICAgICAgICBcImF0dHJpYnV0ZVwiIDogYXR0cmlidXRlLFxyXG4gICAgICAgICAgICAgICAgXCJlbFwiIDogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5Sb3V0ZShcclxuICAgIEFycmF5LmZyb20oIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJvdXNlbFwiKSApLFxyXG4gICAgKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgZnVuY3Rpb24gQ2Fyb3VzZWwoY2Fyb3VzZWwpe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgY2Fyb3VzZWxCb2R5ID0gY2Fyb3VzZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcm91c2VsLWJvZHlcIilbMF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBtYXhQb3N0SWQgPSAwO1xyXG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lTmF2SXRlbSA9IFwiYWN0aXZlXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIENsaWNsZWRJdGVtKGV2LCBlbCl7XHJcbiAgICAgICAgICAgICAgICBlbCA9IGVsICE9IHdpbmRvdyA/IGVsIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIGxldCBpZCA9IDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbXMgPSBjYXJvdXNlbC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcm91c2UtbmF2ID4gdWwgPiBsaVwiKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaXRlbSBvZiBpdGVtcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZWwgPT0gaXRlbSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IG4gPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpdGVtIG9mIGNhcm91c2VsQm9keS5jaGlsZHJlbil7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobiA8IGlkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggKChtYXhQb3N0SWQgLSAxKSA+IG4gKSB8fCAoICgobWF4UG9zdElkIC0gMSkgKyBpZCkgPj0gbikgKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHJlbW92ZUNsYXNzID0gY2Fyb3VzZWwucXVlcnlTZWxlY3RvcihcIi5jYXJvdXNlLW5hdiA+IHVsID4gbGkuYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVtb3ZlQ2xhc3Mpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lTmF2SXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtc1tpZF0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWVOYXZJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBmdW5jdGlvbiBDcmVhdGVDYXJvdXNlbE5hdmlnYXRpb24oKXtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBwdXNoT2JqSXRlbSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgXCJ0YWdcIiA6IFwibGlcIiwgXCJhdHRyaWJ1dGVcIiA6IHsgXCJjbGFzc1wiIDogXCJjYXJvdXNlbC1uYXYtY2lyY2xlXCIgKyBjbGFzc05hbWUgfSwgXCJjb250ZW50XCIgOiBcIlwiLCBcImV2ZW50XCIgOiB7IFwiY2xpY2tcIiA6IGZ1bmN0aW9uKGV2KXsgQ2xpY2xlZEl0ZW0oZXYsIHRoaXMpIH0gIH0gfTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcImVsXCIgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFnXCIgOiBcInVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZWxcIiA6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgbiA9IDAsIGNvdW50SXRlbSA9IGNhcm91c2VsQm9keS5jaGlsZHJlbi5sZW5ndGggLSAobWF4UG9zdElkIC0gMSk7IG4gPCBjb3VudEl0ZW07IG4rKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5lbC5lbC5wdXNoKCBwdXNoT2JqSXRlbSggKG4gPT0gMCkgPyBcIiBcIiArY2xhc3NOYW1lTmF2SXRlbSA6IFwiXCIpICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBIVE1MUmVuZGVyKGNhcm91c2VsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJvdXNlLW5hdlwiKVswXSwgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgZnVuY3Rpb24gQ2Fyb3VzZWxTY3JvbGwoKXtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRXaWR0aCA9IGNhcm91c2VsQm9keS5jbGllbnRXaWR0aDtcclxuICAgICAgICAgICAgICAgIGxldCBtYXJnaW5SaWdodCA9IGdldENTU1Byb3BlcnR5KCBjYXJvdXNlbEJvZHkuY2hpbGRyZW5bMF0sIFwibWFyZ2luUmlnaHRcIiApO1xyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW1XaWR0aCA9IG1hcmdpblJpZ2h0ICsgY2Fyb3VzZWxCb2R5LmNoaWxkcmVuWzBdLmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIG1heFBvc3RJZCA9IH5+KHBhcmVudFdpZHRoIC8gaXRlbVdpZHRoICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IG4gPSBtYXhQb3N0SWQsIGxlbmd0aCA9IGNhcm91c2VsQm9keS5jaGlsZHJlbi5sZW5ndGg7IG4gPCBsZW5ndGg7IG4rKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgY2Fyb3VzZWxCb2R5LmNoaWxkcmVuW25dLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgZnVuY3Rpb24gTWVkaWEoKXtcclxuICAgICAgICAgICAgICAgIGlmKGNhcm91c2VsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJvdXNlLW5hdlwiKVswXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2xlYXJFbGVtZW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJvdXNlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2Fyb3VzZS1uYXZcIilbMF1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBuID0gMCwgbGVuZ3RoID0gY2Fyb3VzZWxCb2R5LmNoaWxkcmVuLmxlbmd0aDsgbiA8IGxlbmd0aDsgbisrKXtcclxuICAgICAgICAgICAgICAgICAgICBjYXJvdXNlbEJvZHkuY2hpbGRyZW5bbl0uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIENhcm91c2VsU2Nyb2xsKCk7XHJcbiAgICAgICAgICAgICAgICBDcmVhdGVDYXJvdXNlbE5hdmlnYXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBDYXJvdXNlbFNjcm9sbCgpO1xyXG4gICAgICAgICAgICBDcmVhdGVDYXJvdXNlbE5hdmlnYXRpb24oKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgcmVzaXplLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgXCJmdW5cIiA6IGZ1bmN0aW9uKCl7IE1lZGlhKCk7IH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IobGV0IGl0ZW0gb2YgaXRlbXMpe1xyXG4gICAgICAgICAgICBDYXJvdXNlbChpdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4pO1xyXG5cclxuUm91dGUoXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKSxcclxuICAgIChtYXApID0+IHtcclxuICAgICAgICBmdW5jdGlvbiBNYXBMYXllcnMoKXtcclxuICAgICAgICBcdGxldCBtYXBib3ggPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgXHRcdHJldHVybiBMLnRpbGVMYXllcihcImh0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQve2lkfS97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYldGd1ltOTRJaXdpWVNJNkltTnBlalk0TlhWeWNUQTJlbVl5Y1hCbmRIUnFjbVozTjNnaWZRLnJKY0ZJRzIxNEFyaUlTTGJCNkI1YXdcIiwge1xyXG4gICAgICAgIFx0XHRcdFwiaWRcIiA6IGlkLFxyXG4gICAgICAgIFx0XHRcdFwiYXR0cmlidXRpb25cIiA6ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywnICtcclxuICAgICAgICBcdFx0XHRcdFx0XHRcdCc8YSBocmVmPVwiaHR0cHM6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4sICcgK1xyXG4gICAgICAgIFx0XHRcdFx0XHRcdFx0J0ltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vXCI+TWFwYm94PC9hPidcclxuICAgICAgICBcdFx0fSk7XHJcbiAgICAgICAgXHR9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIFx0cmV0dXJuIHtcclxuICAgICAgICBcdFx0XCJvcGVuc3RyZWV0bWFwXCIgOiBMLnRpbGVMYXllcihcclxuICAgICAgICBcdFx0XHRcImh0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nXCIsXHJcbiAgICAgICAgXHRcdFx0e1xyXG4gICAgICAgIFx0XHRcdFx0YXR0cmlidXRpb246ICcmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycydcclxuICAgICAgICBcdFx0XHR9XHJcbiAgICAgICAgXHRcdCksXHJcbiAgICAgICAgXHRcdFwibWFwYm94LnN0cmVldHNcIiA6IG1hcGJveChcIm1hcGJveC5zdHJlZXRzXCIpLFxyXG4gICAgICAgIFx0XHRcIm1hcGJveC5saWdodFwiIDogbWFwYm94KFwibWFwYm94LmxpZ2h0XCIpXHJcbiAgICAgICAgXHR9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBNYXBNYXJrZXIoKXtcclxuICAgICAgICBcdHJldHVybiBbXHJcbiAgICAgICAgXHRcdHtcclxuICAgICAgICBcdFx0XHRcImxhdExuZ1wiIDogWyA1MC41MjUxMDI3LCAzMC4zNDg4MDAzIF0sXHJcbiAgICAgICAgXHRcdFx0XCJ0ZXh0XCIgOiBcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ZXIgYWRpcGlzY2luZyBlbGl0LiBBZW5lYW4gY29tbW9kbyBsaWd1bGEgZWdldCBkb2xvci4gQWVuZWFuIG1hc3NhLlwiXHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdF1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gQWRkTWFya2VyKG1hcCl7XHJcbiAgICAgICAgXHRsZXQgbWFya2VycyA9IE1hcE1hcmtlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFx0Zm9yKG1hcmtlciBvZiBtYXJrZXJzKXtcclxuICAgICAgICBcdFx0TC5tYXJrZXIobWFya2VyLmxhdExuZykuYWRkVG8obWFwKVxyXG4gICAgICAgICAgICAgICAgXHQuYmluZFBvcHVwKG1hcmtlci50ZXh0KTtcclxuICAgICAgICBcdH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gTGVhZmxldChsYXRsbmcpe1xyXG4gICAgICAgIFx0bGV0IG1hcExheWVycyA9IG5ldyBNYXBMYXllcnMoKTtcclxuICAgICAgICBcdGxldCBkZWZhdWx0TWFwID0gXCJtYXBib3guc3RyZWV0c1wiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFx0bGV0IG1hcCA9IEwubWFwKCdtYXAnLCB7XHJcbiAgICAgICAgXHRcdGNlbnRlcjogbGF0bG5nLFxyXG4gICAgICAgIFx0XHR6b29tOiAxMCxcclxuICAgICAgICBcdFx0bGF5ZXJzOiBtYXBMYXllcnNbZGVmYXVsdE1hcF1cclxuICAgICAgICBcdH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFx0QWRkTWFya2VyKG1hcCk7XHJcbiAgICAgICAgXHRcclxuICAgICAgICBcdEwuY29udHJvbC5sYXllcnMobWFwTGF5ZXJzKS5hZGRUbyhtYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBDb250YWN0cygpe1xyXG4gICAgICAgIFx0bGV0IGxhdGxuZyA9IFs1MC41MjUxMDI3LCAzMC4zNDg4MDAzXTtcclxuICAgICAgICAgICAgTGVhZmxldChsYXRsbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxlYWZsZXRqcyA9IExvYWRGaWxlKHtcclxuICAgICAgICAgICAgICAgIFwic3JjXCIgOiBcImh0dHBzOi8vdW5wa2cuY29tL2xlYWZsZXRAMS41LjEvZGlzdC9sZWFmbGV0LmpzXCIsXHJcbiAgICAgICAgICAgICAgICBcImludGVncml0eVwiIDogXCJzaGE1MTItR2ZmUE1GM1J2TWVZeWMxTFdNSHRLOEViUHYwaU5aOC9vVHRIUHg5L2NjMklMeFErdTkwNXFJd2RwVUxhcURreUJLZ09hQjU3UVRNZzd6dGc4Sm0yT2c9PVwiLFxyXG4gICAgICAgICAgICAgICAgXCJjcm9zc29yaWdpblwiIDogXCJcIixcclxuICAgICAgICAgICAgICAgIFwiYXN5bmNcIjogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJzY3JpcHRcIlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCBsZWFmbGV0Y3NzID0gTG9hZEZpbGUoe1xyXG4gICAgICAgICAgICBcInJlbFwiIDogXCJzdHlsZXNoZWV0XCIsXHJcbiAgICAgICAgICAgIFwiaHJlZlwiIDogXCJodHRwczovL3VucGtnLmNvbS9sZWFmbGV0QDEuNS4xL2Rpc3QvbGVhZmxldC5jc3NcIixcclxuICAgICAgICAgICAgXCJpbnRlZ3JpdHlcIiA6IFwic2hhNTEyLXh3RS9Bejl6cmpCSXBoQWNCYjNGNkpWcXhmNDYrQ0RMd2ZMTUhsb051NktFUUNBV2k2SGNEVWJlT2ZCSXB0Rjd0Y0N6dXNLRmpGdzJ5dXZFcERMOXdRPT1cIixcclxuICAgICAgICAgICAgXCJjcm9zc29yaWdpblwiIDogXCJcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImxpbmtcIlxyXG4gICAgICAgICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGVhZmxldGpzLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIENvbnRhY3RzKTtcclxuXHJcbiAgICAgICAgbGVhZmxldGpzLmFkZEV2ZW50TGlzdGVuZXIoXCJvbmVycm9yIFwiLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBsZWFmbGV0anMgPSBMb2FkRmlsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIiA6IFwiLi9hc3NldHMvbGliL2xlYWZsZXRqcy0xLjUuMS9sZWFmbGV0anMuanNcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwic2NyaXB0XCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbGVhZmxldGpzLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIENvbnRhY3RzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGVhZmxldGNzcy5hZGRFdmVudExpc3RlbmVyKFwib25lcnJvciBcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgTG9hZEZpbGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIFwicmVsXCIgOiBcInN0eWxlc2hlZXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImhyZWZcIiA6IFwiLi9hc3NldHMvbGliL2xlYWZsZXRqcy0xLjUuMS9sZWFmbGV0anMuY3NzXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImxpbmtcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4pO1xyXG5cclxuZnVuY3Rpb24gV2luZG93UmVzaXplKGV2KXtcclxuICAgIGZvcihsZXQgY29sbGJhY2sgb2YgcmVzaXplKXtcclxuICAgICAgICBjb2xsYmFjay5mdW4oKTtcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgV2luZG93UmVzaXplKTsiXSwiZmlsZSI6Im1haW4uanMifQ==
