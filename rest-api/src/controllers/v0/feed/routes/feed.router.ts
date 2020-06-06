import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../users/routes/auth.router';

import * as AWS from '../../../../aws';

const router: Router = Router();

//Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map( item => {
        if(item.url){
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    res.send(items);
});

//Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', requireAuth, async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({ url : url });
})


//Get a resource by primary key
router.get('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    const item = await FeedItem.findByPk(id);
    if(item){
        res.send(item);
    } else{
        res.sendStatus(404);
    }
});

//Update a resource by ID
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
    let { id } = req.params;
    let { caption, url } = req.body;

    const item = await FeedItem.findByPk(id);

    if(!item){
        res.sendStatus(404);
    }

    const updated_item = await item.update({
        caption,
        url
    })

    if(updated_item){
        res.send(updated_item)
    } else{
        res.sendStatus(400);
    }

})


//Post meta data and the filename after a file is uploaded
router.post('/',requireAuth, async (req: Request, res: Response) => {

    const { caption, url } = req.body; 


    //checks if caption is valid
    if(!caption){
        return res.status(400).send({message: 'Caption is required or malformed'});
    } 

    //checks if fileName is valid
    if(!url){
        return res.status(400).send({ message: 'File url is required'});
    }

    const item = await new FeedItem({
        caption: caption,
        url: url
    })

    const saved_item = await item.save();

    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);

})

export const FeedRouter: Router = router;