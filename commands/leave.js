module.exports = {
	name: 'leave',
	description: 'Disconnects the music bot',
	execute(message) {
		const client = message.client;
        client.destroy();    
    },
};