import express from 'express';
import bodyParser from 'body-parser';

(async () => {

    //Init Express application
    const app = express();

    //Set network port
    const port = process.env.PORT || 8082;

    //Use the body parser middleware for post requests
    app.use(bodyParser.json());

    app.listen(port, () => {
        console.log( `server running http://localhost:${ port }` );
        console.log( `press CTRL+C to stop server` );
    })
})