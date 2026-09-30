// Regenerates docs/screenshots from the single-file build: npm run build:mockup && npm run screenshots
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const APP = pathToFileURL(resolve('mockup/index.html')).href
const OUT = resolve('docs/screenshots')
if (!existsSync(resolve('mockup/index.html'))) throw new Error('Run `npm run build:mockup` first')
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })

const wait = ms => new Promise(r => setTimeout(r, ms))
const shot = async name => { await wait(1200); await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('✓', name) }
const scrollTo = sel => page.evaluate(s => {
  const el = document.querySelector(s)
  const scroller = document.querySelector('.screen')
  scroller.scrollTo(0, el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 12)
}, sel)
const click = async text => {
  const ok = await page.evaluate(t => {
    const el = [...document.querySelectorAll('a,button,label')].filter(e => e.textContent.includes(t))
      .sort((a, b) => a.textContent.length - b.textContent.length)[0]
    el?.click()
    return !!el
  }, text)
  if (!ok) throw new Error(`Nothing to click with text "${text}"`)
}

await page.goto(APP, { waitUntil: 'networkidle0' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)

await shot('01-start')
await click('Check my score'); await shot('02-profile')
await click('Kate Coins'); await wait(200); await click('Bolero')
await scrollTo('.source'); await page.evaluate(() => document.querySelector('.screen').scrollBy(0, -150)); await shot('03-connect-data')

await click("Let's go"); await wait(400)
for (const t of ['For a few of them', 'Yes', 'Mostly public', 'An elderly parent']) { await click(t); await wait(900) }
await shot('04-kate')
for (const t of ['Often', 'Still the default']) { await click(t); await wait(900) }
await click('See my score'); await shot('05-score')
await scrollTo('.carousel'); await page.evaluate(() => document.querySelector('.screen').scrollBy(0, -250)); await shot('06-tips')

await click('Fake police'); await shot('07-family-tip')
await click('Got it'); await wait(300)

await page.evaluate(() => document.querySelector('.screen').scrollTo(0, 0)); await wait(300)
await click('Security alert'); await shot('08-breach')
await click("I've changed it"); await wait(300)
await page.evaluate(() => document.querySelector('.screen').scrollTo(0, 99999)); await shot('09-breach-insurance')
await click('Get covered'); await shot('10-insurance')
await click('Take out insurance'); await shot('11-protected')

// banner: four key screens on the KBC gradient
const hero = ['01-start', '04-kate', '05-score', '08-breach']
const imgs = hero.map(n => `<img src="${n}.png">`).join('')
await page.setViewport({ width: 1600, height: 820, deviceScaleFactor: 1 })
const bannerHtml = `${OUT}/.banner.html`
writeFileSync(bannerHtml, `<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;700;800&display=swap" rel="stylesheet"><style>
  body{margin:0;width:1600px;height:820px;background:linear-gradient(135deg,#1FA39A 0%,#1BA7C4 45%,#3F86C9 100%);font-family:'Nunito Sans',sans-serif;color:#fff;overflow:hidden}
  h1{font-size:54px;font-weight:800;margin:0}p{font-size:24px;opacity:.9;margin:8px 0 0}
  .t{position:absolute;left:70px;top:60px}
  .row{position:absolute;left:70px;right:70px;top:210px;display:flex;gap:42px;justify-content:center}
  img{width:300px;border-radius:38px;border:8px solid #F7F9FB;box-shadow:0 20px 50px rgba(0,30,60,.35)}
  img:nth-child(even){margin-top:40px}
</style></head><body><div class="t"><h1>KBC Safety Score</h1><p>Know your risk before the hackers do.</p></div><div class="row">${imgs}</div></body></html>`)
await page.goto(pathToFileURL(bannerHtml).href, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: `${OUT}/banner.png` })
rmSync(bannerHtml)
console.log('✓ banner')

await browser.close()
