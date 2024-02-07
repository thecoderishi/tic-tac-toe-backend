const express = require('express')
const app = express()
const PORT = 4000

app.get('/', (req, res) => {
  res.status(200).json('tic-tac-toe home')
})

app.listen(PORT, () => {
  console.log(`The app is up and running at port ${PORT}`);
})

module.exports = app