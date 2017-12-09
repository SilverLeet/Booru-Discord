//Deletes the last X images that the bot posted
//Useful if it pulls up an image you don't want to see

module.exports.config = {
  name: 'delete',
  invokers: ['delete', 'del', 'delet this'],
  help: 'Deletes images that the bot posted',
  expandedHelp: 'Deletes the last X images that the bot posted.\n\n**Usage:**:\n`delete` => Deletes last image\n`delete 4` => Deletes last 4 images\n\nUsers without "Manage Messages" perm can only delete 5 images at a time'
}

const Discord = require('discord.js')

module.exports.events = {}
module.exports.events.message = (bot, message) => {
  let args = bot.modules.shlex(message.content)
  let msgsToDelete = parseInt(args[1])

  if (msgsToDelete <= 0)
    return message.channel.send(`I can't delete ${msgsToDelete} messages!`)

  if (Number.isNaN(msgsToDelete)) {
    if (message.channel.lastImagePosted === undefined)
      return message.channel.sendMessage('I don\'t have a message cached for this channel! You can still try `delete 1` and force me to search the last 50 messages')

    message.channel.lastImagePosted.delete()
      .then(msg => message.channel.sendMessage('Deleted last image...'))
      .catch(err => message.channel.sendMessage('I don\'t have a message cached for this channel! You can still try `delete 1` and force me to search the last 50 messages'))

  } else if (msgsToDelete > 5 && !message.channel.permissionsFor(message.author).hasPermission('MANAGE_MESSAGES')) {
    message.channel.sendMessage('Whoa there, users without "Manage Messages" can only delete max 5 images at a time')

  } else {
    message.channel.fetchMessages({limit: 50})
      .then(msgs => {
        let delMsgs = msgs.filter(msg => {return msg.author.equals(bot.user) && msg.embeds[0] !== undefined}).array().slice(0, msgsToDelete)

        if (delMsgs.length === 0)
          return message.channel.send('There\'s nothing for me to delete.')

        if (delMsgs.length < 2 || !message.channel.permissionsFor(bot.user).hasPermission('MANAGE_MESSAGES')) {
          for (let msg of delMsgs) msg.delete()
          message.channel.send(`Deleted ${delMsgs.length} message${(delMsgs.length === 1) ? '' : 's'} manually...`)
        } else {
          message.channel.bulkDelete(delMsgs)
            .then(msgs => message.channel.send(`Deleted ${msgs.size} message${(msgs.size === 1) ? '' : 's'}...`)).catch(console.log)
        }
      })
  }
}

module.exports.events.messageReactionAdd = (bot, react, user) => {
  if (react.users.size < 2 || !react.message.embeds[0] || react.message.author.id !== bot.user.id) return
  if (react.emoji.name !== react.message.reactions.first().emoji.name) return

  //react.message.channel.send(`**count**: ${react.count}\n**users**: ${[...react.users.keys()].join(', ')}\n**users.size**: ${react.users.size}`)

  if (react.me && react.users.size >= 2 && !react.message.embeds[0].description.endsWith('[](META-DELETED)')) {
    let embed = new Discord.RichEmbed()
      .setAuthor(`Message deleted by ${user.username}#${user.discriminator} (Click for image)`, react.message.embeds[0].url, react.message.embeds[0].url)
      .setDescription('Use `b!del` to remove this completely. [](META-DELETED)')

    react.message.edit({embed})
  }
}
