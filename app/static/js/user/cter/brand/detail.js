$(function() {
	let browH = $(window).height()
	$('.brandInfoImg').height(browH/1.8)
	if(bodyH < browH) {
		footH = browH - bodyH
		$('.footerSpace').height(footH)
	}
})