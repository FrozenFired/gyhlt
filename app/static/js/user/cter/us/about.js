$(function() {
	let browH
	// let bothHeight = 
	var resizeAbout = function() {
		browH = $(window).height();
		pageH = browH - 90;
		$('.about').height(pageH);
		$('.milano-box').height(pageH);
		$('.milano').height(pageH);
		$('.shanghai-box').height(pageH);
		$('.shanghai').height(pageH);

		$('.aboutSpace').height(browH/10);
		$(".aboutH1").css('font-size', pageH/18);
		$(".aboutH2").css('font-size', pageH/20);
		$(".aboutH3").css('font-size', pageH/25);
		$(".aboutP").css('font-size', pageH/30);

		$('.aboutImg').height(pageH/2);
		$('.milanoMb-box').height(pageH);
		$('.milanoMb').height(pageH);
		$('.shanghaiMb-box').height(pageH);
		$('.shanghaiMb').height(pageH);
	}
	resizeAbout();
	$(window).resize(function () {		//当浏览器大小变化时
		resizeAbout()
	});

	$(".miImg").click(function(e) {
		$(".aboutImg").hide();
		$(".shanghaiMb-box").hide();
		$(".milanoMb-box").show();
	})
	$(".mitext").click(function(e) {
		$(".aboutImg").hide();
		$(".shanghaiMb-box").hide();
		$(".milanoMb-box").show();
	})
	$(".milanoMb-box").click(function(e) {
		$(".milanoMb-box").hide()
		$(".aboutImg").show();
	})
	$(".shImg").click(function(e) {
		$(".aboutImg").hide();
		$(".milanoMb-box").hide();
		$(".shanghaiMb-box").show();
	})
	$(".mitext").click(function(e) {
		$(".aboutImg").hide();
		$(".milanoMb-box").hide();
		$(".shanghaiMb-box").show();
	})
	$(".shanghaiMb-box").click(function(e) {
		$(".shanghaiMb-box").hide()
		$(".aboutImg").show();
	})

	$(".milano-box").mouseover(function(e) {
		$(".milano").hide();
	})
	$(".shanghai-box").mouseover(function(e) {
		$(".shanghai").hide();
	})
	$(".about").mouseout(function(e) {
		$(".milano").show();
		$(".shanghai").show();
	})
})