!(function($){
	$(function(){

		var searchButtonSelector = "#r24_search-link, #r24_site-search-link";		
		$("form").first().keypress(function(e){
			if ( 13 == e.which )
			{
				$(searchButtonSelector).mousedown();
				$(searchButtonSelector).click();
				return false;
			}
		});
		// custom select
		if ( $.fn.customSelect )
		{
			$(".r24_search-field select").customSelect();
		}

	});
})(jQuery);