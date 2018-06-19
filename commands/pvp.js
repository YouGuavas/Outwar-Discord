const axios = require('axios');
const queryString = require('query-string');
//


exports.runCrews = (url, id, accounts, stuff) => {
	let promises = [];
	let obj = {};
	accounts.map(item => {
			promises.push(axios.get(`${url}profile.php?suid=${id}&rg_sess_id=${stuff.session}&serverid=${stuff.serverid}&id=${item}`))
		});
		axios.all(promises).then(results => {
			results.map(async res => {
				const page = res.data;
				let myself;
				let attacks = [];
				page.indexOf('attackWindow') !== -1 ? (
					myself = page.split('attackWindow(')[1].split(`)"`)[0].split(','),
					myself.map((item, index) => {
						myself[index] = item.split(`'`)[1];
					}),
					await attack(url, id, myself[1], myself[3], 'undefined', {message:stuff.message, session: stuff.session, serverid: stuff.serverid})
					) : console.log('foof');
				return;
			})

		}).catch(o_O => {
			console.log(o_O);
		})
}
exports.loadCrews = (url, id, crewIDs, index, accounts, stuff, cb = () => {}) => {
	axios.get(`${url}crew_profile.php?id=${crewIDs[index]}&rg_sess_id=${stuff.session}&suid=${id}&serverid=${stuff.serverid}`)
		.then(res=> {
			const page = res.data.split('crew_memberss.jpg')[1].split('/table')[0].split('profile.php?id=');
			page.slice(1).map((item, ind) => {
				accounts.push(item.split('"')[0]);
			});
			index < crewIDs.length - 1 ? exports.loadCrews(url, id, crewIDs, index+1, accounts, {session: stuff.session, serverid: stuff.serverid, message: stuff.message}, cb) : console.log('oy vey'), cb(accounts);
		})
		.catch(o_O => {
			console.log(o_O);
			return stuff.message.reply('Error. Please check logs.');
		})
}


exports.runHitlist = (url, user, pass, id, stuff) => {
	let hitlist = {};
	let promises = [];
	loadHitlist(url, id, {session: stuff.session, serverid: stuff.serverid}, (hL) => {
		hitlist = hL;
		//console.log(hitlist);
		Object.keys(hitlist).map(async item => {
			await promises.push(axios({
				method: 'post',
				url: `${url}somethingelse.php?serverid=${stuff.serverid}&rg_sess_id=${stuff.session}&suid=${id}&attackid=${item}&r=crew_hitlist`,
				maxRedirects: 0,
				data: queryString.stringify({
					hash: hitlist[item],
					rage: 500,
					message: 'quest. last hit.'
				}),
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0.1 ID:20120614114901',
					Connection: 'keep-alive'
					}
				})
			);
			//await attack(url, id, item, hitlist[item],'crew_hitlist', {message: stuff.message, session: stuff.session, serverid: stuff.serverid})
		})
		axios.all(promises).then(results => {
			results.map(res => {
				return;
			})
		}).catch(() => {
			return;
		})
		return stuff.message.reply('Done with your hitlist run.');
	})
}

loadHitlist = (url, id, stuff, cb = () => {}) => {
	axios.get(`${url}crew_hitlist.php?suid=${id}&rg_sess_id=${stuff.session}&serverid=${stuff.serverid}`)
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

attack = (url, id, attackId, h,r, stuff) => {
	console.log(r);
	axios({
		method: 'post',
		url: `${url}somethingelse.php?serverid=${stuff.serverid}&rg_sess_id=${stuff.session}&suid=${id}&attackid=${attackId}&r=${r}`,
		maxRedirects: 0,
		data: queryString.stringify({
			hash: h,
			rage: 500,
			message: 'quest'
		}),
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0.1 ID:20120614114901',
			Connection: 'keep-alive'
		}
	}).then(res => {
		console.log(res.data);
		return;
	}).catch(o_O => {
		return;
	})
}