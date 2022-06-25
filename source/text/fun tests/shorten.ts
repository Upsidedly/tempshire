import { TextCommand } from './../../classes/textcommand.js'
export default new TextCommand({
    name: 'shorten',
    aliases: ['shortn', 'smolify', 'smallify', 'shortify', 'shtn'],
    fn: async (client, message, args) => {
        await message.reply(`Taken from the **Blockly Oxford University Computing Challenge**\nresult:\n\n${args.map(s => s.replaceAll(/a|e|i|o|u/g, '').charAt(0).toUpperCase() + s.replaceAll(/a|e|i|o|u/g, '').slice(1)).join('')}`)
    }

})