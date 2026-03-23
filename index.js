const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { DISCORD_API, APPLICATION_ID, GUILD_ID, X_NAVER_CLIENT_ID, X_NAVER_CLIENT_SECRET} = require('./config.json');
const { LavalinkManager } = require('lavalink-client')

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildVoiceStates
]});

const manager = new LavalinkManager({
	nodes: [
		{
			id: "main",
			host: "127.0.0.1",
			port: 2333,
			authorization: "1234"
		}
	],
	sendToShard: (guildId, payload) => {
		const guild = client.guilds.cache.get(guildId);
		if(guild) guild.shard.send(payload);
	}
});

client.manager = manager;
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on("clientReady", ()=> {
	console.log(`Logged in as ${client.user.tag}`);
	manager.init(client.user.id);
});

manager.on("nodeConnect", node => {
    console.log("✅ Lavalink connected:", node.id);
});

manager.on("nodeDisconnect", (node) => {
    console.log("❌ Lavalink disconnected:", node.id);
});

manager.on("nodeError", (node, error) => {
    console.log("💥 Lavalink error:", error.message);
});

client.login(DISCORD_API);