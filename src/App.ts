// Функция для преобразования данных в формат URL (x-www-form-urlencoded)
function encodeData(obj: Record<string, any>) {
  return Object.keys(obj)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&');
}

// Пример отправки запроса (через Fetch API)
const postObj = {
  "token": bot_admin_token,
  "u_hash": bot_admin_u_hash,
  "data": JSON.stringify({
    "u_details": [  // Преобразуем массив в JSON-строку и помещаем внутрь поля data
      { "name": "Sardor", "phone": "+998940774244" }
    ]
  })
};

fetch("https://ibronevik.ru/taxi/c/gruzvill/api/v1/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded" // Этот заголовок обязателен!
  },
  body: encodeData(postObj) // Данные отправляются как строка, а не обычный JSON
});