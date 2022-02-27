import nc from 'next-connect';
import Order from '../../../models/Order';
import db from '../../../utils/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuth } from '../../../utils/auth';

const handler = nc();

handler.use( isAuth );

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  
  console.log(req.body)

  await db.connect();
  const orders = await Order.find({user:  req.user.id });
  await db.disconnect();
  res.send(orders);
});

export default handler;