const { SlashCommandBuilder } = require('@discordjs/builders');
class Command {

    static _type = 'SlashCommand';

    name = "test";
    description = "test";
    #builder;

    toJSON(){
        if(!this.#builder){
            this.#builder = new SlashCommandBuilder().setName(this.name).setDescription(this.description);
        }
        return this.#builder.toJSON();
    }

    trigger(Interaction){

    }

}

module.exports = Command;