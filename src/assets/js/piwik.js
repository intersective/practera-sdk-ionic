var _paq = _paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
_paq.push(['trackAllContentImpressions']);

var currentUrl = location.href;
window.addEventListener('hashchange', function () {
  _paq.push(['setReferrerUrl', currentUrl]);
  currentUrl = '' + window.location.hash.substr(1);

  _paq.push(['setCustomUrl', currentUrl]);
  _paq.push(['setDocumentTitle', document.domain + '/' + document.title]);

  _paq.push(['setGenerationTimeMs', 0]);

  var content = document.getElementById('mainContainer');
  _paq.push(['MediaAnalytics::scanForMedia', content]);
  _paq.push(['FormAnalytics::scanForForms', content]);
  _paq.push(['trackContentImpressionsWithinNode', content]);
  _paq.push(['enableLinkTracking']);

  _paq.push(['enableHeartBeatTimer', 15]);

  _paq.push(['trackPageView']);
});

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
