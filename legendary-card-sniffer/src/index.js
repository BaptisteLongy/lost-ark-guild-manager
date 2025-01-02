const app = require('../src/app')
const port = process.env.PORT ? process.env.PORT : 3000

app.listen(port, () => {
  console.log(`Legendary Card Sniffer App listening on port ${port}`)
})