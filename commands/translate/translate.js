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
        const dest = interaction.options.getString('dest');

        try {

            const response = await fetch("https://papago.apigw.ntruss.com/langs/v1/dect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-ncp-apigw-api-key-id": X_NAVER_CLIENT_ID,
                    "x-ncp-apigw-api-key": X_NAVER_CLIENT_SECRET
                },
                body: new URLSearchParams({
                    query: text
                })
            });

            const data = await response.json();
            const src = data.langCode;

            const trans = await fetch("https://papago.apigw.ntruss.com/nmt/v1/translation", {
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

            const datas = await trans.json();

            const translated = datas.message.result.translatedText;

            await message.channel.send(`${translated}`);

        } catch(error) {
            console.error(error);
            await message.reply("Error");
        }
    },
};