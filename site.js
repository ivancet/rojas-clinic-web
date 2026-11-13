(function () {
  var LANG_KEY = "rojas_lang";
  var REDIRECT_KEY = "rojas_lang_redirected";
  var supported = {
    es: "/",
    en: "/en/",
    ca: "/ca/",
    fr: "/fr/",
    ru: "/ru/",
    de: "/de/",
    zh: "/zh/"
  };

  function readStorage(storage, key) {
    try {
      return storage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch (error) {
      // Storage may be unavailable (for example in private browsing).
    }
  }

  function languageCode(value) {
    var code = String(value || "").toLowerCase().split(/[-_]/)[0];
    return supported[code] ? code : null;
  }

  function isCrawler() {
    return /bot|crawler|spider|crawling|googlebot|bingbot|yandex|baidu|duckduck|slurp|facebookexternalhit|semrush|ahrefs|bytespider/i.test(navigator.userAgent || "");
  }

  function browserLanguage() {
    var languages = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language];

    for (var i = 0; i < languages.length; i += 1) {
      var code = languageCode(languages[i]);
      if (code) return code;
    }
    return null;
  }

  // Language detection is intentionally limited to the Spanish home URL.
  // Other language pages never bounce between locales.
  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  var storedLanguage = languageCode(readStorage(window.localStorage, LANG_KEY));
  if ((path === "/" || path === "/index.html") && !storedLanguage &&
      !isCrawler() &&
      !readStorage(window.sessionStorage, REDIRECT_KEY)) {
    var detectedLanguage = browserLanguage();
    if (detectedLanguage && detectedLanguage !== "es") {
      writeStorage(window.sessionStorage, REDIRECT_KEY, "1");
      window.location.replace(supported[detectedLanguage]);
      return;
    }
  }

  document.querySelectorAll(".lang-link").forEach(function (link) {
    link.addEventListener("click", function () {
      var selected = languageCode(link.getAttribute("hreflang"));
      if (selected) writeStorage(window.localStorage, LANG_KEY, selected);
    });
  });

  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
