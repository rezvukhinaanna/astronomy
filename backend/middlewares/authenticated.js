const User = require("../models/User");
const { verify } = require("../helpers/token");
const { match } = require("path-to-regexp");

const publicRoutes = [
  { path: "/register", method: "POST" },
  { path: "/login", method: "POST" },
  { path: "/products", method: "GET" },
  { path: "/products/:id", method: "GET" }
];

module.exports = async function (req, res, next) {
  try {
    if (req.method === "OPTIONS") return next();

    const isPublic = publicRoutes.some(route => {
      if (route.method !== req.method) return false;
      const matcher = match(route.path, { decode: decodeURIComponent });
      return matcher(req.path);
    });

    if (isPublic) return next();

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const tokenData = verify(token);
    const user = await User.findById(tokenData.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
};
