(function () {
  var consentKey = 'kodex_cookie_consent';
  var acceptedValue = 'accepted';
  var rejectedValue = 'rejected';

  function loadPostHog() {
    if (window.kodexPostHogLoaded) return;
    window.kodexPostHogLoaded = true;

    !function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="Di ji init en nn Ar tn an Yi capture calculateEventProperties dn register register_once register_for_session unregister unregister_for_session gn getFeatureFlag getFeatureFlagPayload getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync mn identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags reset reset setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty fn hn createPersonProfile setInternalOrTestUser pn Ji opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing un debug $r vn getPageViewId captureTraceFeedback captureTraceMetric Zi".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

    posthog.init('phc_wXbSUBpPG7ehdUTP8UQ3CbmLv259p77YuDorjr7pbqUW', {
      api_host: 'https://eu.i.posthog.com',
      defaults: '2026-05-30',
      person_profiles: 'identified_only'
    });
  }

  function captureKodexEvent(name, properties) {
    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(name, properties || {});
    }
  }

  function removeBanner() {
    var banner = document.querySelector('.cookie-banner');
    if (banner) banner.remove();
  }

  function setConsent(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {}

    removeBanner();

    if (value === acceptedValue) {
      loadPostHog();
      captureKodexEvent('cookie_consent_accepted', { page: window.location.pathname });
    }
  }

  function getConsent() {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  }

  function privacyHref() {
    return window.location.pathname.indexOf('/books/') === 0 ? '../privacy.html#cookies' : 'privacy.html#cookies';
  }

  function renderBanner() {
    if (document.querySelector('.cookie-banner')) return;

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Съгласие за cookies');
    banner.innerHTML = '' +
      '<div class="cookie-banner__content">' +
        '<h2>Използваме cookies</h2>' +
        '<p>Те ни помагат да разберем кои страници са полезни и да подобряваме сайта. Ако продължите с „ОК“, ще включим тази аналитика.</p>' +
        '<a class="cookie-banner__link" href="' + privacyHref() + '">Повече информация</a>' +
      '</div>' +
      '<div class="cookie-banner__actions">' +
        '<button type="button" class="button secondary" data-cookie-choice="reject">Не сега</button>' +
        '<button type="button" class="button copper" data-cookie-choice="accept">ОК</button>' +
      '</div>';

    document.body.appendChild(banner);
  }

  window.kodexCookieConsent = {
    accept: function () { setConsent(acceptedValue); },
    reject: function () { setConsent(rejectedValue); },
    reset: function () {
      try { window.localStorage.removeItem(consentKey); } catch (error) {}
      window.location.reload();
    },
    status: getConsent
  };

  document.addEventListener('click', function (event) {
    var cookieChoice = event.target.closest('[data-cookie-choice]');
    if (cookieChoice) {
      setConsent(cookieChoice.dataset.cookieChoice === 'accept' ? acceptedValue : rejectedValue);
      return;
    }

    var tracked = event.target.closest('[data-cta], [data-track-event]');
    if (!tracked) return;

    var eventName = tracked.dataset.trackEvent || 'kodex_cta_click';
    captureKodexEvent(eventName, {
      cta: tracked.dataset.cta || tracked.textContent.trim(),
      book: tracked.dataset.book || null,
      href: tracked.href || null,
      page: window.location.pathname
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      getConsent() === acceptedValue ? loadPostHog() : getConsent() === rejectedValue ? null : renderBanner();
    });
  } else {
    getConsent() === acceptedValue ? loadPostHog() : getConsent() === rejectedValue ? null : renderBanner();
  }
})();
