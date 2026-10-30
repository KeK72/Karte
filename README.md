# Meine Fahrten (Beeline → Strava → Karte)

Zeigt alle deine Strava-Fahrten als Heatmap auf einer verschiebbaren Karte. Je öfter eine Strecke gefahren wurde, desto kräftiger leuchtet sie.

## 1. Strava-API-Anwendung anlegen
Auf https://www.strava.com/settings/api eine Anwendung anlegen.
- Authorization Callback Domain: `localhost` (zum Testen) bzw. später `deinprojekt.vercel.app` (ohne https://)
- Notiere **Client ID** und **Client Secret**. Das Secret niemals weitergeben.

## 2a. Lokal testen
1. Node.js installieren (https://nodejs.org, LTS-Version)
2. Im Projektordner im Terminal: `npm install -g vercel`
3. Datei `.env.example` kopieren zu `.env` und Client ID und Secret eintragen
4. `vercel dev` starten, danach http://localhost:3000 öffnen

## 2b. Auf Vercel veröffentlichen
1. Projekt auf GitHub hochladen (neues Repository, Dateien hineinziehen)
2. Auf vercel.com mit GitHub anmelden, „Add New Project“, Repository wählen, „Deploy“
3. In Vercel unter Settings → Environment Variables eintragen:
   `STRAVA_CLIENT_ID` und `STRAVA_CLIENT_SECRET`, danach neu deployen
4. Bei Strava die Callback Domain auf deine Vercel-Adresse ändern

## Hinweise
- Beeline lädt Fahrten nicht automatisch hoch: Am Ende der Fahrt in der Zusammenfassung auf den Strava-Button tippen.
- Es werden die letzten bis zu 3000 Aktivitäten geladen.
- Kartenhintergrund: OpenStreetMap und CARTO (für den privaten Gebrauch in Ordnung, bei viel Verkehr eigenen Anbieter wie MapTiler nutzen).
