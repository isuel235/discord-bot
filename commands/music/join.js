const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join a bot into voice channel'),

    async execute(interaction) {
        const channel = interaction.member.voice.channel;

        if(!channel) {
            return interaction.reply("You are not in voice channel");
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        await interaction.reply("Joined into voice channel.");
    }
}