const express = require("express"), app = express(), config = require("./config.json");
const oauth = require("discord-oauth2"), client = new oauth({
  clientId: config.client_id,
  clientSecret: config.client_secret,
  redirectUri: config.redirect_url
})

const fs = require("fs"), html = fs.readFileSync("./webpage.html", "utf8")

app.get("/", async (request, response) => {
  if (!request.query.code) return response.redirect(`https://discord.com/api/oauth2/authorize?client_id=${config.client_id}&redirect_uri=${config.redirect_url.replace(/:/g, "%3A").replace(/\//g, "%2F")}&response_type=code&scope=guilds`)
  client.tokenRequest({
    clientId: config.client_id,
    clientSecret: config.client_secret,
    code: request.query.code,
    scope: "guilds",
    grantType: "authorization_code",
    redirectUri: config.redirect_url
  }).then(data => client.getUserGuilds(data.access_token).then(guilds => response.status(200).send(html.replace(/{{GUILDS}}/g, guilds.length))))
})

app.listen(config.port);