const express = require('express')
const app     = express()
const port    = 3000
const fs      = require('fs')
let index = fs.readFileSync('./index.html', 'utf8')
/**
 * HOSTNAME:
 */
const replacer = {
  "{IMAGE}"       : `${'linitsh/testy'}`,
  "{VERSION}"     : `${'0.1.0'}`,
  "{POD}"         : `${'null'}`,
  "{DESCRIPTION}" : `${'null'}`,
  "{CODE}"        : `${'null'}`,
}
for (const [key, value] of Object.entries(replacer)) {
  index = index.replace(key, value)
}

app.get('/', (req, res) => {
  console.log(process.env)
  res.setHeader("Content-Type", "text/html")
  res.send(index)
})

app.get('/healthcheck', (req, res) => {
  res.setHeader("Content-Type", "text/html")
  res.send("<style>*{color: limegreen; background: #272727;}</style>OK")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})