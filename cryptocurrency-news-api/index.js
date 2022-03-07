const PORT = process.env.PORT || 8080
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express()

app.get('/',  (req, res) => {
    res.send('Cryptocurrency News API')
})

const articles = []

app.get('/news', (req, res) => {
    const url_base = 'https://www.coindesk.com/'
    axios.get("https://www.coindesk.com")
        .then((response) => {
            const html = response.data
            
            const $ = cheerio.load(html)

            $('.headline', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: url_base + url
                })
            })
            res.json(articles)
        }).catch((err) => console.log(err))

})



app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

