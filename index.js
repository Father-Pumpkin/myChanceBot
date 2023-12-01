// Imports and Inits
const fs = require('fs');
require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const prefix = process.env.PREFIX;
const client = new Client({ intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel], });;

client.commands = new Collection();

// Read in all different command files in the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
    // console.log(command.name); check that all commands are registered
}



// Announce login and ready to go
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// On message created event
client.on('messageCreate', (msg) => {
    // Check that the message is a command from the user
    if (msg.content.indexOf(prefix) !== 0 || msg.author.bot) {
        //console.log(`Message not for me! ${msg.content.indexOf(prefix)}`);
        return;
    }

    // Trim off the prefix and split the args out
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Check if the command actually exists
    if(!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('There was an error trying to execute this command. Type "!chance help" for a list of valid commands!');
    }
});



// Should remain final line 
client.login(process.env.CLIENT_TOKEN);