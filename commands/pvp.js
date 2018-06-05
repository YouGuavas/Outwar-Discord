const axios = require('axios');
const queryString = require('query-string');


exports.runHitlist = (url, user, pass, name, id, stuff) => {
	let session = {
		session: ''
	}
	let hitlist = {};
	stuff.login(user, pass, url, {message: stuff.message, session: session}, () => {
		loadHitlist(url, id, {session: session, serverid: stuff.serverid}, (hL) => {
			hitlist = hL;
			Object.keys(hitlist).map(async item => {
				await attack(url, id, item, hitlist[item], {message: stuff.message, session: session, serverid: stuff.serverid})
			})
			return stuff.message.reply('Done with your hitlist run.');
		})
	})
}

loadHitlist = (url, id, stuff, cb = () => {}) => {
	axios.get(`${url}crew_hitlist.php?suid=${id}&rg_sess_id=${stuff.session.session}&serverid=${stuff.serverid}`)
		.then(res => {
			const page = res.data.split('attackWindow(');
			let ids = {};

			page.map(item => {
				item.indexOf('Attack!') !== -1 ? ids[item.split(`','`)[1]] = item.split(`','`)[3].split(`', '`)[0] : null;
			})

			return cb(ids);
		})
		.catch(o_O => {
			console.log(o_O);
			stuff.message ? stuff.message.reply : '';
			return;
		})
}

attack = (url, id, attackId, h, stuff, cb = () => {}) => {
	axios({
		method: 'post',
		url: `${url}somethingelse.php?serverid=${stuff.serverid}&rg_sess_id=${stuff.session.session}&suid=${id}&attackid=${attackId}&r=crew_hitlist`,
		maxRedirects: 0,
		data: queryString.stringify({
			hash: h,
			rage: 500,
			message: 'https://media1.tenor.com/images/0176c730d178b1af0f985365e065cdc0/tenor.gif'
		}),
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0.1 ID:20120614114901',
			Connection: 'keep-alive'
		}
	})
	.then(res => {
		return;
	})
	.catch(o_O => {
		//console.log(o_O);
		//stuff.message ? stuff.message.reply('Error. Please check logs.') : null;
		return;
	})
}