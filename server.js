const express = require('express')
const app = express()
const port = 8081
app.listen(port, () => {
    console.log(`App connecting to the server and listening at http://localhost:${port}`)
});
app.use(express.static('public'));