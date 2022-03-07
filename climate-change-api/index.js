const PORT = process.env.PORT || 8000
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express()

const newspapers = [
    {
        name: 'the-guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'the-times',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    } 
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response => {
            const html = response.data

            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        }))
})

app.get('/', (req, res) => {
    res.json("Welcome to this Climate Change News API")
})

app.get('/news', (req, res) => {
    res.json(articles)
    /* axios.get('https://www.theguardian.com/environment/climate-crisis')
        .then((response => { //a promise
            const html = response.data
            //console.log(html)
            const $ = cheerio.load(html) //allow us to pick up elements from the html

            //we'll lookup for any a tag (links) that contains anything to do with climate
            $('a:contains("climate")', html).each(function () {
                //grab the text in the a tag
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url
                })
            })
            res.json(articles)
        })).catch((err) => console.log(err)) */
})

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].base
    //console.log(newspaperAddress)

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const articlesFromNewspaper = []
            
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
    
                articlesFromNewspaper.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(articlesFromNewspaper)
        }).catch(err => console.log(err))

})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))