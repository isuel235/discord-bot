const { SlashCommandBuilder } = require('discord.js');
const { X_NAVER_CLIENT_ID, X_NAVER_CLIENT_SECRET } = require('../../config.json');

const data = new SlashCommandBuilder()
    .setName('koja')
    .setDescription('Translate Korean to Japanese.')
    .addStringOption((option) => 
        option
            .setName('text')
            .setDescription('Korean Text')
            .setRequired(true)    
    );

module.exports = {
    data,
    async execute(interaction) {

        const text = interaction.options.getString('text');

        try {

            const response = await fetch("https://papago.apigw.ntruss.com/nmt/v1/translation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-ncp-apigw-api-key-id": X_NAVER_CLIENT_ID,
                    "x-ncp-apigw-api-key": X_NAVER_CLIENT_SECRET
                },
                body: new URLSearchParams({
                    source: "ko",
                    target: "ja",
                    text: text
                })
            });

            const data = await response.json();

            //console.log(data);

            const translated = data.message.result.translatedText;

            await interaction.reply(`${text} >> ${translated}`);

        } catch (error) {
            console.error(error);
            await interaction.reply("Error");
        }

    },
};