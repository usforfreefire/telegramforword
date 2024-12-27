const TelegramBot = require('node-telegram-bot-api');

// Your bot token
const BOT_TOKEN = '7324788812:AAE5Ucej5dPx4YJmebSv0lO_urEqp4zclPE';
// Target group chat IDs
const TARGET_GROUP_1_ID = -1002268640365;
const TARGET_GROUP_2_ID = -1002406219010;
// Excluded group chat IDs
const EXCLUDED_GROUPS = [TARGET_GROUP_1_ID, TARGET_GROUP_2_ID];

// Create a new bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Function to get or create a permanent group invite link
async function getPermanentGroupInviteLink(chatId) {
    try {
        const inviteLink = await bot.createChatInviteLink(chatId, {
            expire_date: 0, // Permanent link
            member_limit: 0, // No member limit
        });
        return inviteLink.invite_link;
    } catch (error) {
        console.error('Error creating invite link:', error.message);
        return null;
    }
}

bot.on('message', async (msg) => {
    const senderId = msg.from.id;
    const senderName = msg.from.first_name || msg.from.username || 'Unknown';
    const caption = msg.caption || '';

    // Skip messages from excluded groups
    if (EXCLUDED_GROUPS.includes(msg.chat.id)) {
        return;
    }

    try {
        let groupInviteLink = null;

        // Only create a group invite link if the message is from a group or channel
        if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
            groupInviteLink = await getPermanentGroupInviteLink(msg.chat.id);
        }

        // Caption for the first target group
        let captionForTarget1 = `<a href="tg://user?id=${senderId}">${senderId}</a>`;
        if (groupInviteLink) {
            captionForTarget1 += `, <a href="${groupInviteLink}">${msg.chat.title || 'Group'}</a>`;
        }
        captionForTarget1 += `\n\n${caption}`;

        // Caption for the second target group
        let captionForTarget2 = `<code>${senderId}</code>\n\n${caption}`;

        const optionsTarget1 = {
            parse_mode: 'HTML',
            caption: captionForTarget1,
        };

        const optionsTarget2 = {
            parse_mode: 'HTML',
            caption: captionForTarget2,
        };

        // Forward media to the first group
        if (msg.photo) {
            await bot.sendPhoto(TARGET_GROUP_1_ID, msg.photo[msg.photo.length - 1].file_id, optionsTarget1);
        } else if (msg.video) {
            await bot.sendVideo(TARGET_GROUP_1_ID, msg.video.file_id, optionsTarget1);
        } else if (msg.document) {
            await bot.sendDocument(TARGET_GROUP_1_ID, msg.document.file_id, optionsTarget1);
        } else if (msg.audio) {
            await bot.sendAudio(TARGET_GROUP_1_ID, msg.audio.file_id, optionsTarget1);
        } else if (msg.voice) {
            await bot.sendVoice(TARGET_GROUP_1_ID, msg.voice.file_id, optionsTarget1);
        } else if (msg.sticker) {
            await bot.sendSticker(TARGET_GROUP_1_ID, msg.sticker.file_id);
        } else if (msg.animation) {
            await bot.sendAnimation(TARGET_GROUP_1_ID, msg.animation.file_id, optionsTarget1);
        }

        // Forward media to the second group
        if (msg.photo) {
            await bot.sendPhoto(TARGET_GROUP_2_ID, msg.photo[msg.photo.length - 1].file_id, optionsTarget2);
        } else if (msg.video) {
            await bot.sendVideo(TARGET_GROUP_2_ID, msg.video.file_id, optionsTarget2);
        } else if (msg.document) {
            await bot.sendDocument(TARGET_GROUP_2_ID, msg.document.file_id, optionsTarget2);
        } else if (msg.audio) {
            await bot.sendAudio(TARGET_GROUP_2_ID, msg.audio.file_id, optionsTarget2);
        } else if (msg.voice) {
            await bot.sendVoice(TARGET_GROUP_2_ID, msg.voice.file_id, optionsTarget2);
        } else if (msg.sticker) {
            await bot.sendSticker(TARGET_GROUP_2_ID, msg.sticker.file_id);
        } else if (msg.animation) {
            await bot.sendAnimation(TARGET_GROUP_2_ID, msg.animation.file_id, optionsTarget2);
        }
    } catch (error) {
        console.error('Error processing message:', error.message);
    }
});
