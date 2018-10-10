import express from 'express'
import path from 'path';

const app = express();


app.use('/', express.static(path.join(__dirname, '../dist')));

///Open Server
app.listen(8080, () => {
    console.log('Express is listening on port 8080');
});