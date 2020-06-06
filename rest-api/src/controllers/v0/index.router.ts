import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.send('V0');
});

export const IndexRouter: Router = router;