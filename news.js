const { newsAPIKey } = require('./config.json');


async function getNews() {
    // The URL of the API endpoint.
    // This should be the same endpoint your Node.js server (from the first example) is hosting.
    const apiUrl = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=' + newsAPIKey;

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
        const firstArticle = data.articles && data.articles.length > 0 ? data.articles[0] : null;
        const firstArticleTitle = firstArticle ? firstArticle.title : 'No articles found';
        const firstArticleDescription = firstArticle ? firstArticle.description : 'No description available';


        // 4. Display the data in the console.
        // We use console.log because there is no browser or DOM in a Node.js script.
        console.log('\n--- API Response Received ---');
        console.log(data);
        console.log('---------------------------\n');

        return `**${firstArticleTitle}**\n${firstArticleDescription}\n[Read more](${firstArticle.url})`;

    } catch (error) {
        // 5. If any error occurs during the fetch or parsing, catch it here.
        console.error('\n--- Error Fetching API ---');
        console.error(error.message);
        console.error('Please ensure the Node.js server is running and accessible at the specified URL.');
        console.error('--------------------------\n');
    }
}

module.exports = { getNews };
