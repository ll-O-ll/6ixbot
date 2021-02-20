module.exports = {
    name: "queue",
    description: "Display the queue of songs in your channel",
    async execute(message) {                                                   
          const serverQueue = message.client.queue.get(message.guild.id);   
          const voiceChannel = message.member.voice.channel;
          if (!voiceChannel)
            return message.channel.send(
              "You need to be in a voice channel to play music!"
            );
          const permissions = voiceChannel.permissionsFor(message.client.user);
          if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
              "I need the permissions to join and speak in your voice channel!"
            );
          }
    
          const songInfo = await ytdl.getInfo(args[1]);
          const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
          };
    
          if (!serverQueue) {
            return message.channel.send(
                `There are no songs currently queued`
                );
            } else {
                let str = '';
                for (const song in serverQueue.songs) {
                    str += `Title: ${song}, Duration: ${song.duration}`
                }
            return message.channel.send(str);
        
            }
      }
};