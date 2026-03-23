const { SlashCommandBuilder } = require('discord.js');
const queue = require('../../queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuggle the queue'),

    async execute(interaction) {
        const serverQueue = queue.get(interaction.guild.id);
    
        if (!serverQueue || serverQueue.songs.length <= 1) {
            return interaction.reply({
                content: "Need more track.",
                ephemeral: true
            });
        }

        const current = serverQueue.songs[0];
        const rest = serverQueue.songs.slice(1);

        for (let i = rest.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rest[i], rest[j]] = [rest[j], rest[i]];
        }

        serverQueue.songs = [current, rest];

        interaction.reply("Shuffled");
    }
};