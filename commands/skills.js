const axios = require('axios');
const queryString = require('query-string');


exports.cast = (url, id, skills, index, stuff, cb = () => {}) => {
	axios({
		method: 'post',
		url: `${url}cast_skills.php?C=4&rg_sess_id=${stuff.session}&suid=${id}&serverid=${stuff.serverid}`,
		maxRedirects: 0,
		validateStatus: (status) => {
				return status >= 200 && status < 303; 
			},
		data: queryString.stringify({
			cast:'Cast+Skill',
			castskillid: skills[index]
		}),
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0.1 ID:20120614114901',
			Connection: 'keep-alive'
		}
	})
	.then(res => {
		index < skills.length - 1 ? exports.cast(url, id, skills, index + 1, stuff, cb) : null;
		cb();
		return;
	})
	.catch(o_O => {
		console.log(o_O);
		return stuff.message.reply(`Error casting ${skill} on ${id}. Please check logs.`);
	})
}

exports.dcTrain = (url, id, level, index, stuff) => {
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
	skilltrain(url, id, level-1, skills[Object.keys(skills)[index]], {message: stuff.message, serverid: stuff.serverid, session: stuff.session})
	index < Object.keys(skills).length -1 ? exports.dcTrain(url, id, level, index+1, stuff) : null;
			
	return;
}
skilltrain = (url, id, level, skill, stuff) => {
	axios.get(`${url}cast_skills.php?C=4&T=${skill.id}&rg_sess_id=${stuff.session}&serverid=${stuff.serverid}&suid=${id}`)
		.then(res => {
			//console.log(res);
			level !== 0 ? skilltrain(url, id, level-1, skill, stuff) : null;//stuff.message.reply(`Finished training ${skill.name}`)
		})
		.catch(err => {
			console.log(err);
			return stuff.message.reply('Error. Please check logs.');
		})
		return;
}

exports.skills = {
	dc: {
		'Accurate Strike': 29,
		Boost: 9,
		Protection: 26,
		Swiftness: 87,
		'Dark Strength': 312,
		Haste: 3024,
		'Masterful Looting': 17,
		Circumspect: 3008,
		Bloodlust: 5,
		'Stone Skin': 3007
	},
	md: {
		Markdown: 3014
	},
	raid: { 
		'Last Stand': 3010,
		Forcefield: 3009,
		'Blessing From Above': 2,
		'Enchant Armor': 3011,
		'Elemental Power': 3012,
		'Elemental Barrier': 3006
	},
	pvp: {
		Hitman: 36,
		Uproar: 33,
		'Killing Spree': 35,
		Ambush: 8,
		'Poison Dart': 16,
		Blind: 10,
		'Circle of Protection': 14,
		'Sunder Armor': 21,
		Vanish: 3016,
		Timeward: 3017
	},
	basics: {
		Empower: 3,
		Stealth: 4, 
		'Vitamin X': 22,
		Fortify: 28,
		'Shield Wall': 26
	}
}