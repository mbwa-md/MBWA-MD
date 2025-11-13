const { cmd } = require("../command");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

cmd({
  pattern: "vv",
  alias: ["viewonce", 'retrive', 'antivv', 'avv', 'open', 'openphoto', 'openvideo', 'vvphoto'],
  react: '🐳',
  desc: "Owner Only - retrieve quoted view once message back to user",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    // React immediately
    await client.sendMessage(from, { react: { text: "😃", key: message.key } });

    if (!isCreator) {
      await client.sendMessage(from, { react: { text: "😊", key: message.key } });
      return await client.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }

    if (!message.quoted) {
      await client.sendMessage(from, { react: { text: "😊", key: message.key } });
      return await client.sendMessage(from, {
        text: "*𝙷𝙰𝚂 𝙰𝙽𝚈𝙾𝙽𝙴 𝚂𝙴𝙽𝚃 𝚈𝙾𝚄 𝙿𝚁𝙸𝚅𝙰𝚃𝙴 𝙿𝙷𝙾𝚃𝙾, 𝚅𝙸𝙳𝙴𝙾 𝙾𝚁 𝙰𝚄𝙳𝙸𝙾 🥺 𝙰𝙽𝙳 𝚈𝙾𝚄 𝚆𝙰𝙽𝚃 𝚃𝙾 𝚂𝙴𝙴 𝙸𝚃 🤔*\n\n*𝚃𝙷𝙴𝙽 𝚆𝚁𝙸𝚃𝙴 𝙻𝙸𝙺𝙴 𝚃𝙷𝙸𝚂 ☺️*\n\n*❮ .vv ❯*\n\n*𝚃𝙷𝙴𝙽 𝚃𝙷𝙰𝚃 𝙿𝚁𝙸𝚅𝙰𝚃𝙴 𝙿𝙷𝙾𝚃𝙾, 𝚅𝙸𝙳𝙴𝙾 𝙾𝚁 𝙰𝚄𝙳𝙸𝙾 𝚆𝙸𝙻𝙻 𝙾𝙿𝙴𝙽 🥰*"
      }, { quoted: message });
    }

    const quotedMsg = message.quoted;
    let mtype = quotedMsg.mtype;
    
    // Alternative way to detect media type if mtype is not available
    if (!mtype && quotedMsg.message) {
      const msgKeys = Object.keys(quotedMsg.message);
      if (msgKeys.includes("imageMessage")) mtype = "imageMessage";
      else if (msgKeys.includes("videoMessage")) mtype = "videoMessage";
      else if (msgKeys.includes("audioMessage")) mtype = "audioMessage";
    }

    if (!["imageMessage", "videoMessage", "audioMessage"].includes(mtype)) {
      await client.sendMessage(from, { react: { text: "🥺", key: message.key } });
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a view once message!*\n*𝚈𝙾𝚄 𝙾𝙽𝙻𝚈 𝙽𝙴𝙴𝙳 𝚃𝙾 𝙼𝙴𝙽𝚃𝙸𝙾𝙽 𝚃𝙷𝙴 𝙿𝙷𝙾𝚃𝙾, 𝚅𝙸𝙳𝙴𝙾 𝙾𝚁 𝙰𝚄𝙳𝙸𝙾 🥺*"
      }, { quoted: message });
    }

    let buffer;
    
    // Try using downloadContentFromMessage for better compatibility
    try {
      const mediaType = mtype.replace("Message", "");
      const stream = await downloadContentFromMessage(
        quotedMsg.message?.[mtype] || quotedMsg, 
        mediaType
      );
      
      buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
    } catch (downloadError) {
      // Fallback to original download method
      console.log("Using fallback download method:", downloadError.message);
      buffer = await quotedMsg.download();
    }

    const options = { quoted: message };
    let messageContent = {};

    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: quotedMsg.text || quotedMsg.caption || '',
          mimetype: quotedMsg.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: quotedMsg.text || quotedMsg.caption || '',
          mimetype: quotedMsg.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: quotedMsg.mimetype || "audio/mp4",
          ptt: quotedMsg.ptt || false
        };
        break;
      default:
        await client.sendMessage(from, { react: { text: "😔", key: message.key } });
        return await client.sendMessage(from, {
          text: "❌ Only image, video, and audio messages are supported"
        }, { quoted: message });
    }

    await client.sendMessage(from, messageContent, options);
    
    // React with success
    await client.sendMessage(from, { react: { text: "😍", key: message.key } });

  } catch (error) {
    console.error("vv Error:", error);
    await client.sendMessage(from, { react: { text: "😔", key: message.key } });
    await client.sendMessage(from, {
      text: "❌ Error fetching vv message:\n" + error.message + "\n\n*𝙿𝙻𝙴𝙰𝚂𝙴 𝚆𝚁𝙸𝚃𝙴 ❮ .vv ❯ 𝙰𝙶𝙰𝙸𝙽 🥺*"
    }, { quoted: message });
  }
});
