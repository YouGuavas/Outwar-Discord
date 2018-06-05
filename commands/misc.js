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