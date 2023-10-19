// db.js
import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/biggaminggamers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка подключения к базе данных MongoDB:'));
db.once('open', () => {
  console.log('Подключение к базе данных MongoDB успешно.');
});

export { db }; // Экспортируем объект db как свойство объекта module.exports
