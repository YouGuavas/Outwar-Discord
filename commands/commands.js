const Stats = require('./stats');
const Login = require('./login');
const Boss = require('./bosses');
const Skills = require('./skills');
const World = require('./world');
const Gear = require('./gear');
const Pvp = require('./pvp');
const Misc = require('./misc');
const Quests = require('./quests');
const Treasury = require('./treasury');
const Backpack = require('./backpack');

const mongo = require('mongodb').MongoClient;
const dotenv = require('dotenv').config();
const mongoURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
const prefix = process.env.PREFIX;
let rg_sess = {
	session: ''
}

exports.commands = {
	'ping': {
		fxn: (message) => {message.channel.send('pong!')},
		message: 'Returns a pong. Helps to check if bot is listening.',
		usage: `${prefix}pong`
	},
	'images': {
		fxn: (message, args) => {
			if (args.length === 0) {
				message.delete().catch(o_O => {});
				return message.reply("Please provide a query to search for");
			}
			const searchString = args.join('+');
			const url = 'http://www.google.com/search?oq='+searchString+'&q='+searchString+'&tbm=isch';
			message.delete().catch(o_O=>{});
			return message.channel.send(url);	 
		},
		message: 'Returns a google image search matching <query>.',
		usage: `${prefix}images <query>`

	},
	'purge': {
		fxn: (message,args) => {
			const deleteCount = parseInt(args[0], 10) || 100;
	    
	    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
	      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
	    
	    message.channel.fetchMessages({count: deleteCount})
	    	.then(fetched => {
	    			message.channel.bulkDelete(fetched)
							.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
						return message.reply("Successfully purged the channel.");
	    	});
	    },
	  message: 'Cleans channel of past [number] messages. <number> defaults to 100.',
		usage: 	`${prefix}purge [number]`

	},


	'stats': {
		fxn: (message, args) => {
			if (args.length === 0) {
				return message.reply('Please provide a character to check stats for');
			}
			const searchString = args[0];
			return Stats.stats(searchString, process.env.BASE, {message: message});
		},
		message: 'Returns a basic profile of <characterName>.',
		usage: `${prefix}stats <characterName>`
	},


	'login': {
		fxn: (message, args) => {
			return Login.login(process.env.OW_USERNAME, process.env.OW_PASSWORD, process.env.BASE, {session: rg_sess, message: message});
		},
		message: 'Updates session id of checker/former.',
		usage: `${prefix}login`
	},
	'logout': {
		fxn: (message, args) => {
			return Login.logout(process.env.BASE, {message: message});
		}
	},


	'bosses': {
		fxn: (message, args) => {
			return Boss.bossStats(process.env.BASE, {session: rg_sess, message: message, serverid: process.env.SERVERID, checker: process.env.CHECKER});
		},
		message: 'Returns a list of bosses currently alive, and their percentages.',
		usage: `${prefix}bosses`
	},
	'boss-stats': {
		fxn: (message, args) => {
			return Boss.statsBoss(process.env.BASE, args[0], {session: rg_sess, message: message, serverid: process.env.SERVERID, checker: process.env.CHECKER});
		},
		message: 'Returns damage and drop status for <bossName>. Attempts to match the beginning of the boss\'s name.',
		usage: `${prefix}boss-stats <bossName>`
	},


	'train': {
		fxn: (message, args) => {
			message.delete().catch(o_O => {});
			return Skills.dcTrain(process.env.BASE, args[0], args[1], args[2], args[3], {login: Login.login, message: message, serverid: process.env.SERVERID});
		},
		message: 'Trains dc skills{circ, haste, stone skin}, on <characterID>, <level> number of times.',
		usage: `${prefix}train <loginUsername> <loginPassword> <characterID> <level>`
	},


	'attack': {
		fxn: (message, args) => {
			message.delete().catch(o_O => {});
			return Misc.nameToId(process.env.BASE, args[2], {serverid: process.env.SERVERID}, (id) => {
				return Login.login(args[0], args[1], process.env.BASE, {session: rg_sess, message: message, serverid: process.env.SERVERID}, (sess) => {
					return World.attackRoom(process.env.BASE, id, args[3], {session: sess, message: message, serverid: process.env.SERVERID}, World.attackRoom);
				});
			});
		},
		message: 'Attacks all mobs in current room <number> of times.',
		usage: `${prefix}attack <loginUsername> <loginPassword> <charName> <number>`
	},
	'move': {
		fxn: (message, args) => {
			/*mongo.connect(mongoURI, (err, client) => {
				if (err) throw err;
				const db = client.db('outwar');
				const collection = db.collection('paths');
				//collection.findOne
			})*/
			message.reply('Sorry, that command is currently not functioning.');
			//World.mover()
		},
		message: 'Out of order',
		usage: `Don't.`
	},
	'quest': {
		fxn: (message, args) => {
			mongo.connect(mongoURI, (err, client) => {
				if (err) throw err;
				const db = client.db('outwar');
				const collection = db.collection('quests');
				collection.findOne({name: args[0]}, (err, res) => {
					if (err) throw err;
					return Misc.nameToId(process.env.BASE, args[2], {serverid: process.env.SERVERID}, (id) => {
						return World.quest(process.env.BASE, args[0], args[1], id, res, {message: message, login: Login.login, serverid: process.env.SERVERID}, World.attackRoom)
						})
					})
				})
			},
			message: 'Performs quest <questName> on character <charName>.',
			usage: `${prefix}quest <loginUsername> <loginPassword> <charName> <questName>`
		},

	'check-gear': {
		fxn: (message, args) => {
			return Gear.myGear(process.env.BASE, args[0], {message: message, session: rg_sess, serverid: process.env.SERVERID}, (gears) => {
				mongo.connect(mongoURI, (err, client) => {
					if (err) throw err;
					const db = client.db(process.env.DB_NAME);
					const collection = db.collection(process.env.COLLECTION);
					collection.findOne({suid: args[0]}, (err, res) => {
						if (err) throw err;
						gears.toString() === res.gear.toString() ? message.reply(`${args[0]} is wearing his default gear.`) : message.reply(`Oh no! ${args[0]} is not wearing his default gear!`);
						client.close();
						return;
					})
				})
			})
		},
		message: 'Returns a list of all gear being worn by <characterID>',
		usage: `${prefix}check-gear <characterID>`
	},
	'cache-gear': {
		fxn: (message, args) => {
			return Gear.myGear(process.env.BASE, args[0], {message: message, session: rg_sess, serverid: process.env.SERVERID}, (gear) => {
				Gear.skillGear(process.env.BASE, args[0], {message: message, session: rg_sess, serverid: process.env.SERVERID}, (skillGear) => {
					/*	mongo.connect(mongoURI, (err, client) => {
						if (err) throw err;
						const db = client.db(process.env.DB_NAME);
						const collection = db.collection(process.env.COLLECTION);
						collection.update({suid: args[0]}, {suid: args[0], gear: gear, skillGear: skillGear}, {upsert: true}, (err, data) => {
							if (err) throw err;
							client.close();
							return message.reply(`Successfully cached gear on ${args[0]}`);
						})
					})*/
				})
			});
		},
		message: 'Caches a list of all gear being worn by <characterID>, and all skill gear.',
		usage: `${prefix}cache-gear <characterID>`
	},
	'hitlist': {
		fxn: (message, args) => {
			message.delete().catch(o_O => {});
			return Misc.nameToId(process.env.BASE, args[2], {serverid: process.env.SERVERID}, (id) => {
				return Pvp.runHitlist(process.env.BASE ,args[0], args[1], args[2], id, {login: Login.login, message: message, serverid: process.env.SERVERID} )
				})
		},
		message: 'Attacks hitlist with <charName> <number> of times.',
		usage: '!hitlist <loginUsername> <loginPassword> <charName> <number>'
	},
	'id': {
		fxn: (message, args) => {
			return Misc.nameToId(process.env.BASE, args[0], {message: message, serverid: process.env.SERVERID});
		},
		message: 'Returns the suid of <charName>',
		usage: '!id <charName>'
	},
	'move': {
		fxn: (message, args) => {
			return Misc.nameToId(process.env.BASE, args[0], {serverid: process.env.SERVERID}, (id) => {
				return World.move(process.env.BASE, id, args.slice(1), 0, {message: message, serverid: process.env.SERVERID, session: rg_sess}, World.move);
			})
		},
		message: 'Moves <charName> one space to <direction>.',
		usage: `${prefix}move <charName> <direction>(north south east west)`
	},
	'add-quest': {
		fxn: (message, args) => {
			return Quests.questAdd(args, {message: message});
		},
		message: 'Adds a quest to the database',
		usage: `${prefix}add-quest <shortcut> <fullName> <steps>`
	},
	'summon': {
		fxn: (message, args) => {
			let connection;
			//console.log(message.member.voiceChannel);
			message.member.voiceChannel ? connection = message.member.voiceChannel.join() : message.reply('You need to join a voice channel first!');
		},
		message: 'Summons bot to your voice channel.',
		usage: `${prefix}summon`
	},
	'buy': {
		fxn: (message, args) => {
			message.delete().catch(o_O=>{console.log(o_O)});
			return Misc.nameToId(process.env.BASE, args[3], {serverid: process.env.SERVERID}, (id) => {
				return Login.login(args[0], args[1], process.env.BASE, {session: rg_sess, message: message, serverid: process.env.SERVERID}, (sess) => {
					return Treasury.purchase(process.env.BASE, args[2], id, args[4], args.slice(5), {session: sess, serverid: process.env.SERVERID, message: message});
				})
			})
		},
		message: 'Buys <number> of <item> on <charName>.',
		usage: `${prefix}buy <loginUsername> <loginPassword> <securityWord> <charName> <number> <item>`
	},
	'activate': {
		fxn: (message, args) => {
			return Misc.nameToId(process.env.BASE, args[2], {serverid: process.env.SERVERID}, (id) => {
				return Login.login(args[0], args[1], process.env.BASE, {session: rg_sess, message: message, serverid: process.env.SERVERID}, (sess) => {
					return Backpack.getItem(process.env.BASE, id, args.slice(4).join(' '), {session: sess, message: message, serverid: process.env.SERVERID}, (items) => {
						return Backpack.activate(process.env.BASE, id, items, args[3], {session: sess, message: message, serverid: process.env.SERVERID})
					})
				})
			})
		},
		message: 'Activates <number> of <item> on <charName>',
		usage: `${prefix}activate <loginUsername> <loginPassword> <charName> <number> <item>`
	},
	'help': {
		fxn: (message, args) => {
			let msg = '';
			args.length === 0 ? (
				msg = '**Commands:**',
				Object.keys(this.commands).map((item, index) => {
					index === Object.keys(this.commands).length - 1 ? msg += ` ${item}` : msg += ` ${item},`
				}),
				message.reply(msg)
				) : (
				msg = `\n**${args[0].toLowerCase()}:**`,
				Object.keys(this.commands[args[0].toLowerCase()]).map(item => {
					item !== 'fxn' ? msg += `\n**${item}**:\n${this.commands[args[0].toLowerCase()][item]}` : null;
				}),
				message.reply(msg)
				)
				return;
		},
		message: 'Returns a list of all available commands, or how to use a specific command.',
		usage: `${prefix}help [command]`

	}
}