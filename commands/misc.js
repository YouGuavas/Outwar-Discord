const axios = require('axios');

exports.nameToId = (url, name, stuff, cb = () => {}) => {
	axios.get(`${url}profile.php?transnick=${name}&serverid=${stuff.serverid}`)
		.then(res => {
			const id = res.data.split('allies.php?uid=')[1].split(`">`)[0];
			stuff.message ? stuff.message.reply(id) : '';
			cb(id);
			return id;
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
}
exports.getFirstId = (url, stuff, cb = () => {}) => {
	axios.get(`${url}accounts.php?rg_sess_id=${stuff.session}&ac_serverid=${stuff.serverid}`)
		.then(res => {
			const id = res.data.split('world.php?suid=')[1].split('&serverid')[0];
			cb(id);
			return id;
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
}
exports.getAllIds = (url, stuff, cb = () => {}) => {
	axios.get(`${url}accounts.php?rg_sess_id=${stuff.session}&ac_serverid=${stuff.serverid}`)
		.then(res => {
		const rows = res.data.split('<tr>');
		const ids = [];
		rows.map(item => {
			item.indexOf('world.php?suid=') !== -1 ? ids.push(item.split('world.php?suid=')[1].split('&serverid')[0]) : null;
		})
		//console.log(ids);
		cb(ids);
		return ids;
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
}
exports.tokenClaim = (url, id, stuff, cb = () => {}) => {
	axios.get(`${url}ajax/challenge_claim.php?suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${stuff.session}`)
		.then(res => {
			cb(res.data.result);
			return;
		})
		.catch(o_O => {
			console.log(o_O);
			//stuff.message.reply('Error. Please check logs.');
			return 'bad'
		})
}