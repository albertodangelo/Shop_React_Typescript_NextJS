import nc from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";
import { isAuth, signToken } from "../../../utils/auth";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc();
handler.use(isAuth);

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const user = await User.findById(req.user.id);
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password
    ? bcrypt.hashSync(req.body.password)
    : user.password;
  user.save();
  await db.disconnect();

  const token = signToken(user);
  res.send({
    token,
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
