import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

export default handler;
