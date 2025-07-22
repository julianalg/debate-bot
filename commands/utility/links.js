const { SlashCommandBuilder } = require('discord.js');
const { getLastArticle } = require('../../news.js');
const { getJson } = require('serpapi');
const { googleAPI } = require('../../config.json');

function getJsonAsync(params) {
  return new Promise((resolve, reject) => {
    getJson(params, (data) => {
      if (data.error) reject(new Error(data.error));
      else resolve(data);
    });
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('links')
    .setDescription('Replies with important links!'),
  async execute(interaction) {
    const article = getLastArticle();
    if (!article) {
      return interaction.reply({
        content: 'An error has occurred. Try again later.',
        ephemeral: true,
      });
    }

    // Give yourself time (Discord requires a response within 3s)
    await interaction.deferReply({ ephemeral: false });

	const words = article.title.split(' ').slice(0, 4);
	const shuffled = words.sort(() => Math.random() - 0.5);
	const title = shuffled.join(' ');
	console.log(`Searching for links related to: ${title}`);

    try {
	const json = await getJsonAsync({
	  api_key: googleAPI,   // <- don’t hardcode keys
	  engine: 'google',
	  q: `"${title}"`,
	  google_domain: 'google.com',
	  gl: 'us',
	  hl: 'en',
	});

	// Disable embeds by setting allowedMentions and flags
	interaction.editReply({
	  content: `Here are some links related to the last article:\n${
		json.organic_results?.map(r => `${r.title}(${r.link})`).join('\n') || 'No links found.'
	  }`,
	  allowedMentions: { parse: [] },
	  flags: 4096 // Suppress Embeds
	});
	// Return to prevent double reply
    } catch (err) {
      console.error(err);
      await interaction.editReply('Error fetching links.' + err.message);
    }
  },
};
