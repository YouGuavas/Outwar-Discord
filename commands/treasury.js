const axios = require('axios');
const queryString = require('query-string');


const secPrompt = (url, sec, id, stuff) => {
		axios.get(`${url}security_prompt.php?rg_sess_id=${stuff.session}&suid=${id}&serverid=${stuff.serverid}`)
			.then(res => {
				const page = res.data;
				const value = page.split('prompt_number')[1].split('value=')[1].split('"')[1];
				console.log(res);
				axios.post(`${url}security_prompt.php?rg_sess_id=${stuff.session}&suid=${id}&serverid=${stuff.serverid}`, {
					data: {
						prompt_number: value,
						answer: sec,
						security_submitted: 'Continue'
				},
					maxRedirects:0,
					headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0.1 ID:20120614114901',
					Cookie: 'security_return_page=/treasury.php; '
					}
				})
					.then(res => {
						const page = res.data
						//console.log(res)//page);
						//cb();
					})
					.catch(o_O => {
						console.log('j')//o_O);
						return stuff.message.reply('Error. Please check logs.');
					})
			}) 
			.catch(o_O => {
				console.log('i')//o_O);
				return stuff.message.reply('Error. Please check logs.');
			})
}


exports.purchase = (url, sec, id, numA, qString = ['remnant', 'solice', 'lev', '8'], stuff) => {
	console.log(stuff.session);
	axios.get(`${url}treasury.php?rg_sess_id=${stuff.session}&suid=${id}&serverid=${stuff.serverid}`)
		.then(res => {
			res.request._header.indexOf('GET /security_prompt') !== -1 ? (
				secPrompt(url, sec, id, stuff)//, exports.purchase(url, sec, id, numA, qString, stuff))
				) : null;
		})
		.catch(o_O => {
			console.log(o_O);
			stuff.message.reply('Error. Please check logs.');
			return;
		})
	/*
				
						axios.get(`${url}treasury?search_for=${qString}&rg_sess_id=${stuff.session}&suid=${id}&serverid=${stuff.serverid}`)
							.then(res => {
								const page = res//.data;
								console.log(page)
							})
							.catch(o_O => {
								console.log(o_O);
								stuff.message.reply('Error. Please check logs.');
								return;
							})
					})
					.catch(o_O => {
						console.log(o_O.response.data);
						stuff.message.reply('Error. Please check logs.');
						return;
					})
				) : axios.get(`${url}treasury?search_for=${qString}&rg_sess_id=${stuff.session}&suid=${id}&serverid=${stuff.serverid}`)
							.then(res => {
								const page = res.data;
								console.log(page);
							})
							.catch(o_O => {
								console.log(o_O);
								stuff.message.reply('Error. Please check logs.');
								return;
							})
		})*/
	/*axios.get(`${url}treasury?search_for=${qString}&rg_sess_id=${stuff.session}&suid=${id}&serverid=${stuff.serverid}`)
		.then(res => {
			const page = res//.data;
			console.log(page);
		})*/
}