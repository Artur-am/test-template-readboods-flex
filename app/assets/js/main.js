let resize = [];

//= ./functions/ClearElement.js
//= ./functions/Route.js
//= ./functions/HTMLRender.js
//= ./functions/getCSSProperty.js
//= ./functions/load-file.js

Route(
    Array.from( document.getElementsByClassName("carousel") ),
    (items) => {
        //= ./carousel.js

        for(let item of items){
            Carousel(item);
        }

    }
);

Route(
    document.getElementById("map"),
    (map) => {
        //= ./contacts.js

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