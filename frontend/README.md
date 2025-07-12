### `npm start` - запуск сайта

Оьласти хранения данных:
1. redux store
2. БД на бэке

Сущности приложения:
1. Пользователи - БД, sessionStorage(для выхода из акааунта), store(отображение в браузере)
2. Роли (админ и покупатель) - БД, store
3. Товары - БД, store

Таблицы БД:
1. users - id/login/password/registed_at?/role_id
2. roles - id/name
3. products - id/name/image_url/cost/description/count

Схема redux store:
1. user - id/login/roleId
2. products: массив product - id/name/imageUrl/cost/count?
3. product - id/name/imageUrl/cost/description/count?