const { SlashCommandBuilder } = require('discord.js');
const queue = require('../../queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song'),

    async execute(interaction) {
        const serverQueue = queue.get(interaction.guild.id);

        if (!serverQueue) {
            return interaction.reply({
                content: "Queue is empty",
                ephemeral: true
            });
        }

        serverQueue.player.stop();

        interaction.reply("Skip");
    }
};