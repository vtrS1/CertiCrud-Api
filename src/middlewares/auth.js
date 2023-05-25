import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_HASH);
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalid" });
  }
};
