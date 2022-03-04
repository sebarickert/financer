import { Router } from 'express';

import { getMyData, overrideMyData } from '../controllers/profile-controller';

export const profileRouter = Router();

profileRouter.get('/', (req, res) => {
  res.status(200).json(req.user);
});

profileRouter.get('/my-data', getMyData);

profileRouter.post('/my-data', overrideMyData);
