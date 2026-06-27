// Recovered scaffold script with built-in marketing and ad tracking hooks.

(function () {
	function readUtm() {
		try {
			var url = new URL(window.location.href);
			return {
				source: url.searchParams.get("utm_source") || undefined,
				medium: url.searchParams.get("utm_medium") || undefined,
				campaign: url.searchParams.get("utm_campaign") || undefined,
			};
		} catch (error) {
			return {};
		}
	}

	function pushTracking(eventName, value, listingId) {
		var utm = readUtm();
		var payload = {
			event: eventName,
			value: value,
			listing_id: listingId,
			source: utm.source,
			medium: utm.medium,
			campaign: utm.campaign,
			timestamp: new Date().toISOString(),
		};

		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push(payload);

		if (typeof window.fbq === "function") {
			window.fbq("trackCustom", eventName, payload);
		}

		if (typeof window.gtag === "function") {
			window.gtag("event", eventName, payload);
		}
	}

	window.SBYS = window.SBYS || {};
	window.SBYS.track = pushTracking;

	document.addEventListener("DOMContentLoaded", function () {
		pushTracking("page_view");

		var ctaButtons = document.querySelectorAll("[data-track-cta]");
		ctaButtons.forEach(function (button) {
			button.addEventListener("click", function () {
				var listingId = button.getAttribute("data-listing-id") || undefined;
				pushTracking("lead", 1, listingId);
			});
		});
	});
})();
