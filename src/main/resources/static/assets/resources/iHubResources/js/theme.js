$(document).ready(function() {
$("body.login").css("height", $(window).height()+"px");
	$("#menu-app .bt-menu").click(function() {
		if ($("#menu-app").hasClass('open')) {
			$("#menu-app").removeClass('open');
		} else {
			$("#menu-app").addClass('open');
		}
	});
	
	//JSON DATA START
	var JSONService = "assets/resources/iHubResources/js/menu.json";
	$.ajax({
	type: "GET",
	contentType: "application/json",
	dataType: "json",
	url: JSONService}).done(function (data) {
		for(var i = 0; i < data.mainMenu.length; i++) {
			if(data.mainMenu[i].subMenu.length == 0)
				$(".nav").append('<li><a href='+data.mainMenu[i].pageURL+'>'+data.mainMenu[i].pageName+'</a></li>');
			else {
				var newHTML = [];
				for(var j = 0; j < data.mainMenu[i].subMenu.length; j++) {
					newHTML.push('<li><a href='+data.mainMenu[i].subMenu[j].pageURL+'>'+data.mainMenu[i].subMenu[j].pageName+'</a></li>');
				}
				$(".nav").append('<li class="sub-menu"><a href='+data.mainMenu[i].pageURL+'>'+data.mainMenu[i].pageName+'<span class="caret"></span></a><ul class="custom-submenu">'+newHTML.join('')+'</ul></li>');
			}
		}
		sideNavbar();
	});
	//JSON DATA END
	
	//drop down list for side navbar
	$(".nav").on({
		click: function(event) {
			event.preventDefault();
			$(this).parent().toggleClass("active");
			$(this).parent().find(".custom-submenu").slideToggle(600);
			$(this).parent().siblings().removeClass("active");
			$(this).parent().siblings().find(".custom-submenu").slideUp(600);
		}
	}, "li.sub-menu > a");
	//end
});

$(document).ready(ScrollMenuMobile);
$(window).resize(ScrollMenuMobile);


function ScrollMenuMobile() {
    $('.wrapper-menu').css('height', $(window).height() + 'px');
}

function sideNavbar() {
	//highlighted active page name on left sidebar
	var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/")+1);
	$(".nav li a").each(function(){
		if ($(this).attr("href") == pgurl) {
			$(this).parent().addClass("active");
			$(this).closest('ul').css('display', 'block');
			$(this).closest('ul').closest('li').addClass('active');
		}		
	});
	//end
}