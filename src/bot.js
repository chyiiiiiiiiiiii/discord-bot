"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Eris = require("eris");
var eris_1 = require("eris");
var config_1 = require("../config");
var webhook_listener_js_1 = require("./webhook_listener.js");
var constants = eris_1.Constants;
/// 初始化、啟動
var bot = Eris(config_1.BOT_TOKEN);
/// 指令前綴
var PREFIX = "vl!";
/// DC
var serverGuild;
//----------------------------------------------------------------
/// 會員驗證成功的角色
var loverRole = {
    name: "Lover",
    color: 0xda5ee4,
    hoist: true
};
/// 指令清單
var commandHandlerForCommandName = new Map();
/// 指令訊息：owner
commandHandlerForCommandName.set("owner", {
    botOwnerOnly: true,
    execute: function (msg, args) {
        return bot.createMessage(msg.channel.id, "\u54C8\u56C9 Yii\uD83D\uDE04");
    }
});
/// 指令訊息：verify
commandHandlerForCommandName.set("verify", {
    botOwnerOnly: false,
    execute: function (msg, args) { return __awaiter(void 0, void 0, void 0, function () {
        var mention, guild, userId, member, userIsInGuild;
        return __generator(this, function (_a) {
            mention = args[0];
            guild = msg.channel.guild;
            userId = mention.replace(/<@(.*?)>/, function (match, group1) { return group1; });
            member = guild.members.get(userId);
            userIsInGuild = !!member;
            if (!userIsInGuild) {
                return [2 /*return*/, bot.createMessage(msg.channel.id, "\u627E\u4E0D\u5230\u6B64\u7528\u6236 ".concat(member))];
            }
            return [2 /*return*/, Promise.all([
                    bot.createMessage(msg.channel.id, "\u54C8\u56C9 ".concat(mention, "\uFF01\u60A8\u7684\u6703\u54E1\u5DF2\u9A57\u8B49\u6210\u529F\uFF01")),
                    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 4.
                    updateMemberRole(guild, member, loverRole, "會員認證成功"),
                    logVerify(member, loverRole, "角色已賦予"),
                ])];
        });
    }); }
});
/// 指令訊息：link-button
commandHandlerForCommandName.set("link-button", {
    botOwnerOnly: false,
    execute: function (msg, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, mentionString;
        return __generator(this, function (_a) {
            userId = msg.author.id;
            mentionString = "<@".concat(userId, ">");
            if (!userId) {
                return [2 /*return*/, bot.createMessage(msg.channel.id, "\u627E\u4E0D\u5230\u6B64\u7528\u6236 ".concat(mentionString))];
            }
            return [2 /*return*/, bot.createMessage(msg.channel.id, {
                    content: "\u54C8\u56C9 ".concat(mentionString, "\uFF0C\u8ACB\u9EDE\u64CA\u4E0B\u65B9\u7684\u6309\u9215\u9032\u884C\u9A57\u8B49\uFF01"),
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: "打開驗證網頁",
                                    style: 5,
                                    url: "https://www.google.com"
                                },
                            ]
                        },
                    ]
                })];
        });
    }); }
});
//----------------------------------------------------------------
/// 顯示認證會員的按鈕訊息
function displayVerifiedLinkButton() {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            content = {
                embed: {
                    color: 0xe780ea,
                    thumbnail: {
                        url: "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg"
                    },
                    fields: [
                        {
                            name: "會員",
                            value: "哈囉，請點擊下方的按鈕進行驗證！",
                            inline: true
                        },
                    ]
                },
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "GO!",
                                style: 1,
                                custom_id: "click-verify"
                            },
                        ]
                    },
                ]
            };
            bot.createMessage(config_1.VERIFY_CHANNEL_ID, content);
            return [2 /*return*/];
        });
    });
}
/// 顯示URL網頁按鈕的訊息
function displayWebsiteButton(interaction) {
    return __awaiter(this, void 0, void 0, function () {
        var memberId, mention, url, content;
        return __generator(this, function (_a) {
            memberId = interaction.member.id;
            mention = "<@".concat(memberId, ">");
            url = "http://localhost:3000?id=".concat(memberId);
            content = {
                content: "".concat(mention, "\nMember: ").concat(memberId),
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "打開驗證網頁",
                                style: 5,
                                url: url
                            },
                        ]
                    },
                ]
            };
            return [2 /*return*/, interaction.createMessage(content)];
        });
    });
}
/// 更新用戶的角色權限
/// guild: DC
/// member: 用戶
/// specificRole: 指定的角色
/// addRoleMessage: 設置角色的log附加訊息
function updateMemberRole(member, specificRole, addRoleMessage) {
    return __awaiter(this, void 0, void 0, function () {
        var role;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!member) return [3 /*break*/, 4];
                    role = Array.from(serverGuild.roles.values()).find(function (ownRole) { return ownRole.name === specificRole.name; });
                    if (!!role) return [3 /*break*/, 2];
                    return [4 /*yield*/, serverGuild.createRole(specificRole)];
                case 1:
                    // 幫Discord建立指定的角色權限
                    role = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    console.log("This member (".concat(member, ") already has this role."));
                    _a.label = 3;
                case 3: 
                // 為使用者設置角色權限
                return [2 /*return*/, member.addRole(role.id, addRoleMessage)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function logVerify(member, specificRole, addRoleMessage) {
    var logMessage = {
        embed: {
            title: "會員驗證成功",
            color: 0x00ff00,
            fields: [
                { name: "User ID", value: member.id, inline: true },
                { name: "User name", value: member.username, inline: true },
                { name: "Role name", value: specificRole.name, inline: true },
                { name: "message", value: addRoleMessage, inline: true },
            ]
        }
    };
    return bot.createMessage(config_1.LOG_CHANNEL_ID, logMessage);
}
/// 送出捐贈訊息到指定頻道
function logDonation(member, paymentSource, paymentId, senderName, donationAmount, message, timestamp) {
    var isKnownMember = !!member;
    var memberName = isKnownMember
        ? "".concat(member.username, "#").concat(member.discriminator)
        : "Unknown";
    var embedColor = isKnownMember ? 0x00ff00 : 0xff0000;
    var logMessage = {
        embed: {
            title: "Donation received",
            color: embedColor,
            timestamp: timestamp,
            fields: [
                { name: "Payment Source", value: paymentSource, inline: true },
                { name: "Payment ID", value: paymentId, inline: true },
                { name: "Sender", value: senderName, inline: true },
                { name: "Donor Discord name", value: memberName, inline: true },
                {
                    name: "Donation amount",
                    value: donationAmount.toFixed(2),
                    inline: true
                },
                { name: "Message", value: message, inline: true },
            ]
        }
    };
    return bot.createMessage(config_1.LOG_CHANNEL_ID, logMessage);
}
function onVerify(discordUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var member, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    member = serverGuild ? serverGuild.members.get(discordUserId) : null;
                    if (!member) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all([
                            updateMemberRole(member, loverRole, "會員認證成功"),
                            logVerify(member, loverRole, "角色已賦予"),
                        ])];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    console.warn("Event(verify) - onVerify() - Error - \u627E\u4E0D\u5230\u6B64Discord\u7528\u6236\u8CC7\u6599");
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.warn("Event(verify) - onVerify() - Error - ".concat(error_1));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/// 收到捐款Event，進行處理
/// 此為模擬範例
function onDonation(paymentSource, paymentId, senderName, amount, message, timestamp) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
}
//----------------------------------------------------------------
bot.on("messageCreate", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var content, parts, commandName, commandHandler, authorIsBotOwner, args, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                content = msg.content;
                console.warn("Event - messageCreate -", content);
                // 該機器人將只接受在公共頻道中發出的訊息
                if (!msg.channel.guild) {
                    // Check if the message was sent in a guild
                    return [2 /*return*/, bot.createMessage(msg.channel.id, "This command can only be run in a server.")];
                }
                // 頻道資訊
                serverGuild = msg.channel.guild;
                // 忽略任何的一般訊息
                // 機器人只允許指令訊息
                if (!content.startsWith(PREFIX)) {
                    console.warn("Not a command message");
                    return [2 /*return*/];
                }
                parts = content
                    .split(" ")
                    .map(function (s) { return s.trim(); })
                    .filter(function (s) { return s; });
                commandName = parts[0].substr(PREFIX.length);
                console.log("Receive command - ", commandName);
                commandHandler = commandHandlerForCommandName.get(commandName);
                if (!commandHandler) {
                    console.warn("Not find this command - ", commandName);
                    return [2 /*return*/];
                }
                authorIsBotOwner = msg.author.id === config_1.BOT_OWNER_ID;
                if (!(commandHandler.botOwnerOnly && !authorIsBotOwner)) return [3 /*break*/, 2];
                return [4 /*yield*/, bot.createMessage(msg.channel.id, "抱歉，這個指令只有機器人擁有者能夠使用哦")];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                args = parts.length > 0 ? parts.slice(1) : [];
                console.log("This command '".concat(commandName, "' has args - "), args);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 7]);
                // 指令處理
                return [4 /*yield*/, commandHandler.execute(msg, args)];
            case 4:
                // 指令處理
                _a.sent();
                return [3 /*break*/, 7];
            case 5:
                error_2 = _a.sent();
                console.warn("Error - ".concat(error_2));
                return [4 /*yield*/, bot.createMessage(msg.channel.id, "指令的訊息格式錯誤，無法處理！")];
            case 6:
                _a.sent();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
bot.on("interactionCreate", function (interaction) {
    if (interaction instanceof eris_1.ComponentInteraction) {
        var customId = interaction.data.custom_id;
        if (customId == "click-verify") {
            return displayWebsiteButton(interaction);
        }
    }
});
bot.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("Connected and ready.");
        displayVerifiedLinkButton();
        return [2 /*return*/];
    });
}); });
bot.on("error", function (err) {
    console.warn(err);
});
bot.on("guildCreate", function (guild) {
    console.log("New guild: ".concat(guild.name));
});
// 監聽Webhook Server的Socket event
webhook_listener_js_1["default"].on("verify", onVerify);
webhook_listener_js_1["default"].on("donation", onDonation);
bot.connect();
