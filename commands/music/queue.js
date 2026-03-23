const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show music queue'),

    async execute(interaction) {
        const player = interaction.client.manager.players.get(interaction.guild.id);

        if (!player || !player.queue.current) {
            return interaction.reply("No music playing.");
        }

        const current = player.queue.current;
        const tracks = player.queue.tracks.slice(0, 10);

        let desc = `🎵 Now Playing:\n${current.info.title}\n\n`;

        if (tracks.length > 0) {
            desc += "📜 Queue:\n";
            tracks.forEach((t, i) => {
                desc += `${i + 1}. ${t.info.title}\n`;
            });
        }

        await interaction.reply(desc);
    }
};