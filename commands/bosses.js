const axios = require('axios');
const bossNames = ['Blackhand Reborn', 'Cosmos, Great All Being', 'Death, Reaper of Souls', 'Juggernaut, Unstoppable Force'];
exports.bossStats = (url, stuff) => {
	axios.get(`${url}crew_bossspawns?rg_sess_id=${stuff.session.session}&suid=${stuff.checker}&serverid=${stuff.serverid}`)
		.then((res) => {
			const page = res.data.split('BossSpawnTop')[1].split('foot_box')[0];
			//trim the fat

			let bosses = {};
			page.split('BossSpawnTile').map((item,index) => {
				item.indexOf('formraid.php') !== -1 ? bosses[item.split('target=')[2].split('</')[0].split('>')[1]] = item.split('target=')[2].split('\n')[1] : ''
				//if boss is alive, log its name and percentage
			});
			let stringified = '';
			Object.keys(bosses).map(item => {
				stringified += `\n**${item}:** ${bosses[item]}`
				//convert bosses object into a beautiful discord string
			});
			stuff.message.channel.send(stringified);
			return;
		})
		.catch((err) => {
			console.log(err);
			return stuff.message.reply('Error. Please check logs.');
		})
}
exports.statsBoss = (url, boss, stuff) => {
	let bossName = '';
	bossNames.map(item => {
		(boss.toLowerCase() === item.toLowerCase().slice(0, boss.length) && bossName.length === 0) ? bossName = item : ''
		//search bossNames for an item whose beginning matches the provided boss name
	});
	axios.get(`${url}crew_bossspawns?rg_sess_id=${stuff.session.session}&suid=${stuff.checker}&serverid=${stuff.serverid}`)
		.then(res => {
			const page = res.data.split('BossSpawnTop')[1].split('foot_box')[0];
			//trim the fat
			let bosses = {};
			page.split('BossSpawnTile').map((item,index) => {
				item.indexOf(bossName) !== -1 ? bosses[bossName] = item.split('boss_stats')[1].split('spawnid=')[1].split('"')[0] : ''
				//Is this boss the boss I want? If yes, log its spawnid
			});
			axios.get(`${url}boss_stats.php?spawnid=${bosses[bossName]}&rg_sess_id=${stuff.session.session}&suid=${stuff.checker}&serverid=${stuff.serverid}`)
				.then(res => {
					const page = res.data.split('Items recieved')[1].split('</table>')[0];
					//trim the fat
					let drops = {};
					page.split('<tr>').map((item, index) => {
						let crewName = '';
						item.indexOf('crew_profile') !== -1 ? crewName = item.split('CC0000">')[1].split('</font>')[0] : '';
						//Is this item a crew name? If yes, let the program know that.
						crewName.length > 0 ? drops[crewName] = {} : '';
						//Do we have a crew name? If yes, put it in drops
						item.split('<td ').map(jtem => {
							jtem.toLowerCase().indexOf('onmouseover') !== -1 ? drops[crewName].drops = jtem.split('00000">')[1].split('</font')[0] : jtem.toLowerCase().indexOf('00000">') !== -1 ? drops[crewName].damage = jtem.split('00000">')[1].split('</font')[0] : '';
							//onmouseover lets us know whether this item is drops or damage. drops have onmouseover properties.
						})
					})
					let msg = `--**Stats for ${bossName}**--`;
					Object.keys(drops).map(item => {
						msg += `\n\n**${item}:**\n**Damage:** ${drops[item].damage}    **Drops:** ${drops[item].drops}`;
						//convert data into a beautiful Discord string
					});
					return stuff.message.reply(msg);
				})
				.catch(err => {
					console.log(err);
					return stuff.message.reply('Error. Please check logs.');
				})
		})
		.catch(err => {
			console.log(err);
			return stuff.message.reply('Error. Please check logs.');
		})
}