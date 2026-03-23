const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle queue'),

    async execute(interaction) {
        const player = interaction.client.manager.players.get(interaction.guild.id);

        if (!player || player.queue.tracks.length === 0) {
            return interaction.reply("Queue is empty.");
        }

        // Fisher-Yates shuffle
        for (let i = player.queue.tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [player.queue.tracks[i], player.queue.tracks[j]] =
                [player.queue.tracks[j], player.queue.tracks[i]];
        }

        await interaction.reply("Queue shuffled.");
    }
};