const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Repeat current track'),

    async execute(interaction) {
        const player = interaction.client.manager.players.get(interaction.guild.id);

        if (!player || !player.queue.current) {
            return interaction.reply("No track playing.");
        }

        player.setLoop(player.loop === "track" ? "none" : "track");

        await interaction.reply(`Repeat ${player.loop === "track" ? "ON" : "OFF"}`);
    }
};