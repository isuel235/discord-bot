const { SlashCommandBuilder } = require('discord.js');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus
} = require('@discordjs/voice');
const play = require('play-dl');

const queue = require('../../queue');

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
        const url = interaction.option.getString('url');
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply("You are not in voice channel");
        }

        let serverQueue = queue.get(interaction.guild.id);

        if (!serverQueue) {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();

            serverQueue = {
                connection,
                player,
                songs:[],
                loop: false,
                repeat: false
            };

            queue.set(interaction.guild.id, serverQueue);
        }

        if (play.yt_validate(url) === 'playlist') {
            const playlist = await play.playlist_info(url);
            const videos = await playlist.all_videos();

            for (const video of videos) {
                serverQueue.songs.push({ url: video.url });
            }

            interaction.reply(`Add playlist to queue (${videos.length}songs)`);

            if (serverQueue.songs.length === videos.length) {
                playNext(interaction.quild.id);
            }
        } else {
            serverQueue.songs.push({ url });

            interaction.reply(`Add song to queue (${url})`);

            if(serverQueue.songs.length === 1) {
                playNext(interaction.guild.id);
            }
        }
    }
};

async function playNext(guildId) {
    const serverQueue = queue.get(guildId);

    if(!serverQueue || serverQueue.songs.length === 0) {
        serverQueue?.connection.destroy();
        queue.delete(guildId);
        return;
    }

    const song = serverQueue.songs[0];

    try {
        const stream = await play.stream(song.url);

        const resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        });

        serverQueue.connection.subscribe(serverQueue.player);
        serverQueue.player.play(resource);
        
        console.log(`play : ${song.url}`);

        serverQueue.player.once(AudioPlayerStatus.Idle, () => {
            
            if(serverQueue.repeat) {
                playNext(guildId);
                return;
            }
            
            const finishedSong = serverQueue.songs.shift();
            
            if (serverQueue.loop && finishedSong) {
                serverQueue.songs.push(finishedSong);
            }

            playNext(guildId);
        });
    } catch (err) {
        console.log("error: ", err);
        serverQueue.songs.shift();
        playNext(guildId);
    }
}