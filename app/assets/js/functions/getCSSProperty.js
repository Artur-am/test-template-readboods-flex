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