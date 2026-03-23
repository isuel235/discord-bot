const { SlashCommandBuilder } = require('discord.js');
const queue = require('../../queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('repeat current track'),

    async execute(interaction) {
        const serverQueue = queue.get(interaction.guild.id);

        if(!serverQueue) {
            return interaction.reply({
                content: "There is no track playing",
                ephemeral: true
            });
        }

        serverQueue.repeat = !serverQueue.repeat;
        if(serverQueue.repeat) {
            serverQueue.loop = false;
        } 
        interaction.reply(`Repeat ${serverQueue.repeat ? "ON" : "OFF"}`);
    }
};