const User = require("../models/User");
const { verify } = require("../helpers/token");

// Простые проверки маршрутов без сторонних библиотек
const isPublicRoute = (method, path) => {
  const publicRoutes = {
    'POST': ['/register', '/login'],
    'GET': ['/products']
  };

  // Проверка точных совпадений
  if (publicRoutes[method]?.includes(path)) {
    return true;
  }

  // Проверка динамических маршрутов типа /products/:id
  if (method === 'GET' && path.startsWith('/products/')) {
    const idPart = path.split('/')[2];
    // Простая проверка, что после /products/ идет что-то похожее на ID
    return /^[a-f0-9]+$/.test(idPart); 
  }

  return false;
};

module.exports = async function (req, res, next) {
  try {
    // Пропускаем OPTIONS-запросы и публичные маршруты
    if (req.method === "OPTIONS" || isPublicRoute(req.method, req.path)) {
      return next();
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Токен не предоставлен" });
    }

    const tokenData = verify(token);
    const user = await User.findById(tokenData.id);
    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    req.user = user;
    next();
  } catch (e) {
    console.error('Authentication error:', e);
    return res.status(401).json({ error: "Ошибка аутентификации" });
  }
};