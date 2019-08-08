function isNumber(event){
	var keycode = event.keyCode;
	if (keycode>=48 && keycode<57) {
		return true;
	}else{
		return false;
	}
}

function isNumberDot(event){
	var keycode = event.keyCode;
	if ((keycode>=48 && keycode<57) || keycode == 46) {
		return true;
	}else{
		return false;
	}
}
