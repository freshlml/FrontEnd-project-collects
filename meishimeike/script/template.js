
function dropDownShow(dropDownType) {
	var allType = flMessage.common.dropDownType;
	$.each(allType, function(idx) {
		var selType;
		try{
			selType = parseInt(this, 10);
		} catch(e) {
			console.log(e);
			return ;
		}
		var selid = "dropdown_" + selType;
		var selDiv = $("#" + selid);
		if(dropDownType == selType) {
			selDiv.show();
		} else {
			selDiv.hide();
		}
	});
}

function dropDownHide() {
	$(".dropdown-menu").hide();
}