const { SlashCommandBuilder, User, PermissionFlagsBits } = require('discord.js');
const { Users, CurrencyShop } = require('../../utils/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('addcoins')
	.setDescription('Force add a small number of Schmekels to a user')
    .addUserOption(option =>
        option
        .setName('target')
        .setDescription('The member to add Schmekels to.')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
        const target = interaction.options.getUser('target');
        var user = await Users.findOne({ where: { user_id: target.id } });
        if(!user) {
            const user = await Users.create({ user_id: target.id, balance: 10 });
        }
        const rand = Math.floor(Math.random() * 10) + 1;
		if(user) {
            user.balance += rand;
            user.save();
			await interaction.reply({content: `You have had ${rand} Schmekels added to your balance.`, ephemeral: true});
		}
		else {
            user.save();
			await interaction.reply({content: "You do not currently have a balance.", ephemeral: true});
		}
	}
};