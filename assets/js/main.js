/* Mein Schuhmacher — Mobilmenü, Öffnungsstatus, Einblendungen */

(function () {
  'use strict';

  /* ---- Mobilmenü ---- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        toggle.focus();
      }
    });
  }

  /* ---- Öffnungszeiten: Mo–Fr 9–13 & 14–18, Sa 9–13, So zu ---- */
  var PLAN = {
    1: [[540, 780], [840, 1080]],
    2: [[540, 780], [840, 1080]],
    3: [[540, 780], [840, 1080]],
    4: [[540, 780], [840, 1080]],
    5: [[540, 780], [840, 1080]],
    6: [[540, 780]],
    0: []
  };
  var TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Sonnabend'];

  function hamburgJetzt() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var teil = {};
      f.forEach(function (p) { teil[p.type] = p.value; });
      var wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[teil.weekday];
      return { tag: wd, min: parseInt(teil.hour, 10) * 60 + parseInt(teil.minute, 10) };
    } catch (err) {
      var d = new Date();
      return { tag: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function hhmm(min) {
    return String(Math.floor(min / 60)) + ':' + String(min % 60).padStart(2, '0');
  }

  function kurz(min) {
    return min % 60 === 0 ? String(min / 60) : hhmm(min);
  }

  function spannenText(spannen) {
    return spannen.map(function (s) { return kurz(s[0]) + '–' + kurz(s[1]); }).join(' · ');
  }

  var jetzt = hamburgJetzt();
  var heute = PLAN[jetzt.tag];

  var offen = heute.some(function (s) { return jetzt.min >= s[0] && jetzt.min < s[1]; });

  // Status-Pille im Header
  var status = document.querySelector('[data-status]');
  var dot = document.querySelector('[data-status-dot]');
  var text = document.querySelector('[data-status-text]');

  if (status && dot && text) {
    if (offen) {
      var bis = heute.find(function (s) { return jetzt.min >= s[0] && jetzt.min < s[1]; })[1];
      text.textContent = 'Jetzt geöffnet · bis ' + hhmm(bis);
      dot.classList.add('is-open');
    } else {
      var naechste = null;
      for (var i = 0; i < 8 && !naechste; i++) {
        var tag = (jetzt.tag + i) % 7;
        var spannen = PLAN[tag];
        for (var j = 0; j < spannen.length; j++) {
          if (i > 0 || spannen[j][0] > jetzt.min) {
            naechste = { tag: tag, start: spannen[j][0], heute: i === 0 };
            break;
          }
        }
      }
      text.textContent = naechste
        ? 'Geschlossen · öffnet ' + (naechste.heute ? '' : TAGE[naechste.tag] + ' ') + hhmm(naechste.start)
        : 'Zurzeit geschlossen';
      dot.classList.add('is-closed');
    }
    status.hidden = false;
  }

  // Zeile "Heute" in der Hero-Karte
  var heuteTag = document.querySelector('[data-today-day]');
  if (heuteTag) heuteTag.textContent = TAGE[jetzt.tag];

  var heuteZeile = document.querySelector('[data-today-hours]');
  if (heuteZeile) {
    heuteZeile.textContent = heute.length ? spannenText(heute) + ' Uhr' : 'Heute geschlossen';
  }

  // Heutige Zeile in der Öffnungszeiten-Tabelle hervorheben
  Array.prototype.forEach.call(document.querySelectorAll('.hours tr[data-day]'), function (tr) {
    if (tr.getAttribute('data-day').split(' ').indexOf(String(jetzt.tag)) !== -1) {
      tr.classList.add('is-today');
    }
  });

  /* ---- Jahr in der Fußzeile ---- */
  var jahr = document.querySelector('[data-year]');
  if (jahr) jahr.textContent = new Date().getFullYear();

  /* ---- Einblenden beim Scrollen ---- */
  var reduziert = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ziele = document.querySelectorAll('.reveal');

  if (reduziert || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(ziele, function (el) { el.classList.add('is-in'); });
    return;
  }

  var beobachter = new IntersectionObserver(function (eintraege, obs) {
    eintraege.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var gruppe = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(gruppe, 5) * 70 + 'ms';
      el.classList.add('is-in');
      obs.unobserve(el);
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });

  Array.prototype.forEach.call(ziele, function (el) { beobachter.observe(el); });
})();
