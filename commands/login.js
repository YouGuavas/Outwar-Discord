const axios = require('axios');
const queryString = require('query-string');

exports.login = (user, pass, url, stuff, cb = () => {}) => {
	axios({
		method: 'post',
		url: `${url}index.php`,
		maxRedirects: 0,
		validateStatus: (status) => {
				return status >= 200 && status < 303; 
			},
		data: queryString.stringify({
			login_username:user,
			login_password: pass,
			serverid: '1',
			submitit: ''
		}),
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0.1 ID:20120614114901',
			Connection: 'keep-alive'
		}
	})
		.then((response) => {
			const check = response.request.res.responseUrl;
			let rg_sess;
			response.headers['set-cookie'].map(item => {
				item.indexOf('rg_sess') !== -1 ? rg_sess = item.split('rg_sess_id=')[1].split(';')[0] : ''
			});
			if (stuff.message) {
				check !== 'http://sigil.outwar.com/login?LE=1' ? stuff.message.reply(`Successfully logged into rga: ${user}, new session id: ${rg_sess}`) : stuff.message.reply(`Could not log into rga: ${user}, check login info`)
			}
			stuff.session ? stuff.session.session = rg_sess : ''
			cb(rg_sess);
		})
		.catch((err) => {
			console.log(err)
			return stuff.message ? stuff.message.reply('Error. Check logs.') : '';
			})
}
exports.logout = (url, stuff) => {
	axios.get(`${url}?cmd=logout`)
		.then((res) => {
			return stuff.message.reply('Successfully logged out.')
		})
		.catch((err) => {
			console.log(err);
			return stuff.message.reply('Error. Check logs.');
		})
}

