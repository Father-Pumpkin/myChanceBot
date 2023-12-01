module.exports = {
	name: 'help',
	description: 'Prints a message with a list of possible commands.',
	execute(message, args) {
		message.channel.send('coin [heads/tails], ping');
	},
};