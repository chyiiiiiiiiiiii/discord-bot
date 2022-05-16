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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Eris = require("eris");
const eris_1 = require("eris");
const config_1 = require("../config");
const webhook_listener_js_1 = __importDefault(require("./webhook_listener.js"));
const constants = eris_1.Constants;
/// 初始化、啟動
const bot = Eris(config_1.BOT_TOKEN);
/// 指令前綴
const PREFIX = "vl!";
/// DC
let serverGuild;
//----------------------------------------------------------------
/// 會員驗證成功的角色
const loverRole = {
    name: "Lover",
    color: 0xda5ee4,
    hoist: true, // Show users wiasth this role in their own section of the member list.
};
/// 指令清單
const commandHandlerForCommandName = new Map();
/// 指令訊息：owner
commandHandlerForCommandName.set("owner", {
    botOwnerOnly: true,
    execute: (msg, args) => {
        return bot.createMessage(msg.channel.id, `哈囉 Yii😄`);
    },
});
/// 指令訊息：verify
commandHandlerForCommandName.set("verify", {
    botOwnerOnly: false,
    execute: (msg, args) => __awaiter(void 0, void 0, void 0, function* () {
        // 提及的用戶名稱
        const mention = args[0];
        //
        const guild = msg.channel.guild;
        const userId = mention.replace(/<@(.*?)>/, (match, group1) => group1);
        const member = guild.members.get(userId);
        // 檢查Discord裡是否有這個用戶，可能再送出訊息後就退出了
        const userIsInGuild = !!member;
        if (!userIsInGuild) {
            return bot.createMessage(msg.channel.id, `找不到此用戶 ${member}`);
        }
        return Promise.all([
            bot.createMessage(msg.channel.id, `哈囉 ${mention}！您的會員已驗證成功！`),
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 4.
            updateMemberRole(guild, member, loverRole, "會員認證成功"),
            logVerify(member, loverRole, "角色已賦予"),
        ]);
    }),
});
/// 指令訊息：link-button
commandHandlerForCommandName.set("link-button", {
    botOwnerOnly: false,
    execute: (msg, args) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = msg.author.id;
        const mentionString = `<@${userId}>`;
        if (!userId) {
            return bot.createMessage(msg.channel.id, `找不到此用戶 ${mentionString}`);
        }
        return bot.createMessage(msg.channel.id, {
            content: `哈囉 ${mentionString}，請點擊下方的按鈕進行驗證！`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "打開驗證網頁",
                            style: 5,
                            url: "https://www.google.com",
                        },
                    ],
                },
            ],
        });
    }),
});
//----------------------------------------------------------------
/// 顯示認證會員的按鈕訊息
function displayVerifiedLinkButton() {
    return __awaiter(this, void 0, void 0, function* () {
        const content = {
            embed: {
                color: 0xe780ea,
                thumbnail: {
                    url: "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
                },
                fields: [
                    {
                        name: "會員",
                        value: "哈囉，請點擊下方的按鈕進行驗證！",
                        inline: true,
                    },
                ],
            },
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "GO!",
                            style: 1,
                            custom_id: "click-verify",
                        },
                    ],
                },
            ],
        };
        bot.createMessage(config_1.VERIFY_CHANNEL_ID, content);
    });
}
/// 顯示URL網頁按鈕的訊息
function displayWebsiteButton(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const memberId = interaction.member.id;
        const mention = `<@${memberId}>`;
        const url = `http://localhost:3000?id=${memberId}`;
        // const url = `https://test-verify-205a7.web.app?id=${memberId}`;
        const content = {
            content: `${mention}\nMember: ${memberId}`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "打開驗證網頁",
                            style: 5,
                            url: url,
                        },
                    ],
                },
            ],
        };
        return interaction.createMessage(content);
    });
}
/// 更新用戶的角色權限
/// guild: DC
/// member: 用戶
/// specificRole: 指定的角色
/// addRoleMessage: 設置角色的log附加訊息
function updateMemberRole(member, specificRole, addRoleMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        if (member) {
            // 檢查Discord是否已經有這個角色權限，沒有的話就建立角色
            let role = Array.from(serverGuild.roles.values()).find((ownRole) => ownRole.name === specificRole.name);
            if (!role) {
                // 幫Discord建立指定的角色權限
                role = yield serverGuild.createRole(specificRole);
            }
            else {
                console.log(`This member (${member}) already has this role.`);
            }
            // 為使用者設置角色權限
            return member.addRole(role.id, addRoleMessage);
        }
    });
}
function logVerify(member, specificRole, addRoleMessage) {
    const logMessage = {
        embed: {
            title: "會員驗證成功",
            color: 0x00ff00,
            fields: [
                { name: "User ID", value: member.id, inline: true },
                { name: "User name", value: member.username, inline: true },
                { name: "Role name", value: specificRole.name, inline: true },
                { name: "message", value: addRoleMessage, inline: true },
            ],
        },
    };
    return bot.createMessage(config_1.LOG_CHANNEL_ID, logMessage);
}
/// 送出捐贈訊息到指定頻道
function logDonation(member, paymentSource, paymentId, senderName, donationAmount, message, timestamp) {
    const isKnownMember = !!member;
    const memberName = isKnownMember
        ? `${member.username}#${member.discriminator}`
        : "Unknown";
    const embedColor = isKnownMember ? 0x00ff00 : 0xff0000;
    const logMessage = {
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
                    inline: true,
                },
                { name: "Message", value: message, inline: true },
            ],
        },
    };
    return bot.createMessage(config_1.LOG_CHANNEL_ID, logMessage);
}
function onVerify(discordUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 檢查機器人是否有看過這個用戶
            // const user = bot.users.find((user) => user.id == discordUserId);
            // 用戶資料
            const member = serverGuild ? serverGuild.members.get(discordUserId) : null;
            if (member) {
                return yield Promise.all([
                    updateMemberRole(member, loverRole, "會員認證成功"),
                    logVerify(member, loverRole, "角色已賦予"),
                ]);
            }
            else {
                console.warn(`Event(verify) - onVerify() - Error - 找不到此Discord用戶資料`);
            }
        }
        catch (error) {
            console.warn(`Event(verify) - onVerify() - Error - ${error}`);
        }
    });
}
/// 收到捐款Event，進行處理
/// 此為模擬範例
function onDonation(paymentSource, paymentId, senderName, amount, message, timestamp) {
    return __awaiter(this, void 0, void 0, function* () { });
}
//----------------------------------------------------------------
bot.on("messageCreate", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const content = msg.content;
    console.warn("Event - messageCreate -", content);
    // 該機器人將只接受在公共頻道中發出的訊息
    if (!msg.channel.guild) {
        // Check if the message was sent in a guild
        return bot.createMessage(msg.channel.id, "This command can only be run in a server.");
    }
    // 頻道資訊
    serverGuild = msg.channel.guild;
    // 忽略任何的一般訊息
    // 機器人只允許指令訊息
    if (!content.startsWith(PREFIX)) {
        console.warn("Not a command message");
        return;
    }
    // 取得指令名稱
    const parts = content
        .split(" ")
        .map((s) => s.trim())
        .filter((s) => s);
    const commandName = parts[0].substr(PREFIX.length);
    console.log("Receive command - ", commandName);
    // 取得指令對應的處理函式
    const commandHandler = commandHandlerForCommandName.get(commandName);
    if (!commandHandler) {
        console.warn("Not find this command - ", commandName);
        return;
    }
    // 檢查是否為機器人擁有者才能使用的指令
    const authorIsBotOwner = msg.author.id === config_1.BOT_OWNER_ID;
    if (commandHandler.botOwnerOnly && !authorIsBotOwner) {
        return yield bot.createMessage(msg.channel.id, "抱歉，這個指令只有機器人擁有者能夠使用哦");
    }
    // 取得指令後方帶的所有參數，用空格分開
    const args = parts.length > 0 ? parts.slice(1) : [];
    console.log(`This command '${commandName}' has args - `, args);
    try {
        // 指令處理
        yield commandHandler.execute(msg, args);
    }
    catch (error) {
        console.warn(`Error - ${error}`);
        yield bot.createMessage(msg.channel.id, "指令的訊息格式錯誤，無法處理！");
    }
}));
bot.on("interactionCreate", (interaction) => {
    if (interaction instanceof eris_1.ComponentInteraction) {
        const customId = interaction.data.custom_id;
        if (customId == "click-verify") {
            return displayWebsiteButton(interaction);
        }
    }
});
bot.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connected and ready.");
    displayVerifiedLinkButton();
}));
bot.on("error", (err) => {
    console.warn(err);
});
bot.on("guildCreate", (guild) => {
    console.log(`New guild: ${guild.name}`);
});
// 監聽Webhook Server的Socket event
webhook_listener_js_1.default.on("verify", onVerify);
webhook_listener_js_1.default.on("donation", onDonation);
bot.connect();
//# sourceMappingURL=bot.js.map