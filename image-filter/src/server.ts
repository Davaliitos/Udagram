import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { filterImageFromURL, deleteLocalFiles, checkURL } from './util/utils';

(async () => {

    //Init Express application
    const app = express();

    //Set network port
    const port = process.env.PORT || 8082;

    //Use the body parser middleware for post requests
    app.use(bodyParser.json());

    app.get('/filteredImage', async( req : Request, res: Response) => {
        const image_url : string = req.query.image_url as string;

        if(!image_url){
            return res.sendStatus(400);
        }

        if(!checkURL(image_url)){
            return res.sendStatus(422);
        }

        const filteredImage = await filterImageFromURL(image_url);

        if(!filteredImage){
            return res.sendStatus(400);
        }

        res.sendFile(filteredImage, () => {
            deleteLocalFiles([filteredImage])
        });

    });

    app.get('/', async( req: Request, res: Response) => {
        res.send("try GET /filteredimage?image_url={{}}")
    })

    app.listen(port, () => {
        console.log( `server running http://localhost:${ port }` );
        console.log( `press CTRL+C to stop server` );
    })
})();