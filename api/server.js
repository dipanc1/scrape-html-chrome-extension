const express = require('express');
const fs = require('fs');

const cheerio = require('cheerio');

const app = express();

app.use(express.json({ limit: '50mb' }));

let folder = 'data';

app.post('/save', async (req, res) => {
    // console.log(req.body.response);
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    let filesCount = fs.readdirSync(folder).length;

    let fileName = `data/${Math.floor(Math.random() * 1000000)} - ${filesCount}.html`;

    let $ = cheerio.load(req.body.response, {
        scriptingEnabled: false,
    });
    scripts = $('script');
    scripts.remove();


    fs.writeFileSync(fileName, $.html());

    res.status(200).send('Saved!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
