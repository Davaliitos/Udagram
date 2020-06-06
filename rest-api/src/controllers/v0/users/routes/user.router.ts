import { Router, Request, Response } from 'express';

import { User } from '../models/User';
import { AuthRouter, requireAuth } from './auth.router';

const router : Router = Router();

router.use('/auth', AuthRouter);

router.get('/', async (req: Request, res: Response) => {

})

router.get('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    const item = await User.findByPk(id);
    if(item){
        res.send(item);
    }
    else{
        res.send(404);
    }
});

export const UserRouter : Router = router;