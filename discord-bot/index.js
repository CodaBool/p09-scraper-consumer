require('dotenv').config({path: __dirname.split('\\').slice(0, __dirname.split('\\').length - 1).join('\\') + '\\.env'})
// console.log('path =', __dirname+'../env')
console.log('path =', __dirname.split('\\').slice(0, __dirname.split('\\').length - 1).join('\\') + '\\.env')
console.log('path =', process.env.CHANNEL_ID, process.env.DISCORD_TOKEN)
const Discord = require('discord.js')
const mongoose = require('mongoose')
const client = new Discord.Client()
const asTable = require ('as-table') // .configure({delimiter: ' | ', dash: '-'})

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	client.user.setActivity('websites', { type: 'WATCHING', url: 'https://github.com/CodaBool/lambda-scraper'})
})

const CHANNEL_ID = process.env.CHANNEL_ID
// const CHANNEL_ID = process.env.CHANNEL_ID_TEST // bot test channel

client.on('message', msg => {
  if (msg.content === '!any-bots') {
		const channel = client.channels.cache.get(CHANNEL_ID)
		channel.send('yo')
	}
  if (msg.content === '!github') {
		queryModel('trending-github')
			.then(res => {
				const channel = client.channels.cache.get(CHANNEL_ID)
				for (let j = 0; j < 5; j++) {
					const data = []
					for (let i = 0; i < 20; i++) {
						if (res._doc[(j*20) + i]) {
							data.push({
								stars: res._doc[(j*20) + i].stars,
								repo: res._doc[(j*20) + i].name,
								description: res._doc[(j*20) + i].description.slice(0, 45)
							})
						}
					}
					// console.log('DEBUG: sending table with', asTable(data).length, 'length') // 2000
					channel.send('```md\npage ('+(j+1)+'/5)\n'+asTable(data)+'```')
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
						fields.push({name: date.split('_').join(' '), value})
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
						if (res._doc[(j*25) + i]) {
							let rating = ''
							if (res._doc[(j*25) + i].rating) {
								rating = `★${res._doc[(j*25) + i].rating}`
							} else {
								rating = ' n/a'
							}
							let velocity = ''
							if (res._doc[(j*25) + i].velocity < 0) {
								velocity = ` (${res._doc[(j*25) + i].velocity})`
							} else if (res._doc[(j*25) + i].velocity > 0) {
								velocity = ` (+${res._doc[(j*25) + i].velocity})`
							} else if (res._doc[(j*25) + i].velocity === 0) {
								velocity = ' (0)'
							}
							fields.push({
								name: '#' + res._doc[(j*25) + i].rank + ' ' + res._doc[(j*25) + i].title,
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
	if (msg.content.includes('!trending-tv')) {
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
						if (res._doc[(j*25) + i]) {
							let rating = ''
							if (res._doc[(j*25) + i].rating) {
								rating = `★${res._doc[(j*25) + i].rating}`
							} else {
								rating = ' n/a'
							}
							let emoji = ''
							if (res._doc[(j*25) + i].velocity < 0) {
								emoji = ` (${res._doc[(j*25) + i].velocity})`
							} else if (res._doc[(j*25) + i].velocity > 0) {
								emoji = ` (+${res._doc[(j*25) + i].velocity})`
							} else if (res._doc[(j*25) + i].velocity === 0) {
								emoji = ' (0)'
							}
							fields.push({
								name: '#' + res._doc[(j*25) + i].rank + ' ' + res._doc[(j*25) + i].title,
								value: `${rating} ${emoji}`
							})
						}
					}
					const monthEmbed = new Discord.MessageEmbed() // embed max 6000
						.setColor('#FFFF00')
						.addFields(...fields)
						.setTitle('Trending Movies')
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
  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
	let data = null
  try {
    const quickSchema = new mongoose.Schema({}, { strict: false, timestamps: true, collection })
    const Model = mongoose.model(collection, quickSchema)
		data = await Model.findOne()
  } catch (error) {
    console.log(error)
  } finally {
		connection?.disconnect()
		console.log('disconnected')
		return data
  }
}