const Discord = require('discord.js');
const express = require('express');
const request = require('request');
const cors = require('cors');
const cheerio = require('cheerio');
const dotenv = require('dotenv').config();

const Commands = require('./commands/commands');

const client = new Discord.Client();
const prefix = process.env.PREFIX;

// Initialize Discord Bot
const app = express();
app.use(cors());

client.on("ready", () => {//
	Commands.commands.login.fxn();
	console.log("I am ready!");
})
client.on("message", (message) => {
	console.log(`${message.author.username}: ${message.content}`);
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const command = message.content.slice(1, message.length).trim().split(/ +/g)[0];
	let args = message.content.slice(1, message.length).trim().split(/ +/g).slice(1);
	
	Object.keys(Commands.commands).indexOf(command) !== -1 ? (Object.keys(Commands.commands).map(item => {
		item.toLowerCase() === command.toLowerCase() ? (
			item.toLowerCase() !== 'add-quest' ? Commands.commands[item].fxn(message, args) : (args = message.content.slice(1, message.length).trim().split(' ').slice(1).join(' ') , Commands.commands[item].fxn(message, args))
			) : '';
	})) : message.reply(`I'm sorry, I don't recognize that command.`);
});

client.login(process.env.AUTH);

