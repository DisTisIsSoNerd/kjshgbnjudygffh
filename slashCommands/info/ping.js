const { ApplicationCommandType } = require('discord.js');

module.exports = {
	name: 'ping',
	description: "Check bot's ping.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
		await interaction.reply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply({ content: `🏓 Pong! Latency: **${Math.round(client.ws.ping)} ms**` });
	}
};