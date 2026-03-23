const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current track'),

    async execute(interaction) {
        const player = interaction.client.manager.players.get(interaction.guild.id);

        if (!player || !player.queue.current) {
            return interaction.reply("No track playing.");
        }

        player.skip();

        await interaction.reply("Skipped.");
    }
};