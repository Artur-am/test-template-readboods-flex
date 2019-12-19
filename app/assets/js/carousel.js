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