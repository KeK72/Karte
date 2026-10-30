// Holt alle Aktivitäten mit Routenlinie von Strava
module.exports = async (req, res) => {
  const send = (code, obj) => {
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(obj));
  };
  const m = (req.headers.cookie || "").match(/(?:^|; )refresh=([^;]+)/);
  if (!m) return send(401, { error: "login" });

  const t = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: m[1],
    }),
  });
  const tok = await t.json();
  if (!tok.access_token) return send(401, { error: "login" });

  const secure = req.headers.host.startsWith("localhost") ? "" : "; Secure";
  res.setHeader("Set-Cookie", `refresh=${tok.refresh_token}; HttpOnly; Path=/; Max-Age=31536000; SameSite=Lax${secure}`);

  const out = [];
  for (let page = 1; page <= 15; page++) {
    const r = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=200&page=${page}`, {
      headers: { Authorization: "Bearer " + tok.access_token },
    });
    if (!r.ok) {
      if (!out.length) return send(r.status === 429 ? 429 : 502, { error: "strava", status: r.status });
      break;
    }
    const a = await r.json();
    if (!Array.isArray(a) || !a.length) break;
    for (const x of a) {
      if (x.map && x.map.summary_polyline) {
        out.push({
          id: x.id, name: x.name, type: x.sport_type || x.type, date: x.start_date_local,
          dist: x.distance, time: x.moving_time, up: x.total_elevation_gain, line: x.map.summary_polyline,
        });
      }
    }
    if (a.length < 200) break;
  }
  res.setHeader("Cache-Control", "private, max-age=300");
  send(200, out);
};
