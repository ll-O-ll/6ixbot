module.exports = {
	name: "pause",
	description: 'P ause the current song that is playing.',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (serverQueue) {
        	serverQueue.connection.dispatcher.pause();
        }
	},
};
