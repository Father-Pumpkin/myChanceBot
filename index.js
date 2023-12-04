// Imports and Inits
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { clientId, guildId, token } = require('./config.json');
const { Client, GatewayIntentBits, Partials, Collection, Events, User } = require('discord.js');
const { Op } = require('sequelize');
const { Users, CurrencyShop } = require('./utils/dbObjects.js');


const currency = new Collection();

const prefix = process.env.PREFIX;
const client = new Client({ intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel], });;

client.commands = new Collection();
client.cooldowns = new Collection();

// Helper functions for managing user balances
async function createNewUser(id) {
	const user = currency.get(id);

	// Check if user already exists
	if (user) {
		return;
	}

	const newUser = await Users.create({ user_id: id, balance: 10 });
	currency.set(id, newUser);

	return newUser;
}


// Read in all different command files in the commands folder
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}



// Announce login and ready to go
client.once(Events.ClientReady, async readyClient => {
    const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));

    console.log(`Logged in as ${readyClient.user.tag}!`);
    
});

// Retrieve Slash Commands
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;
});

// On message created event
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	createNewUser(interaction.id);

	// Handle commands that have a cooldown
	const { cooldowns } = interaction.client;
	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3; // default to avoid users spamming commands
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}
	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});



// Should remain final line 
client.login(token);