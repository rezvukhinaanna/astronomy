const User = require("../models/User");
const { verify } = require("../helpers/token");

// Простые проверки маршрутов без path-to-regexp
const isPublicRoute = (method, path) => {
  const publicRoutes = {
    'POST': ['/register', '/login'],
    'GET': ['/products', /^\/products\/[a-f0-9]+$/] // Регулярка для /products/:id
  };

  return publicRoutes[method]?.some(route => {
    if (typeof route === 'string') return route === path;
    return route.test(path);
  });
};

module.exports = async function (req, res, next) {
  try {
    // Пропускаем OPTIONS-запросы и публичные маршруты
    if (req.method === "OPTIONS" || isPublicRoute(req.method, req.path)) {
      return next();
    }

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