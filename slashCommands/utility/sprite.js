const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require("path");
const axios = require("axios");
const { load } = require("cheerio");

// Read the JSON file
const filePath = path.resolve(__dirname, "../../items.json");
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

module.exports = {
	name: 'sprite',
	description: "Get an items sprite.",
	type: ApplicationCommandType.ChatInput,
	options: [
        {
            name: 'name',
            description: 'Item Name',
            type: 3,
            required: true,
            autocomplete: true
        }
    ],
    autocomplete: (interaction, choices) => {
        const input = toTitleCase(interaction.options.getString('name'));
        if (input.length < 1) return;
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].Name.startsWith(input) && !data[i].Name.includes("Seed")) {
                choices.push({
                    name: `${data[i].Name}`,
                    value: `${data[i].Name}`
                });
                count++;
                if (count >= 7) break;
            }
        }
        interaction.respond(choices).catch(console.error);
    },    
	run: async (client, interaction) => {
        const itemName = interaction.options.get('name').value;
        if(itemName) {

            let imageUrl = await getImage(itemName);
            imageUrl = imageUrl.replace("h/32/x", "h/118/x");
            const embed = new EmbedBuilder()
                .setTitle(`Sprite of **${itemName}**`)
                .setURL(imageUrl)
                .setImage(imageUrl)
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setColor('#36393f')
                
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            setTimeout(() => {
                message.delete();
            }, 5 * 60 * 1000);
        }
    }    
};

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

async function getImage(x) {
    try {
        const encodedInput = encodeURIComponent(x);

        const link = `https://growtopia.wikia.com/wiki/` + encodedInput;

        const getData = (await axios.get(link)).data;
        const $ = load(getData);

        const Sprite = $("div.card-header .growsprite > img").attr("src");
        if (!Sprite) return undefined;

        return Sprite.replace("webp", "png");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error?.response;
        } else {
            throw error;
        }
    }
}