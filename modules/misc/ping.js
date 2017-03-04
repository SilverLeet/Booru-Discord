//wew
module.exports.config = {
  name: 'ping',
  invokers: ['ping'],
  help: 'pong',
  expandedHelp: 'Tests the bot\'s ping\n\n**Usage:** `ping`',
}

module.exports.events = {}
module.exports.events.message = (bot, message) => {
  let score = [randInt(0,8), randInt(0,8)]
  let reverseChar = '‮'
  //left-to-right override char, for (detide)

  message.channel.sendMessage(dedent`
    \`\`\`
    ─────┬───── atlas sucks
    |   ${score[0]}░${score[1]}
    ·    ░   |
    ─────┴─────
    \`\`\``).then(newMsg => {
      newMsg.edit(dedent`
        \`\`\`
        ─────┬───── Pong! ${newMsg.createdTimestamp - message.createdTimestamp}ms
        |   ${score[0]}░${score[1]+1}
        .    ░   |
        ─────┴─────
        \`\`\`${reverseChar}`)
    })
}

//thanks mdn
function randInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/* https://gist.github.com/zenparsing/5dffde82d9acef19e43c
 * Thanks zenparsing
 */
function dedent(callSite, ...args) {
  function format(str) {
    let size = -1
    return str.replace(/\n(\s+)/g, (m, m1) => {
      if (size < 0)
          size = m1.replace(/\t/g, "    ").length

      return "\n" + m1.slice(Math.min(m1.length, size))
    })
  }

  if (typeof callSite === "string")
    return format(callSite)

  if (typeof callSite === "function")
    return (...args) => format(callSite(...args))

  let output = callSite
    .slice(0, args.length + 1)
    .map((text, i) => (i === 0 ? "" : args[i - 1]) + text)
    .join("")

  return format(output)
}

/*
```
─────┬─────
 |  0░1
   · ░   |
─────┴─────
```

```
─────┬─────
 |  0░2
 .   ░   |
─────┴─────
```
*/
