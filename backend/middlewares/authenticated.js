const User = require("../models/User");
const { verify } = require("../helpers/token");
const { match } = require("path-to-regexp");

const publicRoutes = [
  { path: '/register', method: 'POST' },
  { path: '/login', method: 'POST' },
  { path: '/products', method: 'GET' },
  { path: '/products/:id', method: 'GET' },
];

module.exports = async function (req, res, next) {
  try {
    // OPTIONS — всегда пропускаем
    if (req.method === "OPTIONS") return next();

    // Проверяем, попадает ли маршрут в публичные
    const isPublic = publicRoutes.some(route => {
      if (route.method !== req.method) return false;
      const isMatch = match(route.path, { decode: decodeURIComponent });
      return isMatch(req.path);
    });

    if (isPublic) return next();

    // Проверка токена
    if (!req.cookies.token) {
      return res.status(401).json({ error: "Токен не предоставлен" });
    }

    const tokenData = verify(req.cookies.token);
    const user = await User.findOne({ _id: tokenData.id });

    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};
