const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('links')
		.setDescription('Replies with important links!'),
	async execute(interaction) {
		// TODO: Implement the command
	},
};
