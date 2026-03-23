const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Youtube / SoundCloud URL')
                .setRequired(true)
        ),

    async execute(interaction) {
        const url = interaction.options.getString('url');
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply("You are not in voice channel");
        }

        const manager = interaction.client.manager;

        let player = manager.players.get(interaction.guild.id);

        if (!player) {
            player = await manager.createPlayer({
                guildId: interaction.guild.id,
                voiceChannelId: channel.id,
                textChannelId: interaction.channel.id,
            });

            await player.connect();
        }

        const res = await manager.search({
            query: url,
            source: "ytsearch"
        });

        if (!res.tracks.length) {
            return interaction.reply("No results found.");
        }

        const track = res.tracks[0];

        player.queue.add(track);

        await interaction.reply(`Added to queue: ${track.info.title}`);

        if (!player.playing && !player.paused) {
            player.play();
        }
    }
};