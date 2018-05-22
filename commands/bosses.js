const axios = require('axios');
exports.bossStats = (url, stuff) => {
	axios.get(`${url}crew_bossspawns?rg_sess_id=${stuff.session.session}&suid=${stuff.checker}&serverid=${stuff.serverid}`)
		.then((res) => {
			const page = res.data.split('BossSpawnTop')[1].split('foot_box')[0];
			let bosses = {};
			page.split('BossSpawnTile').map((item,index) => {
				item.indexOf('formraid.php') !== -1 ? bosses[item.split('target=')[2].split('</')[0].split('>')[1]] = item.split('target=')[2].split('\n')[1] : ''
			});
			let stringified = '';
			Object.keys(bosses).map(item => {
				stringified += `\n**${item}:** ${bosses[item]}`
			});
			stuff.message.channel.send(stringified);
			return;
		})
		.catch((err) => {
			console.log(err);
			stuff.message.reply('Error. Please check logs.');
		})
}