var _paq = _paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function () {
  var u = "//piwik.practera.com/";
  _paq.push(['setTrackerUrl', u + 'piwik.php']);
  var piwikID = '7';
  if (location.hostname.indexOf('pe.practera.com') !== -1) {
    piwikID = '6';
  }

  _paq.push(['setSiteId', piwikID]);
  var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
  g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = u + 'piwik.js'; s.parentNode.insertBefore(g, s);
})();
