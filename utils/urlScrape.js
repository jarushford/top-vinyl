const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const fs = require('fs')

nightmare
  .goto('https://www.discogs.com/lists/The-100-Greatest-Vinyl-Records-of-All-Time/271480?page=1&limit=100')
  .evaluate(() => {
    const urlNodes = document.querySelectorAll('div.listitem_image a')
    const urlList = [].slice.call(urlNodes)
    return urlList.map(url => url.href)
  })
  .end()
  .then(result => {
    fs.writeFileSync('urlOutput.json', JSON.stringify(result))
  })