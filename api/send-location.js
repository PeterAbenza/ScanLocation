import axios from "axios";

export default async function handler(req, res) {
  // Substitua pelos valores reais
  const TELEGRAM_BOT_TOKEN = "7502261188:AAEnUwY-rA1307JXO3R7_O-3o8rZnEpJIJY";
  const TELEGRAM_CHAT_ID = "-4636630107";

  console.log("entrou no backend...");
  console.log("Dados recebidos no backend:", req.body);

  if (req.method === "POST") {
    const { latitude, longitude } = req.body;

    // Validação básica
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude e Longitude são obrigatórios.",
      });
    }

    // Mensagem formatada para o Telegram
    const message = `A localização do usuário é:\nLatitude: ${latitude}\nLongitude: ${longitude}`;

    try {
      // Envia a localização para o Telegram
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      });

      res.status(200).json({
        success: true,
        message: "Localização enviada para o Telegram com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao enviar para o Telegram:", error.response?.data || error.message);
      res.status(500).json({
        success: false,
        message: "Erro ao enviar a localização para o Telegram.",
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "Método não permitido. Use POST.",
    });
  }
}
