const {Instance} = require('../index');
const HelpCommand = require("./testCommand");

let c = require('dotenv').config();

let a = new Instance({
    token: c.parsed.DISCORD_TOKEN,
    client_id: c.parsed.DISCORD_CLIENT_ID,
    client_secret: c.parsed.DISCORD_CLIENT_SECRET,
    public_key: c.parsed.DISCORD_PUBKEY,
});

a.commands.add(HelpCommand)
a.start();
