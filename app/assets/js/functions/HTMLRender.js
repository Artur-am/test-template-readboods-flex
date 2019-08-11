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