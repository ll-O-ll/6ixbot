module.exports = {
	name: 'resume',
	description: 'Resume the current song that is playing.',
	execute(message) {
    const args = message.content.split(" ");
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!args[1]) {
      if (serverQueue) {
        serverQueue.connection.dispatcher.resume();
      }
      else {
        return message.channel.send("Your queue is empty");
      }
    }
	},
	
};