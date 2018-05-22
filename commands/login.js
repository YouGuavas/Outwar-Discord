const axios = require('axios');
const queryString = require('query-string');

exports.login = (user, pass, url, message) => {
	axios({
		method: 'post',
		url: `${url}index.php`, 
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
			check === 'http://sigil.outwar.com/login?LE=1' ? message.reply(`Successfully logged into rga: ${user}`) : message.reply(`Could not log into rga: ${user}, check login info`)
			return;
			})
		.catch((err) => {
			console.log(err)
			return message.reply('Error. Check logs.');
			})
}
exports.logout = (url, message) => {
	axios.get(`${url}`)
		.then((res) => {
			return message.reply('Successfully logged out.')
		})
		.catch((err) => {
			console.log(err);
			return message.reply('Error. Check logs.');
		})
}	
