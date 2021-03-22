var Discord = require("discord.js");

exports.module = {
	commands: ["emoji","emojis"],
	description: "View the details of a custom emoji, or list the custom emojis in this server.",
	syntax: ":emoji:",
	tags: [],
	process: function(client, msg, argv) {
		var params = argv.slice(1).join(" ");
		if (params.length > 0) {
			var emojiRegex = /<(a?):(\w+):(\d+)>/;
			var idRegex = /^\d+$/;
			if(!msg.channel.permissionsFor(client.user).has("EMBED_LINKS")) {
				var regex = emojiRegex.exec(msg.content);
				if(params.match(emojiRegex)) {
					msg.reply(`https://cdn.discordapp.com/emojis/${regex[3]}.${regex[1] == "a" ? "gif" : "png"}?v=1`);
				}
			} else {
				if(params.match(emojiRegex)) {
					var regex = emojiRegex.exec(msg.content),
						emoji = client.emojis.resolve(regex[3]),
						embed = new Discord.MessageEmbed({
						title: `${emoji !== null ? (emoji.requiresColons ? ":"+emoji.name+":" : emoji.name) : ":" + regex[2] + ":"}`,
						image: {
							url: `https://cdn.discordapp.com/emojis/${regex[3]}.${regex[1] == "a" ? "gif" : "png"}?v=1`
						},
						url: `https://cdn.discordapp.com/emojis/${regex[3]}.${regex[1] == "a" ? "gif" : "png"}?v=1`,
						timestamp: Discord.SnowflakeUtil.deconstruct(regex[3]).date,
						color: 16426522
					});
					if(emoji !== null) {
						embed.setFooter(emoji.guild.name,emoji.guild.iconURL({size:4096,format:"png",dynamic:true}));
					}
					msg.reply(undefined,{embed: embed});
				} else if(idRegex.test(params)) {
					var id = params;
						emoji = client.emojis.resolve(id),
						embed = new Discord.MessageEmbed({
						image: {
							url: `https://cdn.discordapp.com/emojis/${id}.${emoji !== null && emoji.animated ? "gif" : "png"}?v=1`
						},
						url: `https://cdn.discordapp.com/emojis/${id}.${emoji !== null && emoji.animated ? "gif" : "png"}?v=1`,
						timestamp: Discord.SnowflakeUtil.deconstruct(id).date,
						color: 16426522
					});
					if(emoji !== null) {
						embed.setTitle(emoji.requiresColons ? ":"+emoji.name+":" : emoji.name);
						embed.setFooter(emoji.guild.name,emoji.guild.iconURL({size:4096,format:"png",dynamic:true}));
					}
					msg.reply(undefined,{embed: embed});
				}
			}
		} else {
			if(msg.channel.permissionsFor(client.user).has("EMBED_LINKS")) {
				var emojis = msg.guild.emojis.cache,
					static = emojis.filter(emoji => !emoji.animated),
					animated = emojis.filter(emoji => emoji.animated)
					embed = new Discord.MessageEmbed({
						author: {
							name: msg.guild.name,
							iconURL: msg.guild.iconURL({size:2048}).replace(".webp",".png")
						},
						title: "Emoji List",
						color: 16426522,
						footer: {
							text: `${emojis.size} total: ${static.size} static, ${animated.size} animated`
						}
					});
				var emojiList = "";
				emojis.array().forEach((emoji, i) => {
					emojiList += `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}> \`:${emoji.name}:\`\n`
					if ((i+1) % 10 === 0 || i+1 == emojis.size){
						embed.addField("\u200B",emojiList,true);
						emojiList = "";
					}
				});
				msg.reply(undefined,{embed: embed});
			}
		}

	}
};
