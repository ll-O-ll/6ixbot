module.exports = {
	name: "pause",
	description: 'P ause the current song that is playing.',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
        serverQueue.connection.dispatcher.pause();
        // dispatcher.pause();
		// return message.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
	},
};
