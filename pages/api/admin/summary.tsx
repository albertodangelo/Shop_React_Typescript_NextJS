import nc from 'next-connect';
import Order from '../../../models/Order';
import db from '../../../utils/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuth, isAdmin } from '../../../utils/auth';
import Product from '../../../models/Product';
import User from '../../../models/User';

const handler = nc();

handler.use( isAuth, isAdmin );

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  
  console.log(req.body)

  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const orderPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: {$sum: '$totalPrice'}
      }
    }
  ])
  const ordersPrice = orderPriceGroup.length > 0 ? orderPriceGroup[0].sales : 0;
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  console.log("SALES DATA : " , salesData);
  await db.disconnect();
  
    

  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
});

export default handler;