import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuth, isAdmin } from '../../../utils/auth';
import { onError } from '../../../utils/errors';


const handler = nc({onError});

handler.use( isAuth, isAdmin );


handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  
  await db.connect();
 
  const products = await Product.find({});

  await db.disconnect();
  
    

  res.send( products );
});

export default handler;