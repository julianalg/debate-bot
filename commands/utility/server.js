const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Provides information about the bot.'),
	async execute(interaction) {
		const uptimeSeconds = process.uptime();
		const hours = Math.floor(uptimeSeconds / 3600);
		const minutes = Math.floor((uptimeSeconds % 3600) / 60);
		const seconds = Math.floor(uptimeSeconds % 60);
		const uptimeString = `Uptime: ${hours}h ${minutes}m ${seconds}s`;

		await interaction.reply(
			`Debate Bot version v0.1.0 \n` +
			`Created by your friends at [MarauderTech 9573](https://marauder.tech/) \n` +
			`APIs/Sources: [News API](https://newsapi.org/) (for news stories), [OpenAI](https://openai.com/) (for summaries/implications), [SerpAPI](https://serpapi.com/) (for related links)\n` +
			`This bot uses generative AI to create summaries, which could lead to inaccuracies. Always double check and look for original sources. \n` +
			`This bot is open source and available on [GitHub](https://github.com/julianalg/debate-bot) \n` +
			`Uptime: ${uptimeString}`
		);
	},
};