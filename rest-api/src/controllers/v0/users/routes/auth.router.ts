import { Router, Request, Response } from 'express';

import { User } from '../models/User';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'connect';

import * as EmailValidator from 'email-validator';
import { configuration } from '../../../../config/config';

const router: Router = Router();

async function generatePassword(plainTextPassword: string): Promise<string>{
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    const hash = await bcrypt.hash(plainTextPassword, salt);
    return hash;
}

async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hash);
}

function generateJWT(user: User): string {
    return jwt.sign(user.toJSON(),configuration.jwt.secret)
}

export function requireAuth(req: Request, res: Response, next: NextFunction){
    if(!req.headers || !req.headers.authorization){
        return res.status(401).send({message: 'No authorization headers.'})
    }

    const token = req.headers.authorization.split(' ');
    if(token.length !== 2){
        return res.status(500).send({auth: false, message: 'failed to authenticate'});
    }

    return jwt.verify(token[1], configuration.jwt.secret, (err,decoded) => {
        if(err){
            return res.status(500).send({auth: false, message: 'failed to authenticate'});
        }
        return next();
    })
}

router.get('/verification', requireAuth, async (req : Request, res: Response) => {
    return res.status(200).send({auth: true, message : 'Authenticated'})
})

router.post('/login', async (req: Request, res: Response) =>{

    const { email, password } = req.body;

    //check email is valid
    if (!email || !EmailValidator.validate(email)){
        return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    }

    //Check email password is valid
    if (!password) {
        return res.status(400).send({ auth: false, message: 'Password is required' });
    }

    const user = await User.findByPk(email);
    //Check that user exists
    if(!user){
        return res.status(401).send({ auth: false, message: 'Unauthorized' });
    }

    //check that password matches
    const authValid = await comparePasswords(password, user.password_hash);

    if(!authValid){
        return res.status(401).send({ auth: false, message: 'Unauthorized' });
    }

    const jwt = generateJWT(user);

    res.status(200).send({ auth: true, token: jwt, user: user.short()});
})

//register new user
router.post('/', requireAuth, async (req: Request, res: Response) => {

    const { email, password } = req.body;

    // check email is valid
    if(!email || !EmailValidator.validate(email)){
        return res.status(400).send({auth: false, message: 'Email is required or malformed'});
    }

    //check email password valid
    if(!password){
        return res.status(400).send({auth: false, message: 'Password is required'});
    }

    //find the user
    const user = await User.findByPk(email);
    //Check that user doesn't exist
    if(user){
        return res.status(422).send({auth: false, message: 'User already exists'})
    }

    const password_hash = await generatePassword(password);

    const newUser = await new User({
        email: email,
        password_hash: password_hash,
        ...req.body
    })

    let savedUser;
    try{
        savedUser = await newUser.save();
    } catch(e){
        return res.status(500).send('There is a problem with the server')
    }

    //Generate JWT
    const jwt = generateJWT(savedUser);

    res.status(201).send({token: jwt, user: savedUser.short()})

})

router.get('/', async (req: Request, res: Response) => {
    res.send('auth')
});

export const AuthRouter: Router = router;