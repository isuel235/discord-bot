const { SlashCommandBuilder } = require('discord.js');
const queue = require('../../queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop music'),

    async execute(interaction) {
        const serverQueue = queue.get(interaction.guild.id);

        if (!serverQueue) {
            return interaction.reply({
                content: "Queue is empty",
                ephemeral: true
            });
        }

        serverQueue.songs = [];
        serverQueue.player.stop();
        serverQueue.connection.destroy();

        queue.delete(interaction.guild.id);

        interaction.reply("Stop");
    }
}