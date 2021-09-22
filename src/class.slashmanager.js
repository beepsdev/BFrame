const fs = require('fs-extra');
const crypto = require('crypto');
const { REST } = require('@discordjs/rest');
const {Routes} = require("discord-api-types/v9");

class SlashManager {

    path = './tmp/commands.json';

    commands = {};
    hashes = {};
    client;
    rest;

    constructor(client) {
        fs.ensureFileSync(this.path)
        this.refreshHashes();
        this.client = client;
        this.rest = new REST({ version: '9' }).setToken(this.client.token);

        this.interval = setInterval(this.update.bind(this), 1000)

        this.client.on('interactionCreate', data => {
            data.forEach( dataEntry => {
                if(dataEntry.isCommand()){
                    if(this.commands[dataEntry.commandName]){
                        let x = new this.commands[dataEntry.commandName]();
                        x.trigger(dataEntry);
                    }
                }
            })
        })

    }

    update(){

        let needs_refresh = false;
        const keys = Object.keys(this.commands)
        for(let key in keys){

            let instance = new this.commands[keys[key]]();
            let newhash = crypto.createHash('md5').update(JSON.stringify(instance.toJSON())).digest("hex");

            if(newhash !== this.hashes[keys[key]]){
                this.hashes[keys[key]] = newhash;
                needs_refresh = true;
            }
        }

        if(needs_refresh){

            const new_commands = Object.values(this.commands).map(command => new command().toJSON());
            this.rest.put(Routes.applicationCommands(this.client.instance.DISCORD_CLIENT_ID), { body: new_commands })
                .then(() => console.log('Successfully registered application commands.'))
                .catch(console.error);

            this.rest.put(Routes.applicationGuildCommands(this.client.instance.DISCORD_CLIENT_ID, '720345137460412476'), { body: new_commands })
                .then(() => console.log('Successfully registered application commands.'))
                .catch(console.error);

            this.saveHashes();
        }



    }

    /**
     * Reloads hashes from disk.
     */
    refreshHashes(){
        try{
            this.hashes = fs.readJsonSync(this.path);
            if(this.hashes === ''){
                this.hashes = {};
            }
        }catch(ex){
            this.hashes = {};
        }
    }

    /**
     * Reloads hashes from disk.
     */
    saveHashes(){
        fs.writeJsonSync(this.path, this.hashes);
    }

    /**
     * @param newCommand Command
     */
    add(newCommand){

        if(newCommand._type === 'SlashCommand'){
            this.commands[new newCommand().name] = newCommand;
        }else{
            throw new Error('Command not instace of Command');
        }

    }

    /**
     * @param trigger string
     * @returns {*}
     */
    get(trigger){
        return this.commands[trigger];
    }

}

module.exports = SlashManager;