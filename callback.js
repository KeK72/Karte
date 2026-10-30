// Tauscht den Strava-Code gegen Tokens und merkt sich den Refresh-Token in einem sicheren Cookie
module.exports = async (req, res) => {
  const code = new URL(req.url, "http://x").searchParams.get("code");
  if (!code) { res.writeHead(302, { Location: "/?fehler=login" }); return res.end(); }
  const r = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });
  const d = await r.json();
  if (!d.refresh_token) { res.writeHead(302, { Location: "/?fehler=token" }); return res.end(); }
  const secure = req.headers.host.startsWith("localhost") ? "" : "; Secure";
  res.setHeader("Set-Cookie", `refresh=${d.refresh_token}; HttpOnly; Path=/; Max-Age=31536000; SameSite=Lax${secure}`);
  res.writeHead(302, { Location: "/" });
  res.end();
};
