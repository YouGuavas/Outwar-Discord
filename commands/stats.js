const axios = require('axios');
exports.stats = (name, message, url) => {
		axios.get(`${url}profile.php?transnick=${name}`)
			.then((res) => {
				const data = res.data;
				const image = data.split('id="divPlayerPic"')[1].split('img src="')[1].split('">')[0],
						name = data.split('id="divHeaderName"')[1].split('(')[0].split('">')[1],
						power = data.split('TOTAL POWER')[1].split('size="2">')[1].split('</')[0],
						eleDmg = data.split('ELEMENTAL ATTACK')[1].split('size="2">')[1].split('<')[0];
				return message.reply(`\n**Name:** ${name}\n**Total Power:** ${power}\n**Elemental Damage:** ${eleDmg}\n`, {files: [image]})
			})
			.catch((err) => {
				console.log(err);
				return message.reply("There's been an error. Please check your logs for more info.")
			})
	}
