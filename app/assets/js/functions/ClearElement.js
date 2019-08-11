function ClearElement(el){
	if (el.lastChild){
		while (el.hasChildNodes()){
			el.removeChild(el.lastChild);
		}
	}
}