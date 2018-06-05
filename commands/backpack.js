const axios = require('axios');


exports.activate = (url, id, items, numA, stuff) => {
	items.slice(0, numA).map(async item => {
		await axios.get(`${url}home.php?suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${stuff.session}&itemaction=${item}`)
			.then(res=> {
				return;
			})
			.catch(o_O=> {
				console.log(o_O);
				return stuff.message.reply('Error. Please check logs.');
			})
	})
	return stuff.message.reply('Finished activating.')
}

exports.getItem = (url, id, item, stuff, cb = () => {}) => {
	axios.get(`${url}backpack.php?suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${stuff.session}`)
		.then(res=> {
			item = item.toLowerCase();
			const page = res.data.toLowerCase();
			const items = page.split(item);
			items.slice(1).map((item, index) => {
				items[index] = item.split('popup(event')[1].split("'")[1];
			});
			cb(items.slice(0, items.length-1));
			return;
		})
		.catch(o_O=> {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
}