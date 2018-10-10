import express from 'express'
import path from 'path';

const app = express();


app.use('/', express.static(path.join(__dirname, '../dist')));

const port = 80;
///Open Server
app.listen(port, () => {
    console.log('Express is listening on', port);
});