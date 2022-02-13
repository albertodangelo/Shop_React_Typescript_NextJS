import nc from 'next-connect';
import Order from '../../../models/Order';
import db from '../../../utils/db';
import { onError } from '../../../utils/errors';
import { isAuth } from '../../../utils/auth'

const handler = nc({
  onError
});

handler.use(isAuth);

handler.post(async (req, res) => {

  await db.connect();

    const newOrder = new Order({
      ...req.body,
      user: req.user.id
    })
    const order = await newOrder.save();

    res.status(201).send(order);
    
    db.disconnect();
});

export default handler;
