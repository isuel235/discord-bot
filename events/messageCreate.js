const { Events, MessageFlags } = require('discord.js');
const { X_NAVER_CLIENT_ID, X_NAVER_CLIENT_SECRET } = require("../config.json");
const fs = require('node:fs');
const path = require('node:path');

const configPath = path.join(__dirname, "../config.json");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        if(message.author.bot) return;
        if(!message.guild) return;
        if(message.webhookId) return;

        const config = JSON.parse(fs.readFileSync(configPath));

        if(!config.translateChannels) return;

        const guildId = message.guild.id;
        const channelId = message.channel.id;

        if(config.translateChannels[guildId] !== channelId) return;

        const text = message.content;

        if(!text) return;
        if(text.startsWith("http")) return;
        if(text.startsWith("/")) return;

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

            let dest;

            if(src === "ko") {
                dest = "ja";
            } else {
                dest = "ko";
            }

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