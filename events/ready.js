const { Events } = require('discord.js');
const { getNews } = require('../news.js');
const { newsChannelId, newsInterval } = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// Fetch news on startup
		fetchAndSendNews(client);

		// Set an interval to fetch news periodically
		setInterval(() => fetchAndSendNews(client), newsInterval);
	},
};

async function fetchAndSendNews(client) {
	const channel = await client.channels.fetch(newsChannelId);
	if (channel) {
		const news = await getNews();
		channel.send(news);
	}
}
