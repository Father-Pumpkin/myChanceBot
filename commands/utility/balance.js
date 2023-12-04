const { SlashCommandBuilder, User } = require('discord.js');
const { Users, CurrencyShop } = require('../../utils/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('balance')
	.setDescription(`Whisper a user's current balance.`),

	async execute(interaction) {
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });

		if(user) {
			await interaction.reply({content: `You currently have ${user.balance} Schmekels`, ephemeral: true});
		}
		else {
			await interaction.reply({content: "You do not currently have a balance.", ephemeral: true});
		}
	}
};