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
	let items = {
		orbs: {},
		pants: {}
	};
	const slots = {
		'8': 'orbs',
		'9': 'pants'
	}
	Object.keys(slots).map(async slot => {
		await (
		axios.get(`${url}backpack.php?suid=${id}&rg_sess_id=${stuff.session.session}&serverid=${stuff.serverid}${slots[slot] === 'orbs' ? '&orb=1' : ''}`)
			.then(res => {
				let itemIds = [];
				const results = res.data.split('img');
				results.slice(1).map(item => {
					let itemId;
						item.indexOf(`'${slot}');`) !== -1 ? (itemId = item.split(`itempopup(event,'`)[1],
						(itemId && itemId.indexOf(`')"`) !== -1) ? (
						itemId = itemId.split(`')"`)[0],
						itemId.length > 0 ? itemIds.push(itemId) : ''
						) : null ) : '';
					//console.log(itemId);
					//stuff.message.reply('hey');
				})
				checkStats(url, id, slots[slot], {message: stuff.message, serverid: stuff.serverid, session: stuff.session, ids: itemIds}, (skillItems, itemId) => {
					items[slots[slot]][itemId] = skillItems;
					console.log(items);
				})
			})
			.catch(o_O => {
				console.log(o_O);
				return stuff.message.reply('Error. Please check logs.');
			})
		)
	})
		console.log(items);
		cb(items);
		return items;
}


const checkStats = (url, id, slot, stuff, cb = () => {}) => {
	let skillItems = {};
	stuff.ids.map(async item => {
		await (axios.get(`${url}itemlink.php?suid=${id}&rg_sess_id=${stuff.session.session}&id=${item}&serverid=${stuff.serverid}`)
			.then(res => {
			//console.log(res.data);
			const skills = res.data.split('color:#00FF00').slice(1);
			let iskills = {};
			skills.map(item => {
				const skill = item.split('>')[1].split('<')[0];
				iskills[skill.split(' ')[1]] = skill.split('+')[1].split(' ')[0];
			})
			skillItems = iskills;
			cb(skillItems, item);
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
		)
	})
}


