// Leitet zum Strava-Login weiter
module.exports = (req, res) => {
  const host = req.headers.host;
  const proto = host.startsWith("localhost") ? "http" : "https";
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID,
    redirect_uri: `${proto}://${host}/api/callback`,
    response_type: "code",
    approval_prompt: "auto",
    scope: "read,activity:read_all",
  });
  res.writeHead(302, { Location: "https://www.strava.com/oauth/authorize?" + params });
  res.end();
};
