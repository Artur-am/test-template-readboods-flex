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