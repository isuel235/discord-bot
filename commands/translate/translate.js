const { SlashCommandBuilder, GuildOnboardingPromptOption } = require('discord.js');
const { X_NAVER_CLIENT_ID, X_NAVER_CLIENT_SECRET } = require('../../config.json');

const data = new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate entered text.')
    .addStringOption((option) =>
        option
            .setName('text')
            .setDescription('Text')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('src')
            .setDescription("Source language")
            .setRequired(true)
            .addChoices(
                { name: 'Korean', value: 'ko'},
                { name: 'Japanese', value: 'ja'},
                { name: 'English', value: 'en'},
                { name: 'Chinese', value: 'zh-CN'}
            )
    )
    .addStringOption((option) =>
        option
            .setName('dest')
            .setDescription("Destination language")
            .setRequired(true)
            .addChoices(
                { name: 'Korean', value: 'ko'},
                { name: 'Japanese', value: 'ja'},
                { name: 'English', value: 'en'},
                { name: 'Chinese', value: 'zh-CN'}
            )
    );

module.exports = {
    data,
    async execute(interaction) {

        const text = interaction.options.getString('text');
        const src = interaction.options.getString('src');
        const dest = interaction.options.getString('dest');

        try{
            const response = await fetch("https://papago.apigw.ntruss.com/nmt/v1/translation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-ncp-apigw-api-key-id": X_NAVER_CLIENT_ID,
                    "x-ncp-apigw-api-key": X_NAVER_CLIENT_SECRET
                },
                body: new URLSearchParams({
                    source: src,
                    target: dest,
                    text: text
                })
            });

            const data = await response.json();

            //console.log(data);

            const translated = data.message.result.translatedText;

            await interaction.reply(`${text} >> ${translated}`);

        } catch(error) {
            console.error(error);
            await interaction.reply('Error');
        }
    },
};