const axios = require('axios');
const mongo = require('mongodb').MongoClient;

exports.attackRoom = (url, id, numA, stuff, cb=()=>{}) => {
	let mobs = {};
	axios.get(`${url}ajax_changeroomb.php?suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${stuff.session}`)
	.then(res => {
		
		const page = res.data.roomDetails;
		page.split('<b>').map((item, index) => {
			item.indexOf('somethingelse') !== -1 ? mobs[index] = {[item.split('</b>')[0]]: {somethingelse: `somethingelse.php?${item.split('somethingelse.php?')[1].split('">')[0]}`}} : '';
			//item.indexOf('somethingelse') !== -1 ? console.log(item) : '';
		})
		Object.keys(mobs).map(item => {
			attack(url, id, {message: stuff.message, session: stuff.session, serverid: stuff.serverid, mob: mobs[item]});
		});
		numA > 1 ? cb(url, id, numA-1, {message: stuff.message, login: stuff.login, session: stuff.session, serverid: stuff.serverid}, cb) : stuff.message.reply('Done attacking.');
		return;
	})
	.catch(o_O => {
		console.log(o_O);
		return stuff.message.reply('Error. Please check logs.');
	})
	
}


exports.mover = (url, id, path, stuff, cb = () => {}) => {
	path.map(async item => {
		await(move(url, id, item, stuff, cb))
	})
}

exports.move = (url, id, path, index, stuff, cb = () => {}) => {
	const moveRL = `${url}ajax_changeroomb.php?suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${stuff.session.session}`;
	//console.log(moveRL)
	const directions = ['north', 'south', 'east', 'west'];
	let dir = path[index];
	console.log(dir);
	if (directions.indexOf(dir.toLowerCase()) !== -1) {
		axios.get(moveRL)
			.then(res => {
			//console.log(res.data);
				const cur = res.data.curRoom;
				const next = res.data[dir];
				axios.get(`${moveRL}&lastroom=${cur}&room=${next}`)
					.then(result => {
						index < path.length-1 ? cb(url, id, path, index+1, stuff, cb) : stuff.message.reply("Finished moving.");
						return;
					})
					.catch(o_O => {
						console.log(o_O);
						return;
					})
			})
			.catch(o_O => {
				return
			})
		} else {
			const tpKey = dir.split(`'`)[1].replace('-', ' ');
			dir = dir.split('(')[0];
			console.log(dir);
			const fn = helpers[dir];
			fn(url, id, tpKey, stuff, cb(url, id, path, index+1, stuff, cb));
			//index < path.length-1 ? cb(url, id, path, index+1, stuff, cb) : stuff.message.reply("Finished moving.");
			return;
		}
}

const helpers = {
	teleportKey:  (url, id, tpKey, stuff, cb=()=>{}) => {
	axios.get(`${url}backpack.php?key=1&rg_sess_id=${stuff.session.session}&serverid=${stuff.serverid}&suid=${id}`)
		.then(res => {
			const keys = res.data.split('img');
			let keyId = '';
			keys.map(item => {
				item.toLowerCase().indexOf(tpKey.toLowerCase()) !== -1 ? keyId = item.split(`itempopup(event,`)[1].split(`'`)[1] : null;
			});
			axios.get(`${url}home?itemaction=${keyId}&rg_sess_id=${stuff.session.session}&suid=${id}&serverid=${stuff.serverid}`)
				.then(result => {
					stuff.message.reply('Successfully teleported.');
					cb();
				})
				.catch(o_O => {
					console.log(o_O);
					return stuff.message.reply('Error. Please check logs.');
				}) 
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
	}
}


const attack = (url, id, stuff) => {
	
	axios.get(`${url}${stuff.mob[Object.keys(stuff.mob)[0]].somethingelse}&suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${stuff.session}`)
		.then(res => {
			//console.log(res.data);
			return;
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
	return;//stuff.message.reply('Done attacking.');
}