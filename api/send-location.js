import axios from "axios";
import Cors from "cors";

// Inicializa o CORS
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: '*', // Aceita qualquer origem, ou você pode configurar um domínio específico, por exemplo: 'https://meusite.com'
});

// Middleware CORS
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const axios = require("axios");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;  // Acessando a variável de ambiente
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;      // Acessando a variável de ambiente

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { latitude, longitude, maps } = req.body;

    const message = `A localização do usuário é:\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`;

    try {
      // Envia a localização para o Telegram
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Erro ao enviar a localização para o Telegram." });
    }
  } else {
    res.status(405).json({ success: false, message: "Método não permitido" });
  }
}
