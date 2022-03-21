import jwt from "jsonwebtoken";

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    // Baerer xxx => xxx
    const token = authorization.slice(7, authorization.length);

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Token is not valid" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "Token is not supplied" });
  }
};

const isAdmin = async (req, res, next) => {
  console.log("Is Admin ", req.user);

  if (req.user.isAdmin === "true") {
    next();
  } else {
    res.status(401).send({ message: "User is not admin" });
  }
};
export { signToken, isAuth, isAdmin };
