const { SlashCommandBuilder } = require('discord.js');
const queue = require('../../queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('repeat queue'),

    async execute(interaction) {
        const serverQueue = queue.get(interaction.guild.id);

        if(!serverQueue) {
            return interaction.reply({
                content: "There is no track playing",
                ephemeral: true
            });
        }

        serverQueue.loop = !serverQueue.loop;
        if(serverQueue.loop) {
            serverQueue.repeat = false;
        }
        interaction.reply(`Loop ${serverQueue.loop ? "ON" : "OFF"}`);
    }
};