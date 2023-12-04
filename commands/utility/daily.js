const { SlashCommandBuilder, User } = require('discord.js');
const { Users, CurrencyShop } = require('../../utils/dbObjects.js');

module.exports = {
    cooldown: 86400,
	data: new SlashCommandBuilder()
	.setName('daily')
	.setDescription(`Receive a daily allotment of coins!`),

	async execute(interaction) {
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        const rand = Math.floor(Math.random() * 10) + 1;
		if(user) {
            user.balance += rand;
            user.save();
			await interaction.reply({content: `Added ${rand} coins. You currently have ${user.balance} Schmekels`, ephemeral: true});
		}
		else {
            user.save();
			await interaction.reply({content: "You do not currently have a balance.", ephemeral: true});
		}
	}
};