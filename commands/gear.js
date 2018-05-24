const axios = require('axios');
const Skills = require('./skills');

exports.myGear = (url, id, stuff, cb = () => {}) => {
	axios.get(`${url}equipment.php?suid=${id}&rg_sess_id=${stuff.session.session}&serverid=${stuff.serverid}`)
		.then(res => {
			const results = res.data.split('img');
			let items = {};
			let count = 0;
			results.slice(1).map(item => {
				const itemName = item.split('alt="')[1].split('">')[0];
				items[itemName] = { id: item.split(`removeItem('`)[1].split(`'`)[0] };
				item.indexOf('slot9') !== -1 ? items[itemName].pants = true : null;
				item.indexOf('slot8') !== -1 ? items[itemName].orb = true : '';
				items[itemName].orb ? Object.keys(items).indexOf(itemName) !== -1 ? (
					count++,
					items[itemName].count = count
					) : null : null;
 			})
 			cb(items);
			return items;
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
}

exports.skillGear = (url, id, stuff, cb = () => {}) => {
	axios.get(`${url}backpack.php?suid=${id}&rg_sess_id=${stuff.session.session}&serverid=${stuff.serverid}&orb=1`)
		.then(res => {
			const results = res.data.split('img');
			let items = {};
			results.slice(1).map(item => {
				const itemId = item.split(`itempopup(event,'`)[1].split(`')"`)[0];
				stuff.message.reply('hey');
			})
			cb(items);
			return items;
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
}


const checkStats = (item, id, stuff) => {
	axios.get(`${url}itemlink.php?suid=${id}&rg_sess_id=${stuff.session.session}&serverid=${stuff.serverid}`)

}


