const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const configPath = path.join(__dirname, '../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Set this channel as auto translate channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

	async execute(interaction) {

        const config = JSON.parse(fs.readFileSync(configPath));

        if (!config.translateChannels) {
            config.translateChannels = {};
        }

        const guildId = interaction.guild.id;
        const channelId = interaction.channel.id;

        config.translateChannels[guildId] = channelId;

        fs.writeFileSync(
            configPath,
            JSON.stringify(config, null, 2)
        );

        await interaction.reply("Auto translate channel set.");
	},
};