require('dotenv').config({ path: __dirname.split('\\').slice(0, __dirname.split('\\').length - 1).join('\\') + '\\.env' })
// console.log('path =', __dirname+'../env')
console.log('path =', __dirname.split('\\').slice(0, __dirname.split('\\').length - 1).join('\\') + '\\.env')
console.log('path =', process.env.CHANNEL_ID, process.env.DISCORD_TOKEN)
const Discord = require('discord.js')
const mongoose = require('mongoose')
const axios = require('axios')
const client = new Discord.Client()
const asTable = require('as-table') // .configure({delimiter: ' | ', dash: '-'})

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	client.user.setActivity('websites', { type: 'WATCHING', url: 'https://github.com/CodaBool/lambda-scraper' })
})

const CHANNEL_ID = process.env.CHANNEL_ID
// const CHANNEL_ID = process.env.CHANNEL_ID_TEST // bot test channel

client.on('message', msg => {
	if (msg.content === '!any-bots') {
		client.channels.cache.get(CHANNEL_ID).send('yo')
	}
	if (msg.content === '!help' || msg.content.includes('!h')) {
		const channel = client.channels.cache.get(CHANNEL_ID)
		let embed = new Discord.MessageEmbed()
				.setColor('#204194')
				.addFields([{
					name: '!update',
					value: 'this will update the scraped data in the database'
				}, {
					name: '!github',
					value: 'Shows the trending github repos'
				}, {
					name: '!upcoming-movies',
					value: 'Shows the upcoming movies from imdb'
				}, {
					name: '!trending-movies',
					value: 'Shows the popular movies from imdb'
				}, {
					name: '!trending-tv',
					value: 'Shows the popular tv shows from imdb'
				}, {
					name: '!upcoming-games',
					value: 'Shows the upcoming steam games'
				}, {
					name: '!npm-backend',
					value: 'Shows the popular npm packages under the backend category from npmjs.com'
				}, {
					name: '!npm-all',
					value: 'Shows the all popular npm packages from libraries.io'
				}])
				.setTitle('Commands')
				.setAuthor('CodaBot', 'https://i.imgur.com/pHPpNA6.png', 'https://github.com/CodaBool/p09-scraper-consumer/blob/main/discord-bot/index.js')
				.setThumbnail('https://i.imgur.com/ShZVJwz.png')
			channel.send(embed)
	}
	if (msg.content === '!github') {
		queryModel('trending-github')
			.then(res => {
				const channel = client.channels.cache.get(CHANNEL_ID)
				for (let j = 0; j < 5; j++) {
					const data = []
					for (let i = 0; i < 20; i++) {
						if (res._doc[(j * 20) + i]) {
							data.push({
								stars: res._doc[(j * 20) + i].stars,
								repo: res._doc[(j * 20) + i].name,
								description: res._doc[(j * 20) + i].description.slice(0, 45)
							})
						}
					}
					// console.log('DEBUG: sending table with', asTable(data).length, 'length') // 2000
					channel.send('```md\npage (' + (j + 1) + '/5)\n' + asTable(data) + '```')
				}

				// ============ SINGLE asTable ============
				// guide https://anidiots.guide/first-bot/using-embeds-in-messages
				// const exampleEmbed = new Discord.MessageEmbed() // embed max 6000
				// 	.setColor('#de0000')
				// 	.setTitle('Github top 100 repos by stars')
				// 	.setDescription('```md\n'+ table.toString() +'```')
				// .setFooter('GITHUB')
				// const channel = client.channels.cache.get(CHANNEL_ID)
				// channel.send(exampleEmbed)
			})
			.catch(err => console.log('err', err))
	}
	if (msg.content === '!npm-backend') {
		queryModel('trending-npm-1')
			.then(res => {
				const channel = client.channels.cache.get(CHANNEL_ID)
				for (let j = 0; j < 5; j++) {
					const data = []
					for (let i = 0; i < 20; i++) {
						if (res._doc[(j * 20) + i]) {
							data.push({
								package: res._doc[(j * 20) + i].title,
								description: res._doc[(j * 20) + i].description.slice(0, 35)
							})
						}
					}
					// console.log('DEBUG: sending table with', asTable(data).length, 'length') // 2000
					channel.send('```md\npage (' + (j + 1) + '/5)\n' + asTable(data) + '```')
				}
			})
			.catch(err => console.log('err', err))
	}
	if (msg.content === '!npm-all') {
		queryModel('trending-npm-2')
			.then(res => {
				const channel = client.channels.cache.get(CHANNEL_ID)
				for (let j = 0; j < 5; j++) {
					const data = []
					for (let i = 0; i < 20; i++) {
						if (res._doc[(j * 20) + i]) {
							data.push({
								stars: res._doc[(j * 20) + i].stars,
								package: res._doc[(j * 20) + i].name,
								description: res._doc[(j * 20) + i].description.slice(0, 24)
							})
						}
					}
					// console.log('DEBUG: sending table with', asTable(data).length, 'length') // 2000
					channel.send('```md\npage (' + (j + 1) + '/5)\n' + asTable(data) + '```')
				}
			})
			.catch(err => console.log('err', err))
	}
	if (msg.content === '!upcoming-games') {
		queryModel('upcoming-games')
			.then(res => {
				const channel = client.channels.cache.get(CHANNEL_ID)
				let desc = ''
				for (const key in res._doc) {
					if (!key.includes('_id') && !key.includes('createdAt') && !key.includes('updatedAt') && !key.includes('__v')) {
						if (Number(key) < 30) {
							desc += `[🔗](${res._doc[key].link}) ${res._doc[key].name}\n`
						}
					}
				}
				const embed = new Discord.MessageEmbed() // embed max 6000
					.setColor('#de0000')
					.setTitle('Upcoming Games')
					.setDescription(desc)
				channel.send(embed)
			})
			.catch(console.log)
	}
	if (msg.content.includes('!update') && !msg.author.bot) {
		const channel = client.channels.cache.get(CHANNEL_ID)
		const args = msg.content.split(' ').filter(item => item !== '!update') // remove initial !update
		if (args.includes('all')) {
			['upcoming-movies', 'trending-movies', 'trending-tv', 'upcoming-games', 'trending-npm-1', 'trending-npm-2', 'trending-github'].forEach(item => {
				axios.get(`https://j8xl9nv9k9.execute-api.us-east-1.amazonaws.com/main/api/${item}?key=${process.env.KEY}`)
					.then(() => channel.send(`✅ Database successfully updated ${item} collection`))
					.catch(err => channel.send(`😨 Something went wrong ${err}`))
			})
		} else {
			let embed = new Discord.MessageEmbed()
				.setColor('#204194')
				.setDescription('Select a reaction button corresponding to the item in the numbered list of database collections. This will send a request for new data to be scraped. The update command will only watch for reactions for 15 seconds and will add the 🛑 reaction to show that the command is no longer listening.')
				.addFields([{
					name: 'Collections',
					value: '1. ALL\n2. upcoming-movies\n3. trending-movies\n4. trending-tv\n5. upcoming-games\n6. trending-npm-1\n7. trending-npm-2\n8. trending-github'
				}])
				.setTitle('Update Database')
				.setAuthor('CodaBot', 'https://i.imgur.com/pHPpNA6.png', 'https://github.com/CodaBool/p09-scraper-consumer/blob/main/discord-bot/index.js')
				.setThumbnail('https://cdn.dribbble.com/users/160117/screenshots/3197970/media/51a6e132b11664f7f2085bb6a35fc628.gif')
			channel.send(embed)
				.then(msg => {
					msg.react('1⃣')
					msg.react('2⃣')
					msg.react('3⃣')
					msg.react('4⃣')
					msg.react('5⃣')
					msg.react('6⃣')
					msg.react('7⃣')
					msg.react('8⃣')
	
					msg.awaitReactions(() => true, { time: 15000 }) // ms
						.then(res => {
							for (const emojiMap of res) {
								let path = ''
								if (emojiMap[0] === '1⃣' && emojiMap[1].count > 1) {
									['upcoming-movies', 'trending-movies', 'trending-tv', 'upcoming-games', 'trending-npm-1', 'trending-npm-2', 'trending-github'].forEach(item => {
										axios.get(`https://j8xl9nv9k9.execute-api.us-east-1.amazonaws.com/main/api/${item}?key=${process.env.KEY}`)
											.then(() => channel.send(`✅ Database successfully updated ${item} collection`))
											.catch(err => channel.send(`😨 Something went wrong ${err}`))
									})
								} else if (emojiMap[0] === '2⃣' && emojiMap[1].count > 1) {
									path = 'upcoming-movies'
								} else if (emojiMap[0] === '3⃣' && emojiMap[1].count > 1) {
									path = 'trending-movies'
								} else if (emojiMap[0] === '4⃣' && emojiMap[1].count > 1) {
									path = 'trending-tv'
								} else if (emojiMap[0] === '5⃣' && emojiMap[1].count > 1) {
									path = 'upcoming-games'
								} else if (emojiMap[0] === '6⃣' && emojiMap[1].count > 1) {
									path = 'trending-npm-1'
								} else if (emojiMap[0] === '7⃣' && emojiMap[1].count > 1) {
									path = 'trending-npm-2'
								} else if (emojiMap[0] === '8⃣' && emojiMap[1].count > 1) {
									path = 'trending-github'
								}
								if (path) {
									axios.get(`https://j8xl9nv9k9.execute-api.us-east-1.amazonaws.com/main/api/${path}?key=${process.env.KEY}`)
										.then(() => channel.send(`✅ Database successfully updated ${path} collection`))
										.catch(err => channel.send(`😨 Something went wrong ${err}`))
								}
								msg.react('🛑')
							}
						})
						.catch(console.log)
				})
		}
	}
	if (msg.content === '!upcoming-movies') {
		queryModel('upcoming-movies')
			.then(res => {
				const scraped = (res.updatedAt.getMonth() + 1) + '/' + res.updatedAt.getUTCDate() + '/' + String(res.updatedAt.getFullYear()).slice(2)
				const channel = client.channels.cache.get(CHANNEL_ID)
				const fields = []
				for (const date in res._doc) {
					if (date.match(/\d/g)) { // is data
						let value = ''
						for (const key in res._doc[date]) {
							value += res._doc[date][key].title + '\n'
						}
						fields.push({ name: date.split('_').join(' '), value })
					}
				}
				let monthEmbed = new Discord.MessageEmbed() // embed max 6000
					.setColor('#FFFF00')
					.addFields(...fields)
					.setTitle('Upcoming Movies')
					.setAuthor('CodaBool', 'https://avatars.githubusercontent.com/u/61724833?v=4', 'https://codabool.com')
					.setURL('https://www.imdb.com/calendar')
					.setThumbnail('http://icons.iconarchive.com/icons/danleech/simple/1024/imdb-icon.png')
					.setFooter('Scraped ' + scraped, 'http://icons.iconarchive.com/icons/danleech/simple/1024/imdb-icon.png')
				channel.send(monthEmbed)
			})
			.catch(err => console.log('err', err))
	}
	if (msg.content === '!trending-movies') {
		queryModel('trending-movies')
			.then(res => {
				const date = (res.updatedAt.getMonth() + 1) + '/' + res.updatedAt.getUTCDate() + '/' + String(res.updatedAt.getFullYear()).slice(2)
				const channel = client.channels.cache.get(CHANNEL_ID)
				for (let j = 0; j < 4; j++) {
					const fields = []
					for (let i = 0; i < 25; i++) {
						if (res._doc[(j * 25) + i]) {
							let rating = ''
							if (res._doc[(j * 25) + i].rating) {
								rating = `★${res._doc[(j * 25) + i].rating}`
							} else {
								rating = ' n/a'
							}
							let velocity = ''
							if (res._doc[(j * 25) + i].velocity < 0) {
								velocity = ` (${res._doc[(j * 25) + i].velocity})`
							} else if (res._doc[(j * 25) + i].velocity > 0) {
								velocity = ` (+${res._doc[(j * 25) + i].velocity})`
							} else if (res._doc[(j * 25) + i].velocity === 0) {
								velocity = ' (0)'
							}
							fields.push({
								name: '#' + res._doc[(j * 25) + i].rank + ' ' + res._doc[(j * 25) + i].title,
								value: `${rating} ${velocity}`
							})
						}
					}
					console.log(fields.length)

					const monthEmbed = new Discord.MessageEmbed() // embed max 6000
						.setColor('#FFFF00')
						.addFields(...fields)
						.setTitle('Trending Movies')
						.setAuthor('CodaBool', 'https://avatars.githubusercontent.com/u/61724833?v=4', 'https://codabool.com')
						.setURL('https://www.imdb.com/chart/moviemeter')
						.setThumbnail('http://icons.iconarchive.com/icons/danleech/simple/1024/imdb-icon.png')
						.setFooter('Scraped ' + date, 'http://icons.iconarchive.com/icons/danleech/simple/1024/imdb-icon.png')
					channel.send(monthEmbed)
				}
			})
			.catch(err => console.log('err', err))
	}
	if (msg.content === '!trending-tv') {
		// TODO: args https://discordjs.guide/creating-your-bot/commands-with-user-input.html#basic-arguments
		const args = msg.content.slice(12).trim().split(' ')
		console.log('args', args)
		queryModel('trending-tv')
			.then(res => {
				const date = (res.updatedAt.getMonth() + 1) + '/' + res.updatedAt.getUTCDate() + '/' + String(res.updatedAt.getFullYear()).slice(2)
				const channel = client.channels.cache.get(CHANNEL_ID)
				for (let j = 0; j < 4; j++) {
					const fields = []
					for (let i = 0; i < 25; i++) {
						if (res._doc[(j * 25) + i]) {
							let rating = ''
							if (res._doc[(j * 25) + i].rating) {
								rating = `★${res._doc[(j * 25) + i].rating}`
							} else {
								rating = ' n/a'
							}
							let emoji = ''
							if (res._doc[(j * 25) + i].velocity < 0) {
								emoji = ` (${res._doc[(j * 25) + i].velocity})`
							} else if (res._doc[(j * 25) + i].velocity > 0) {
								emoji = ` (+${res._doc[(j * 25) + i].velocity})`
							} else if (res._doc[(j * 25) + i].velocity === 0) {
								emoji = ' (0)'
							}
							fields.push({
								name: '#' + res._doc[(j * 25) + i].rank + ' ' + res._doc[(j * 25) + i].title,
								value: `${rating} ${emoji}`
							})
						}
					}
					const monthEmbed = new Discord.MessageEmbed() // embed max 6000
						.setColor('#FFFF00')
						.addFields(...fields)
						.setTitle('Trending TV')
						.setAuthor('CodaBool', 'https://avatars.githubusercontent.com/u/61724833?v=4', 'https://codabool.com')
						.setURL('https://www.imdb.com/chart/tvmeter')
						.setThumbnail('http://icons.iconarchive.com/icons/danleech/simple/1024/imdb-icon.png')
						.setFooter('Scraped ' + date, 'http://icons.iconarchive.com/icons/danleech/simple/1024/imdb-icon.png')
					channel.send(monthEmbed)
				}
			})
			.catch(err => console.log('err', err))
	}
})

client.login(process.env.DISCORD_TOKEN)

async function queryModel(collection, query) {
	const connection = await mongoose.connect(process.env.MONGODB_URI)
	let data = null
	try {
		const quickSchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection })
		const Model = mongoose.models[`${collection}`] || mongoose.model(collection, quickSchema)
		data = await Model.findOne()
	} catch (error) {
		console.log(error)
	} finally {
		connection?.disconnect()
		console.log('disconnected')
		return data
	}
}