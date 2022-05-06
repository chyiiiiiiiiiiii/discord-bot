const Express = require("express")
const Cors = require("cors")
const BodyParser = require("body-parser")
const EventEmitter = require("events")

const PORT = 80;

/// WebhookListener
class WebhookListener extends EventEmitter {
  emit: any;
  listen() {
    // 驗證會員，成功後驗證的網頁會打這個API，傳送Discord的用戶ID過來
    app.post("/verify-success", (req: any, res: any) => {
      const data = req.body;

      const discordUserId = data.discord_user_id;

      // 根據平台方的要求回應規定的Response格式
      res.send({ status: "OK" });

      // 透過Socket機制，發送一個Event給機器人
      this.emit("verify", discordUserId);
    });

    // 範例：當收款平台收到款項後，會經由在平台設置的Webhook Url，也就是我們Server的Api，將捐款資訊告訴我們
    // https://127.0.0.1/donation，POST
    // https://www.lang-discord.com/donation，POST
    app.post("/donation", (req: any, res: any) => {
      const data = req.body.data;

      const paymentSource = "Paypal"; //PayPal、歐付寶、綠界
      const paymentId = data.message_id;
      const senderName = data.from_name;
      const amount = `${parseFloat(data.amount)}`;
      const message = data.message;
      const timestamp = data.timestamp;

      // 根據平台方的要求回應規定的Response格式
      res.send({ status: "OK" });

      // 透過Socket機制，發送一個Event給機器人
      this.emit(
        "donation",
        paymentSource,
        paymentId,
        senderName,
        amount,
        message,
        timestamp
      );
    });

    app.listen(PORT);
  }
}

/// Server
const app = Express();
app.use(BodyParser.json());
app.use(Cors());

/// WebhookListener
const listener = new WebhookListener();
listener.listen();

export default listener;
