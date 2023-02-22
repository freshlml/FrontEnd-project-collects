window.onload = function() {
	//搜索块随滚动改变背景的透明度
	var zt_banner = document.querySelector(".zt_banner");
	var zt_search = document.querySelector(".zt_search");
	var bannerHeight = zt_banner.offsetHeight;
	window.onscroll = function() {
		var scrollTop = 0;
		if(document.documentElement && document.documentElement.scrollTop){ 
			scrollTop=document.documentElement.scrollTop; 
		}else if(document.body){ 
			scrollTop=document.body.scrollTop; 
		}
		if(scrollTop > bannerHeight) return;
		var capcity = scrollTop/bannerHeight;
		zt_search.style.backgroundColor="rgba(20,23,26,"+capcity+")";
	}
}