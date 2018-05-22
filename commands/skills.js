const axios = require('axios');


exports.dcTrain = (url, user, pass, id, level, stuff) => {
	const skills = {
		Circ: {
			id: 3008,
			name: 'Circumspect'
		},
		SS: {
			id: 3007,
			name: 'Stone Skin'
		},
		Haste: {
			id: 3024,
			name: 'Haste'
		}
	}
	let session = {
		session: ''
	}
	stuff.login(user, pass, url, {message: stuff.message, session: session}, () => {
		Object.keys(skills).map(item => {
			skilltrain(url, id, level, skills[item], {message: stuff.message, session: session})
		});
	})
	
	return;
}
skilltrain = (url, id, level, skill, stuff) => {
	axios.get(`${url}cast_skills.php?C=4&trained=${skill.id}&rg_sess_id=${stuff.session.session}&serverid=${stuff.serverid}&suid=${id}`)
		.then(res => {
			stuff.message.reply(level);
			level === 0 ? (
				skilltrain(url, id, level-1, skill, stuff),
				stuff.message.reply(`Training ${skill.name} ${level-1} more times.`)
				) : ''
		})
		.catch(err => {
			console.log(err);
			return stuff.message.reply('Error. Please check logs.');
		})
		return;
}