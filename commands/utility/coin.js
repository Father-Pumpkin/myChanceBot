const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('coin')
	.setDescription('Flips a coin and awards points if you guess the result correctly')
    .addStringOption(option =>
		option.setName('side')
			.setDescription('The side of the coin you are guessing')
			.setRequired(true)
            .addChoices(
				{ name: 'Heads', value: 'heads' },
				{ name: 'Tails', value: 'tails' },
            )),
	
    async execute(interaction) {
        const guess = interaction.options.getString('side');
		const rand = Math.random() * 2;
        console.log(rand);
        const result = rand >= 1 ? 'heads' : 'tails';
        if(result == 'heads') {
            var replyString = "Congratulations! You got it correct.";
        }
        else {
            var replyString = "Oh no, that guess wasn't correct. Better luck next time.";
        }

        await interaction.reply({content: replyString, ephemeral: true});
	}
};