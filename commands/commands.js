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
const Trial = require('./trial');

const axios = require('axios');
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
			return Login.login(args[0], args[1], process.env.BASE, {session: rg_sess, message: message, serverid: process.env.SERVERID}, (sess) => {
				return Skills.dcTrain(process.env.BASE, args[2], args[3], 0, {session: sess, message: message, serverid: process.env.SERVERID});
			})
		},
		message: 'Trains dc skills{circ, haste, stone skin}, on <characterID>, <level> number of times.',
		usage: `${prefix}train <loginUsername> <loginPassword> <characterID> <level>`
	},
	'masstrain': {
		fxn: (message, args) => {
			message.delete().catch(o_O => {});
			return Login.login(args[0], args[1], process.env.BASE, {session: rg_sess, message: message, serverid: process.env.SERVERID}, (sess) => {
				return Misc.getAllIds(process.env.BASE, {session: sess, message: message, serverid: process.env.SERVERID}, (ids) => {
					ids.map(item => {
						return Skills.dcTrain(process.env.BASE, item, args[2], 0, {session: sess, message: message, serverid: process.env.SERVERID}, Skills.dcTrain)
					});
				})
			})

		},
		message: 'Trains dc skills{circ, haste, stone skin}, <level> number of times on all chars.',
		usage: `${prefix}masstrain <loginUsername> <loginPassword> <level>`
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
			return Gear.myGear(process.env.BASE, args[0], {message: message, session: rg_sess, serverid: process.env.SERVERID});
		},
		message: 'Caches a list of all gear being worn by <characterID>, and all skill gear.',
		usage: `${prefix}cache-gear <characterID>`
	},
	'hitlist': {
		fxn: (message, args) => {
			message.delete().catch(o_O => {});
			return Misc.nameToId(process.env.BASE, args[2], {serverid: process.env.SERVERID}, (id) => {
				return Login.login(args[0], args[1], process.env.BASE, {session: rg_sess, message:message, serverid: process.env.SERVERID}, (sess) => {
						return Pvp.runHitlist(process.env.BASE ,args[0], args[1], id, {session: sess, message: message, serverid: process.env.SERVERID} )
					})
				})
		},
		message: 'Attacks hitlist with <charName>.',
		usage: `${prefix}hitlist <loginUsername> <loginPassword> <charName>`
	},
	'hit-crews': {
		fxn: (message, args) => {
			//[103] 
			//[12435, 6, 344, 103, 6644, 10295, 6742, 10083, 14223, 11645, 11652, 985, 236, 3890, 5359, 11666]
			return Misc.nameToId(process.env.BASE, args[2], {serverid: process.env.SERVERID}, (id) => {
				return Login.login(args[0], args[1], process.env.BASE, {session: rg_sess, message: message, serverid: process.env.SERVERID}, (sess) => {
					return Pvp.loadCrews(process.env.BASE, id, [12435, 6, 344, 103, 6644, 10295, 6742, 10083, 14223, 11645, 11652, 985, 236, 3890, 5359, 11666], 0, [], {session: sess, message: message, serverid: process.env.SERVERID}, (accounts) => {
							return Pvp.runCrews(process.env.BASE, id, accounts, {session: sess, message: message, serverid: process.env.SERVERID}) 
					})
				})
			})
		},
		message: 'Attacks all hardcoded crews with <charName>.',
		usage: `${prefix}hit-crews <loginUsername> <loginPassword> <charName>`
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
	'tokens': {
		fxn: (message, args) => {
			const successes = [], fails = [];
			const oneDay = 24 * 60 * 60 * 1000;
			logins.map(item => {
					return Login.login(item.username, item.password, process.env.BASE, {session: rg_sess, serverid: process.env.SERVERID}, (sess) => {
					 return Misc.getFirstId(process.env.BASE, {session: sess, message: message, serverid: process.env.SERVERID}, (id) => {
						 	return Misc.tokenClaim(process.env.BASE, id, {session: sess, message: message, serverid: process.env.SERVERID}, (product) => {
						 		product ? successes.push(product) : fails.push(product);
						 		console.log(successes, fails);
						 	});
						})
					}) 
				});
				
			message.reply('Finished getting tokens for you.');
			setInterval(() => {
					logins.map(item => {
					return Login.login(item.username, item.password, process.env.BASE, {session: rg_sess, serverid: process.env.SERVERID}, (sess) => {
					 return Misc.getFirstId(process.env.BASE, {session: sess, message: message, serverid: process.env.SERVERID}, (id) => {
						 	return Misc.tokenClaim(process.env.BASE, id, {session: sess, message: message, serverid: process.env.SERVERID}, (product) => {
						 		product ? successes.push(product) : fails.push(product);
						 		console.log(successes, fails);
						 	});
						})
					}) 
				});
				
				return message.reply('Finished getting tokens for you.');
				}, oneDay
			)
		},
		message: 'Collects tokens on preset RGAs',
		usage: `${prefix}tokens`
	},
	'hourstomilliseconds': {
		fxn: (message, args) => {
			const time = args[0] * 60 * 60 * 1000;
			return message.reply(time);
		},
		message: 'Converts hours to milliseconds.',
		usage: `${prefix}hoursToMilliseconds <hours>`
	},
	'runa': {
		fxn: (message, args) => {
			const MOBS = ['shade'];
			const rgas = [{
				username: 'username',
				password: 'password'
			}
			];
			rgas.map(item => {
			return Login.login(item.username, item.password, process.env.BASE, {session: rg_sess, serverid: process.env.SERVERID}, (sess) => {
					return Misc.getAllIds(process.env.BASE, {session: sess, message: message, serverid: process.env.SERVERID}, (ids) => {
						return Trial.run(process.env.BASE, ids.slice(0, 1), MOBS, args[0], {session: sess, message: message, serverid: process.env.SERVERID})
					});
				});
			})
		},
		message: 'Runs all chars on all rgas <number> times',
		usage: `${prefix}runa <number>`
	},

	
	'run1s': {
		fxn: (message, args) => {
			const MOBS = ['crusader'];
			const rgas = [{
				username: 'username',
				password: 'password'
			}];
			rgas.map(item => {
				return Login.login(item.username, item.password, process.env.BASE, {session: rg_sess, serverid: process.env.SERVERID}, (sess) => {
					return Misc.getFirstId(process.env.BASE, {session: sess, message: message, serverid: process.env.SERVERID}, (id) => {
						return Trial.run(process.env.BASE, [id], MOBS, args[0], {session: sess, message: message, serverid: process.env.SERVERID})
					});
				});
			})
		},
		message: 'Runs top char on rga <number> times',
		usage: `${prefix}run1s <number>`
	},
	'run1t': {
		fxn: (message, args) => {
			const MOBS = ['crusader'];
			const rgas = [{
				username: 'rganame',
				password: 'rgapassword'
			}];
			const BASE = 'http://torax.outwar.com/';
			const SERVERID = 2;
			rgas.map(item => {
				return Login.login(item.username, item.password, BASE, {session: rg_sess, serverid: SERVERID}, (sess) => {
					return Misc.getFirstId(BASE, {session: sess, message: message, serverid: SERVERID}, (id) => {
						return Trial.run(BASE, [id], MOBS, args[0], {session: sess, message: message, serverid: SERVERID})
					});
				});
			})
		},
		message: 'Runs top char on rga <number> times',
		usage: `${prefix}run1t <number>`
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