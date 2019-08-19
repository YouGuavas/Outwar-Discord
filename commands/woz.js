const axios = require('axios');
const World = require('./world');
const Skills = require('./skills');

exports.run = (url, ids, mobs, numA = 1, stuff, cb = () => {}) => {
	console.log(ids);
	const north = 'north';
	const south = 'south';
	const east = 'east';
	const west = 'west';
	const map = {
		teleport: 11,
		map: [
		north, north, north, north, east, east, east, east, 
		west, west, west, west, south, south, south, south,
		east, east, east, east, east, east, east, north, north,
		south, south, 
		south, south, south, south,
		east, east, east, east,
		north, north,
		east, east, east, east, 
		west, west, west, west,
		north, north, north, north, east, east, east, east, east, east,
		south, south,
		west, west, west,
		east, east, east,
		south, south, south, south,
		west, west, west, west, west, west,
		west,west,west, west,west,west, west,west,west, west,west,
		north, north, north, north

		]
	}
	const skills = [3008, 3024, 3007];
	ids.map(item => {
		Skills.cast(url, item, skills, 0, stuff);
		World.teleport(url, item, map.teleport, stuff, () => {
			exports.move(url, item, map.map, 0, {message: stuff.message, session: stuff.session, serverid: stuff.serverid, mobs: mobs}, exports.move, World.attackByMobNames)
		})
	})
	numA > 0 ? cb(url, ids, mobs, numA - 1, stuff, cb) : stuff.message.reply('Finished running.');
	return;
}
exports.move = (url, id, path, index, stuff, cb = () => {}, fn = () => {}) => {
	const directions = ['north', 'south', 'east', 'west'];
	let dir = path[index];
	let mobs = stuff.mobs;
	const moveRL = `${url}ajax_changeroomb.php?suid=${id}&serverid=${stuff.serverid}&rg_sess_id=${stuff.session}`;
	axios.get(moveRL)
		.then(res => {
			const cur = res.data.curRoom;
			const next = res.data[dir];
			axios.get(`${moveRL}&lastroom=${cur}&room=${next}`)
				.then(result => {
					fn(url, id, mobs, stuff);
					index < path.length-1 ? cb(url, id, path, index+1, stuff, cb, fn) : stuff.message.reply("Finished moving.");
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
}

