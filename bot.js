const Discord = require('discord.js');
const express = require('express');
const request = require('request');
const cors = require('cors');
const cheerio = require('cheerio');
const dotenv = require('dotenv').config();

const Stats = require('./commands/stats');
const Login = require('./commands/login');
const Boss = require('./commands/bosses');
const Skills = require('./commands/skills');

const client = new Discord.Client();
const prefix = process.env.PREFIX;

// Initialize Discord Bot
const app = express();
app.use(cors());

let rg_sess = {
	session: ''
}
const help = {
	ping: {
		message: 'Returns a pong. Helps to check if bot is listening.',
		usage: `${prefix}pong`
	},
	images: {
		message: 'Returns a google image search matching <query>.',
		usage: `${prefix}images <query>`
	},
	purge: {
		message: 'Cleans channel of past [number] messages. <number> defaults to 100.',
		usage: 	`${prefix}purge [number]`
	},
	stats: {
		message: 'Returns a basic profile of <characterName>.',
		usage: `${prefix}stats <characterName>`
	},
	bosses: {
		message: 'Returns a list of bosses currently alive, and their percentages.',
		usage: `${prefix}bosses`
	},
	login: {
		message: 'Updates session id of checker/former.',
		usage: `${prefix}login`
	},
	train: {
		message: 'Trains dc skills{circ, haste, stone skin}, on <characterID>, <level> number of times.',
		usage: `${prefix}train <loginUsername> <loginPassword> <characterID> <level>`
	}
}
client.on("ready", () => {//
	Login.login(process.env.OW_USERNAME, process.env.OW_PASSWORD, process.env.BASE, {session:rg_sess});
	console.log("I am ready!");
})
client.on("message", (message) => {
	console.log(`${message.author.username}: ${message.content}`);
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const command = message.content.slice(1, message.length).trim().split(/ +/g)[0];
	const args = message.content.slice(1, message.length).trim().split(/ +/g).slice(1);

	if (command === "ping") {
		message.channel.send("pong!");
	}
	if (command === 'images') {
		if (args.length === 0) {
			message.delete().catch(o_O => {});
			return message.reply("Please provide a query to search for");
		}
		const searchString = args.join('+');
		const url = 'http://www.google.com/search?oq='+searchString+'&q='+searchString+'&tbm=isch';
		message.delete().catch(o_O=>{});
		return message.channel.send(url);	 
	}
	if (command === 'purge') {
		const deleteCount = parseInt(args[0], 10) || 100;
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    message.channel.fetchMessages({count: deleteCount})
    	.then(fetched => {
    			message.channel.bulkDelete(fetched)
						.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
					return message.reply("Successfully purged the channel.");
    	});
	}
	//
	if (command === 'stats') {
		if (args.length === 0) {
			return message.reply('Please provide a character to check stats for');
		}
		const searchString = args[0];
		return Stats.stats(searchString, process.env.BASE, {message: message});
	}
	//
	if (command === 'login') {
		return Login.login(process.env.OW_USERNAME, process.env.OW_PASSWORD, process.env.BASE, {session: rg_sess, message: message});
	}
	if (command === 'logout') {
		return Login.logout(process.env.BASE, {message: message});
	}
	//
	if (command === 'bosses') {
		return Boss.bossStats(process.env.BASE, {session: rg_sess, message: message, serverid: process.env.SERVERID, checker: process.env.CHECKER});
	}
	if (command === 'boss-stats') {
		return Boss.statsBoss(process.env.BASE, args[0], {session: rg_sess, message: message, serverid: process.env.SERVERID, checker: process.env.CHECKER});
	}
	//
	if (command === 'train') {
		message.delete().catch(o_O => {});
		return Skills.dcTrain(process.env.BASE, args[0], args[1], args[2], args[3], {login: Login.login, message: message, serverid: process.env.SERVERID});
	}

	if (command === 'help') {
		let msg = '';
		args.length === 0 ? (
			msg = '**Commands:**',
			Object.keys(help).map((item, index) => {
				index === Object.keys(help).length - 1 ? msg += ` ${item}` : msg += ` ${item},`
			}),
			message.reply(msg)
			) : (
			msg = `\n**${args[0].toLowerCase()}:**`,
			Object.keys(help[args[0].toLowerCase()]).map(item => {
				msg += `\n**${item}**:\n${help[args[0].toLowerCase()][item]}`
			}),
			message.reply(msg)
			)
			return;
	}
});

client.login(process.env.AUTH);

