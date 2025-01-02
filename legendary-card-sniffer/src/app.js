const express = require('express')
const puppeteer = require('puppeteer');
const { delay } = require('./delay.js');
const serverList = require('./serverList.js')

const app = express()

async function preparePage(page, serverName) {
    await page.waitForSelector('body > div > div > div > div > div > div');

    await page.waitForSelector('select#severRegion')
        .then(el => {
            return el.select('EUC')
        });

    await page.waitForSelector('select#server')
        .then(el => {
            return el.select(serverName)
        })

    await delay(2000);
}

async function scrapeLegendaryInfo(serverName, res) {
    const browser = await puppeteer.launch({
        headless: 'shell',
        // headless: false,
        args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox'],
    });
    let legendaryInfo;
    let timer
    try {
        const page = await browser.newPage();
        page.setDefaultTimeout(20000)
        await page.goto('https://lostmerchants.com/', { waitUntil: 'networkidle0' });

        await preparePage(page, serverName)

        const timerHandle = await page.waitForSelector('.merchants__timer')
        timer = await timerHandle.evaluate(el => el.textContent)

        legendaryInfo = await page.$$eval('.rarity--Legendary', options => {
            return options.map(option => option.textContent);
        });
        await browser.close();

        res.json([timer.substring(timer.lastIndexOf(' ') + 1), ...legendaryInfo]);
        return res;

    } catch (error) {
        await browser.close();
        if (error.message.startsWith('Waiting for selector `.merchants__timer` failed: Waiting failed')) {
            res.json('No timer. Probably between merchant loops')
            return res;
        } else {
            throw error;
        }
    } finally {
        await browser.close();
    }
}



app.get('/:serverName', async (req, res) => {
    if (serverList.includes(req.params.serverName)) {
        res = await scrapeLegendaryInfo(req.params.serverName, res)
    } else {
        res.sendStatus(404)
    }
})

module.exports = app