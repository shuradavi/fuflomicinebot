const axios = require('axios'); // Подключение модуля axios для скачивания страницы
const {parse} = require('node-html-parser');

const baseLink = 'https://encyclopatia.ru/wiki/Расстрельный_список_препаратов';

const myFunc = async (myString) => {
    // console.log(myString);
  const {data} = await axios.get(baseLink);
  const parsedData = parse(data)
  const allLiElements = parsedData.getElementsByTagName("li")
  const mappedTexts = allLiElements.filter((el) => el.text.includes(myString)).map((el) => el.text).toString()
    return mappedTexts
}

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '6034260720:AAGwhawBVyJ417-aglfviI7hEakIa9Q4dik';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

//Клавиатура готовый код
bot.onText(/^\/start$/, (msg) => {
    const chatId = msg.chat.id;

    const opts = {
        // reply_to_message_id: msg.message_id,
        reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            inline_keyboard: [
                [
                    {
                        text: 'Перейти к РСП', 
                        url: 'https://encyclopatia.ru/wiki/Расстрельный_список_препаратов#.D0.9B.D1.8E.D0.B1.D0.B8.D0.BC.D1.8B.D0.B5_.D0.BF.D0.BE.D0.B4.D0.B1.D0.BE.D1.80.D0.BA.D0.B8_.D1.84.D1.83.D1.84.D0.BB.D0.B0' //ссылка на сайт
                    }
                ],
                [
                    {
                        text: 'Поиск по названию', // текс на кнопке
                        callback_data: 'searchByName' // Данные для обработчика события
                    }
                ],
            ]
        }
    };

    bot.sendMessage(chatId, "Привет, я помогу тебе проверить препарат по РСП", opts);
});

// Обработчик нажатий на кнопки
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'searchByName') {
        bot.sendMessage(chatId, 'Введите полное название препарата или действующего вещества')
    }
});

// Выводим результат парсинга
bot.on('message', async (msg) => {
    console.log(msg.text);
   const res = await myFunc(msg.text)
    // console.log(res);
  const chatId = msg.chat.id;
    msg.text !== '/start' ? await bot.sendMessage(chatId, res ? `"${msg.text.toLowerCase()}" найден в РСП, чтобы узнать подробнее нажмите "Перейти к РСП"` : `"${msg.text.toLowerCase()}" не найден в РСП`) : false
});
