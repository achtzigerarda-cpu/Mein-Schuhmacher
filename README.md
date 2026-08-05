# Mein Schuhmacher — Website

Website für **Mein Schuhmacher — Schuh- und Schlüsseldienst + Sicherheitstechnik**,
Wedeler Landstraße 21, 22559 Hamburg.

Eine statische Seite ohne Baukasten und ohne Abhängigkeiten: HTML, CSS, etwas
JavaScript. Läuft auf jedem Webspace, der Dateien ausliefern kann.

## Lokal ansehen

```bash
python3 -m http.server 8912
```

Dann <http://localhost:8912/> im Browser öffnen.

## Aufbau

```
index.html              gesamte Seite (eine Datei)
assets/css/styles.css   Gestaltung
assets/js/main.js       Mobilmenü, Öffnungsstatus, Einblendungen
assets/fonts/           Fraunces und Inter Tight, lokal (SIL OFL 1.1)
assets/img/             Fotos aus Laden und Werkstatt
```

## Besonderheiten

- **Öffnungsstatus in Echtzeit:** Kopfzeile und Hero zeigen „Jetzt geöffnet · bis 18:00"
  bzw. „Geschlossen · öffnet Donnerstag 9:00", berechnet aus den Öffnungszeiten in
  Berliner Zeit. Der heutige Tag wird in der Öffnungszeiten-Tabelle hervorgehoben.
  Zeiten ändern: `PLAN` in `assets/js/main.js` und die Tabelle in `index.html`.
- **Keine externen Dienste.** Die Schriften liegen lokal, es gibt keine Verbindung zu
  Google Fonts und damit keine Übertragung von Besucher-IP-Adressen (DSGVO).
  Nur die Schaltflächen „Route öffnen" und „Bewertungen auf Google" führen — nach
  einem Klick — zu Google Maps.
- Getestet bei 375, 768, 1024 und 1440 Pixeln Breite.

## Offen vor dem Livegang

- [ ] **Impressum und Datenschutzerklärung** anlegen und in der Fußzeile verlinken
      (in Deutschland gesetzlich vorgeschrieben)
- [ ] Echten Google-Rezensions-Link (`https://g.page/r/…/review`) im Kontaktbereich
      eintragen — dort steht bisher ersatzweise eine Google-Maps-Suche
- [ ] Texte gegenlesen: „ohne Termin", „bezahlt wird bei der Abholung",
      „wir arbeiten mit ABUS und BASI", Stadtteil Rissen sowie die
      Leistungsbeschreibungen sind aus Flyer und Ladenfotos abgeleitet

## Schriften

Fraunces (Undercase Type) und Inter Tight (Rasmus Andersson), beide unter der
SIL Open Font License 1.1 — Lizenztexte in `assets/fonts/`.
