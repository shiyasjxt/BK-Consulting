!(function($){
	// regular js
	$.fn.equalHeights = function()
	{
		var maxHeight = 0;
		this.each(function(){
			maxHeight = $(this).outerHeight() > maxHeight ? $(this).outerHeight() : maxHeight;
		});
		this.css("min-height", maxHeight);
	}
	// jquery
	$(function(){

		// bootstrap classes
		$("#dynamic-container, #content-container, #job-dynamic-container")
			.wrap("<div class='container-fluid'></div>")
			.addClass("row");
		$("#content-container.newDash").removeClass("container");
		if ( $.trim( $("#dynamic-side-left-container, #side-left").text() ).length )
		{
			console.log("inif");
			$("#dynamic-side-left-container, #side-left").addClass("col-md-4 hidden-sm hidden-xs pull-right");
			$("#dynamic-content, #content-container #content").addClass("col-md-8 col-sm-12 col-xs-12 pull-left");
			$("#job-dynamic-container #content").addClass("col-xs-12 pull-right");
		}
		else
		{
			$("#dynamic-side-left-container, #side-left").hide();
			$("#dynamic-content, #content").addClass("col-xs-12");
		}
		$("#side-right, #dynamic-side-right-container, #job-side-column").hide();
		$("#wrapper").show();

		// make header sticky.
		var headerHeight = $("#r24_header").height();
		$("body").addClass("r24_sticky-header");
		$("body").css("padding-top", headerHeight);

		// skip link
		$("#skip-link").attr("href", "#" + $("#dynamic-content, #content").attr("id"));

		// remove empty li's and ul's on the system pages. 
		$(".links-2 li:empty").remove();
		$(".links-2 ul:empty").remove();
		
		// add active class to links.
		$("li a[href='" + window.location.pathname.toLowerCase() + "']").parent().addClass("active");
		$("li.active li.active").parent().closest("li.active").removeClass("active");
				
		// add nbsp;
		$("#side-drop-menu > li > ul > li > a").each(function(){
			var linkText = $(this).text();
			linkText = linkText.replace(" (", "&nbsp;(");
			$(this).html(linkText);
		});

		// move news rss feed to bottom of news index.
		$(".newsIndex").append( $(".newsIndex .search-options") ); 
		// move date on new page.
		$(".news-individual-container").each(function(){
			$(this).children(".news-excerpt").children("h3").after( $(this).children(".news-date") );
		});
		
		// generate actions button 
		$(".job-navbtns").convertButtons({
			buttonTitle: "Actions&hellip;", 
			title: "Please choose&hellip;", 
			links: ".job-navbtns a"
		});
		
		// generate filters button 
		$(".job-navbtns").convertFilters({
			buttonTitle: "Filters&hellip;", 
			filteredTitle: "Applied Filters", 
			title: "Please choose&hellip;", 
			filtered: ".search-query p", 
			list: "ul#side-drop-menu", 
			excludeFromList: "#AdvancedSearchFilter_PnlCompany"
		});

		// copy header social media links to footer and contact page.
		var contactSocialMedia = $(".r24_social-media").clone()
		var footerSocialMedia = $(".r24_social-media").clone()
		$("#r24_contact-us-social-media").prepend( contactSocialMedia );
		$("#r24_footer-social-media").append(footerSocialMedia);

		// mobile menu / site search 
		$(".r24_toggle-navigation").click(function(e){
			e.preventDefault();
			var elementToToggle = $(this).attr("href");
			$(elementToToggle).toggleClass("active");
		});
		
		// home banner
		$(".r24_slider").cycle({
			slides: "> div", 
			pager: ".cycle-pager", 
			next: ".cycle-next", 
			prev: ".cycle-prev" 
		});

		// inner banners
		// write inner banner image if it doesn't already contain an image
		if ( $(".r24_single-banner:visible").length  && !$(".r24_single-banner img").length )
		{
			var parentIndex;
			$("#r24_navigation a").each(function(){
				if ( location.pathname.toLowerCase() == $(this).attr("href") )
				{
					parentIndex = $(this).closest("#r24_navigation > ul > li").index();
				}
			});
			$(".r24_single-banner").prepend( $("<img src='/media/BK-Consulting/images/banners/inner-" + (parentIndex > -1 ? parentIndex : "0") + ".jpg' alt='BK-Consulting' />") );
		}
		
		// Latest Jobs widget
		$("#r24_home-latest-jobs ul").includeFeed({
			baseSettings: { 
				rssURL: [$("#r24_home-latest-jobs ul").attr("data-url") || "/job/rss.aspx?addProfession=1"], 
				addNBSP: false 
			}, 
			templates: { 
				itemTemplate: "<li><div class='rss-item' id='rss-item-{{item-index}}'><span class='rss-item-pubDate'>[[pubDateTemplate]]</span><span class='rss-item-title'><a target='_blank' href='{{link}}'>{{title}}</a></span><span class='rss-item-description'>{{description}}</span><span class='rss-item-link'><a href='{{link}}'>View Job</a></span></div></li>"
			},
			complete: function(){
				$(this).children().each(function(){
					var thisProfession = $(this).find(".xmlProfession");
					if (thisProfession.length)
					{
						$(this).find(".rss-item-description").after(thisProfession);
					}
				});
				// jcarousel
				if ($(this).children().length > 2){ 
			        var jcarousel = $(this).parent();
			        jcarousel.on('jcarousel:reload jcarousel:create', function(){
		                var carousel = $(this);
		                var width = carousel.innerWidth();
		                if ( 500 < width ) {
				            width = width / 2;
		                } else {
		                	width = width;
		                }
		                carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
		            });
		            jcarousel.jcarousel({
		                wrap: 'circular'
		            });
		            jcarousel.jcarouselAutoscroll();
			        $('#r24_home-latest-jobs .jcarousel-prev').jcarouselControl({
		                target: '-=1'
		            });
			        $('#r24_home-latest-jobs .jcarousel-next').jcarouselControl({
		                target: '+=1'
		            });
				}
			}
		});

		// if user logged in, change register links to dashboard.
		if ( $(".user-loggedIn").length )
		{
			$("a[href='/member/register.aspx']").text("My Dashboard");
			$("a[href='/member/register.aspx']").attr("href", "/member/default.aspx");

			$("a[href='/member/login.aspx']").text("Logout");
			$("a[href='/member/login.aspx']").attr("href", "/logout.aspx");
		}

		// expandable tab
		$(".r24_tab-heading a").click(function(e){
			if ( !$(this).attr("href") )
			{
				e.preventDefault();
				$(this).parent().parent().toggleClass("active");
				$(this).parent().parent().next(".r24_tab-content").toggleClass("active");
			}
		});
		// if tab is in hash, click it automatically. 
		if ( location.hash.toLowerCase() && $(location.hash.toLowerCase()).length )
		{
			$(location.hash.toLowerCase()).find("a").click();
			scrollToDiv(location.hash.toLowerCase());
		}
		// in case top navigation redirects to a hash.
		$("#r24_navigation a, #r24_left-navigation a").click(function(e){
			var myLink = $(this).attr("href") || "";
			var myHash = myLink.substr( myLink.indexOf("#") );
			var myHeadingLink = $(myHash + ".r24_tab-heading");
			if ( myHeadingLink.length )
			{
				e.preventDefault();
				myHeadingLink.find("a").click();
				scrollToDiv(myHeadingLink);
			}
		});

		// add iframe url for a map
		function loadMap(iframeObject)
		{
			// if the iframe has no src or a blank src, and it has a data-src attribute
			if ( !(iframeObject.attr("src") && iframeObject.attr("src").length) && iframeObject.attr("data-src") )
			{
				iframeObject.attr("src", iframeObject.attr("data-src"));
			}
		}
		// scroll to a map
		function scrollToDiv(divID)
		{
			$("html, body").animate({
				scrollTop: $(divID).offset().top - ( $(".r24_sticky-header #r24_header").height() || 0 ) - 20
			}, 300);
		}
		// if a location hash is on the url, add active to the div.
		if ( location.hash && $(location.hash + ".r24_map").length )
		{
			$(location.hash + ".r24_map").addClass("active");
		}
		else
		{
			// otherwise, just make the first map active.
			$(".r24_map:first").addClass("active");
		}
		loadMap($(".r24_map.active iframe"));
		// contact page maps on click
		$(".r24_contact-map-link, .footer-location a, #r24_locations a").click(function(e){
			var myLink = $(this).attr("href")
			var targetMap = $( myLink.substr(myLink.indexOf("#")) );
			if ( targetMap.length )
			{
				e.preventDefault();
				loadMap(targetMap.children("iframe"));
				scrollToDiv(targetMap);
				$(".r24_map").not(targetMap).removeClass("active");
				targetMap.addClass("active");
			}
		});

		// home tab boxes
		$(".r24_home-tab-menu a").click(function(e){
			e.preventDefault();
			$(".r24_home-tab-menu a").not( $(this) ).parent("li").removeClass("active");
			$(this).parent("li").addClass("active");
			var myIndex = $(this).parent().index();
			var myTab = $(".r24_home-tab").eq(myIndex);
			$(".r24_home-tab").not(myTab).removeClass("active");
			myTab.addClass("active");
		});

		// changes - add testing tab function
		$(".r24_home-tab-menu1 a").click(function(e){
			e.preventDefault();
			$(".r24_home-tab-menu1 a").not( $(this) ).parent("li").removeClass("active");
			$(this).parent("li").addClass("active");
			var myIndex = $(this).parent().index();
			var myTab = $(".r24_home-tab1").eq(myIndex);
			$(".r24_home-tab1").not(myTab).removeClass("active");
			myTab.addClass("active");
		});

		// when resized do these things.
		function resizeTasks() 
		{
			// equal heights
			$(".r24_call-to-action-button").equalHeights();
		}
		$(window).resize(function(){
			resizeTasks();
		});
		resizeTasks();

		
	});
	
})(jQuery);