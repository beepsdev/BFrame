const Command = require("../src/class.command");
const {CommandInteraction} = require('discord.js');

module.exports = class HelpCommand extends Command {

    constructor() {
        super();

        this.name = "testing";
        this.description = "todd would be proud :^)";

    }

    /**
     *
     * @param interaction CommandInteraction
     * @returns {string}
     */
    trigger(interaction){
        interaction.reply('the child')
    }

}

