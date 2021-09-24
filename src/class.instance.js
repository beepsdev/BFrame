const events = require('events');
const { Client, Intents } = require('discord.js');

const Command = require("./class.command");
const SlashManager = require("./class.slashmanager");

class Instance extends events.EventEmitter {

    #DISCORD_TOKEN;
    DISCORD_CLIENT_ID;
    #DISCORD_CLIENT_SECRET;
    #DISCORD_PUBLIC_KEY;

    #client;
    commands;

    constructor(options){

        super();

        this.#DISCORD_TOKEN = options.token;
        this.DISCORD_CLIENT_ID = options.client_id;
        this.#DISCORD_CLIENT_SECRET = options.client_secret;
        this.#DISCORD_PUBLIC_KEY = options.public_key;

        this.#client = new Client({ intents: options.intents });
        this.#client.emit = this.emit;
        this.#client.instance = this;

        this.commands = new SlashManager(this.#client);

        this.#client.on('*', (event, ...data) => {
            this.emit(`client:${event}`, ...data)
        })
    }

    /**
     *  Starts the instance and logs it in to discord.
     */
    start(){
        this.emit('starting', this.#client);
        this.#client.login(this.#DISCORD_TOKEN);
    }

    emit(event, ...data) {
        super.emit('*', event, ...data);
        super.emit(event, data);
    }

}

module.exports = Instance;