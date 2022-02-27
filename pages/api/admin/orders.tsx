import nc from 'next-connect';
import Order from '../../../models/Order';
import db from '../../../utils/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuth, isAdmin } from '../../../utils/auth';


const handler = nc();

handler.use( isAuth, isAdmin );

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  
  await db.connect();
 
  const orders = await Order.find({}).populate('user','name');

  await db.disconnect();
  
    

  res.send( orders );
});

export default handler;