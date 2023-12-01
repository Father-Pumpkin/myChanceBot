const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('help')
	.setDescription('Prints a message with a list of possible commands.'),

	async execute(interaction) {
		await interaction.reply({content: 'coin [heads/tails], ping', ephemeral: true});
	}
};