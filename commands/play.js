const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const ytpl = require("ytpl");

module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  async execute(message) {
    try {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                               '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                               '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                               '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                               '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                               '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      const options = {limit: 1};
      const args = message.content.split(" ");
      const queue = message.client.queue;
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

      if (!serverQueue) {
        var queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };
      
        queue.set(message.guild.id, queueContruct);
      }

      if (!!pattern.test(args[1])) {

        if (args[1].indexOf('playlist') > -1) {
          const playlist = await ytpl(args[1]);
          for (idx in playlist.items) {
            var numSongs = idx;
            var song = {
              title: playlist.items[idx].title,
              duration: playlist.items[idx].duration,
              url: playlist.items[idx].url
            };
            queueContruct.songs.push(song);
          }
          return message.channel.send(
            `${numSongs} songs has been added to the queue!`
          );
        }

        else {
            const songInfo = await ytdl.getInfo(args[1]);
            const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
            };
            queueContruct.songs.push(song);
        }
      }

      else {
        songInfo = await (await ytsr(args.slice(1,).join(" "), options)).items[0];
        var song = {
          title: songInfo.title,
          duration: songInfo.duration,
          url: songInfo.url
        };
        console.log(song);
        queueContruct.songs.push(song); 
      }

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          this.play(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      if (serverQueue) {
        serverQueue.songs.push(song);
        return message.channel.send(
          `${song.title} has been added to the queue!`
        );
      }
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  play(message, song) {
    const queue = message.client.queue;
    const args = message.content.split(" ");
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    if (args[1]) {
      const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          serverQueue.songs.shift();
          this.play(message, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    }
    // dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`); // can change this to embed message
  }
};
