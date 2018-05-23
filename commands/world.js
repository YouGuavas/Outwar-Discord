const axios = require('axios');

exports.attackRoom = (url, user, pass, id, numA, stuff) => {
	let session = {
		session: ''
	}
	let mobs = {};
	stuff.login(user, pass, url, {message: stuff.message, session: session}, () => {
		axios.get(`${url}ajax_changeroomb.php?suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${session.session}`)
		.then(res => {
			const page = res.data.roomDetails;
			page.split('<b>').map((item, index) => {
				item.indexOf('somethingelse') !== -1 ? mobs[index] = {[item.split('</b>')[0]]: {somethingelse: `somethingelse.php?${item.split('somethingelse.php?')[1].split('">')[0]}`}} : '';
				//item.indexOf('somethingelse') !== -1 ? console.log(item) : '';
			})
			Object.keys(mobs).map(item => {
				attack(url, id, numA-1, {message: stuff.message, session: session, serverid: stuff.serverid, mob: mobs[item]});
			});
			return stuff.message.reply('Done attacking.');
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
	})
	
}

attack = (url, id, numA, stuff) => {
	
	axios.get(`${url}${stuff.mob[Object.keys(stuff.mob)[0]].somethingelse}&suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${stuff.session.session}`)
		.then(res => {
			//console.log(res.data);
			numA !== 0 ? attack(url, id, numA-1, stuff) : ''//stuff.message.reply('Finished attacking.');
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
	return;//stuff.message.reply('Done attacking.');
}