module.exports = (req, res) => {
  res.setHeader("Set-Cookie", "refresh=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
  res.writeHead(302, { Location: "/" });
  res.end();
};
