const User = require("../models/User");
const { verify } = require("../helpers/token");

const publicRoutes = ['/register', '/login', '/products', '/products/:id'];

module.exports = async function (req, res, next) {
  try {
    // Пропускаем OPTIONS-запросы и публичные маршруты
    if (req.method === "OPTIONS" || publicRoutes.some(route => {
      const pattern = new RegExp('^' + route.replace(/:\w+/g, '\\w+') + '$');
      return pattern.test(req.path) && req.method === 'GET';
    })) {
      return next();
    }
    
    // Для POST /register и POST /login тоже пропускаем аутентификацию
    if ((req.path === '/register' || req.path === '/login') && req.method === 'POST') {
      return next();
    }

    // Проверяем наличие токена для остальных маршрутов
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