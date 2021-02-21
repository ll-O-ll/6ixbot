module.exports = {
	name: 'leave',
	description: 'Disconnects the bot from the audio channel',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
        serverQueue.connection.dispatcher.end();  
    },
};