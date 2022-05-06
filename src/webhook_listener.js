"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Express = require("express");
var Cors = require("cors");
var BodyParser = require("body-parser");
var EventEmitter = require("events");
var PORT = 80;
/// WebhookListener
var WebhookListener = /** @class */ (function (_super) {
    __extends(WebhookListener, _super);
    function WebhookListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebhookListener.prototype.listen = function () {
        var _this = this;
        // 驗證會員，成功後驗證的網頁會打這個API，傳送Discord的用戶ID過來
        app.post("/verify-success", function (req, res) {
            var data = req.body;
            var discordUserId = data.discord_user_id;
            // 根據平台方的要求回應規定的Response格式
            res.send({ status: "OK" });
            // 透過Socket機制，發送一個Event給機器人
            _this.emit("verify", discordUserId);
        });
        // 範例：當收款平台收到款項後，會經由在平台設置的Webhook Url，也就是我們Server的Api，將捐款資訊告訴我們
        // https://127.0.0.1/donation，POST
        // https://www.lang-discord.com/donation，POST
        app.post("/donation", function (req, res) {
            var data = req.body.data;
            var paymentSource = "Paypal"; //PayPal、歐付寶、綠界
            var paymentId = data.message_id;
            var senderName = data.from_name;
            var amount = "".concat(parseFloat(data.amount));
            var message = data.message;
            var timestamp = data.timestamp;
            // 根據平台方的要求回應規定的Response格式
            res.send({ status: "OK" });
            // 透過Socket機制，發送一個Event給機器人
            _this.emit("donation", paymentSource, paymentId, senderName, amount, message, timestamp);
        });
        app.listen(PORT);
    };
    return WebhookListener;
}(EventEmitter));
/// Server
var app = Express();
app.use(BodyParser.json());
app.use(Cors());
/// WebhookListener
var listener = new WebhookListener();
listener.listen();
exports["default"] = listener;
