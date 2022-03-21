import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../../utils/auth";
import Product from "../../../../../models/Product";
import db from "../../../../../utils/db";

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();

  res.send(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);

  console.log(product);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;

    await product.save();
    res.send({ message: "Product updated successfully" });
    await db.disconnect();
  } else {
    await db.disconnect();
    res.status404.send({ message: "Vielen Dank für den Artikel" });
  }
});

export default handler;
