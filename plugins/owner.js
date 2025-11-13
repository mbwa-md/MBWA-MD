const { cmd } = require('../command');

cmd({
    pattern: "owner",
    desc: "Contact the bot owner",
    react: "👑",
    category: "owner",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const ownerInfo = `
👑 *SILA-MD OWNER* 👑

🤖 *Bot Name:* Sila-Md
👨‍💻 *Developer:* Sir Sila
📞 *Contact:* +255612491554
📧 *Email:* silatrix22@email.com

💬 *For any issues or inquiries, feel free to contact the owner!*

🔗 *Powered by Sila-Md*
        `.trim();

        // Send owner info as text
        await reply(ownerInfo);

        // You can also send owner's contact card if needed
        // const vcard = 'BEGIN:VCARD\n' +
        //     'VERSION:3.0\n' +
        //     'FN:Sila\n' +
        //     'ORG:Sila-Md Developer;\n' +
        //     'TEL;type=CELL;type=VOICE;waid=255612491554:+255612491554\n' +
        //     'END:VCARD';
        // await conn.sendMessage(from, {
        //     contacts: {
        //         displayName: 'SILA MD',
        //         contacts: [{ vcard }]
        //     }
        // }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
