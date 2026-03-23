const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leave voice channel'),

    async execute(interaction) {
        const player = interaction.client.manager.players.get(interaction.guild.id);

        if (!player) {
            return interaction.reply("Not connected.");
        }

        player.destroy();

        await interaction.reply("Disconnected.");
    }
};