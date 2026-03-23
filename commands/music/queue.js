const { SlashCommandBuilder } = require('discord.js');
const queue = require('../../queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show current queue'),

    async execute(interaction) {
        const serverQueue = queue.get(interaction.guild.id);

        if(!serverQueue || serverQueue.songs.length === 0) {
            return interaction.reply({
                content: "Queue is empty.",
                ephemeral: true
            });
        }

        const songs = serverQueue.songs.slice(0, 10);

        const list = songs
            .map((song, i) => {
                if(i === 0) return `Now : ${song.url}`;
                return `${i}. ${song.url}`;
            })
            .join('\n');

        const more = serverQueue.songs.length > 10
            ? `\n.. more ${serverQueue.songs.length - 10} tracks`
            : '';

        interaction.reply(list + more);
    }
};