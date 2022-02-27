import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuth } from '../../../../utils/auth';

const handler = nc();

handler.use( isAuth );

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
});

export default handler;
