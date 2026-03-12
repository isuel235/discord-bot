const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const configPath = path.join(__dirname, '../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('unsetchannel')
        .setDescription('Disable auto translate channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

	async execute(interaction) {

        const config = JSON.parse(fs.readFileSync(configPath));

        if (!config.translateChannels) {
            config.translateChannels = {};
        }

        const guildId = interaction.guild.id;

        delete config.translateChannels[guildId];

        fs.writeFileSync(
            configPath,
            JSON.stringify(config, null, 2)
        );

        await interaction.reply("Auto translate channel disabled.");
	},
};