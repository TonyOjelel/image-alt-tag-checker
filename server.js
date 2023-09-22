const express = require('express');
const path = require('path');
const app = express();
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(bodyParser.json());

app.post('/analyze', async (req, res) => {
    const websiteUrl = req.body.url;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(websiteUrl, { waitUntil: 'networkidle0' });

        const imageElements = await page.$$eval('img', (imgs) =>
            imgs.map((img) => img.getAttribute('alt'))
        );

        await browser.close();

        res.json({ imageAltTexts: imageElements });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while analyzing the website.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
