const { SlashCommandBuilder } = require('discord.js');
const { Users, CurrencyShop } = require('../../utils/dbObjects.js');

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
            ))
    .addIntegerOption(option => 
        option.setName('wager')
			.setDescription('How many Schmekels are you wagering?')
			.setRequired(false)
            .setMinValue(0)),
	
    async execute(interaction) {
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        const wager = interaction.options.getInteger('wager') ?? 0;
        if(wager > user.balance) {
            var replyString = user.balance == 0 ? "No going into debt, you've already bet everything you own." : "That's more than you have to wager, try a smaller value!";
            return await interaction.reply({content: replyString, ephemeral: true});
        }
        const guess = interaction.options.getString('side');
		const rand = Math.random() * 2;
        const result = rand >= 1 ? 'heads' : 'tails';
        if(result == guess) {
            user.balance += wager;
            var replyString = `Congratulations! You got it correct. New balance is ${user.balance}`;
        }
        else {
            user.balance -= wager;
            var replyString = "Oh no, that guess wasn't correct. Better luck next time.";
        }

        user.save();
        await interaction.reply({content: replyString, ephemeral: true});
	}
};