const { cmd } = require("../command");
const fetch = require('node-fetch');

cmd({
  pattern: "song",
  alias: ["play", "mp3", "audio", "music", "s", "so", "son", "songs"],
  react: '🎵',
  desc: "Download YouTube song (Audio) via Nekolabs API",
  category: "download",
  filename: __filename
}, async (client, message, match, { from }) => {
  try {
    const text = match || message.message?.conversation || "";

    if (!text) {
      return await client.sendMessage(from, {
        text: "*🎵 Do you want to download any audio?*\n\n*Then write like this:*\n*.song <audio name>*\n\n*Example:* .song shape of you\n\n*Then that audio will be downloaded and sent here! 🎧*"
      }, { quoted: message });
    }

    // React with searching emoji
    await client.sendMessage(from, { 
      react: { text: "🔍", key: message.key } 
    });

    // API Call (Nekolabs)
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data?.success || !data?.result?.downloadUrl) {
      await client.sendMessage(from, { 
        react: { text: "❌", key: message.key } 
      });
      return await client.sendMessage(from, {
        text: "*❌ Your audio could not be found!*\n\nPlease try another song name."
      }, { quoted: message });
    }

    const meta = data.result.metadata;
    const dlUrl = data.result.downloadUrl;

    // Try fetching the thumbnail
    let buffer;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {
      buffer = null;
    }

    // Song info card
    const caption = `*🎵 AUDIO INFO 🎵*

*📝 Title:* ${meta.title}
*👤 Channel:* ${meta.channel}
*⏱️ Duration:* ${meta.duration}
*💫 Powered by Silas MD*`;

    // Send thumbnail + info
    if (buffer) {
      await client.sendMessage(from, { 
        image: buffer, 
        caption 
      }, { quoted: message });
    } else {
      await client.sendMessage(from, { 
        text: caption 
      }, { quoted: message });
    }

    // Send MP3 file
    await client.sendMessage(from, {
      audio: { url: dlUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: message });

    // React with success
    await client.sendMessage(from, { 
      react: { text: "✅", key: message.key } 
    });

  } catch (error) {
    console.error("Song download error:", error);
    
    await client.sendMessage(from, { 
      react: { text: "❌", key: message.key } 
    });
    
    await client.sendMessage(from, {
      text: `*❌ Error downloading song!*\n\nPlease try again later.\n\nError: ${error.message}`
    }, { quoted: message });
  }
});
