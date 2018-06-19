const axios = require('axios');
exports.stats = (name, url, stuff) => {
		axios.get(`${url}profile.php?transnick=${name}`)
			.then((res) => {
				const data = res.data;
				let image = data.split('id="divPlayerPic"')[1].split('img src="')[1].split('">')[0];
				const name = data.split('id="divHeaderName"')[1].split('(')[0].split('">')[1],
						power = data.split('TOTAL POWER')[1].split('size="2">')[1].split('</')[0],
						eleDmg = data.split('ELEMENTAL ATTACK')[1].split('size="2">')[1].split('<')[0];
				image.slice(0, 1) === '/' ? image = null : null;
				return image ? stuff.message.reply(`\n**Name:** ${name}\n**Total Power:** ${power}\n**Elemental Damage:** ${eleDmg}\n`, {files: [image]}) : (
					stuff.message.reply(`\n**Name:** ${name}\n**Total Power:** ${power}\n**Elemental Damage:** ${eleDmg}\n`)
						)
			})
			.catch((err) => {
				console.log(err);
				return stuff.message.reply("There's been an error. Please check your logs for more info.")
			})
	}
