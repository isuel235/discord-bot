const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle queue loop'),

    async execute(interaction) {
        const player = interaction.client.manager.players.get(interaction.guild.id);

        if (!player || !player.queue.current) {
            return interaction.reply({
                content: "There is no track playing",
                ephemeral: true
            });
        }

        player.setLoop(player.loop === "queue" ? "none" : "queue");

        await interaction.reply(`Loop ${player.loop === "queue" ? "ON" : "OFF"}`);
    }
};