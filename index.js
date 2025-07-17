// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token, newsKey } = require('./config.json');
const express = require('express');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});


// Log in to Discord with your client's token
client.login(token);
callApi();

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});


async function callApi() {
    // The URL of the API endpoint.
    // This should be the same endpoint your Node.js server (from the first example) is hosting.
    const apiUrl = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=' + newsKey;

    console.log(`Attempting to call API at: ${apiUrl}`);

    try {
        // 1. Use the `fetch()` function to make the network request.
        // `fetch` is available globally in Node.js v18+ and later.
        // For older versions, you might use a library like 'axios' or 'node-fetch'.
        const response = await fetch(apiUrl);

        // 2. Check if the response was successful (status code 200-299).
        // If not, throw an error to be caught by the catch block.
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 3. Parse the response body as JSON.
        // The .json() method is also asynchronous.
        const data = await response.json();

        // 4. Display the data in the console.
        // We use console.log because there is no browser or DOM in a Node.js script.
        console.log('\n--- API Response Received ---');
        console.log(data);
        console.log('---------------------------\n');


    } catch (error) {
        // 5. If any error occurs during the fetch or parsing, catch it here.
        console.error('\n--- Error Fetching API ---');
        console.error(error.message);
        console.error('Please ensure the Node.js server is running and accessible at the specified URL.');
        console.error('--------------------------\n');
    }
}
