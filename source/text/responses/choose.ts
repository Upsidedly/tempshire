/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MessageEmbed } from 'discord.js'
import { TextCommand } from '../../classes/textcommand.js'

function chancesOfEach(s: string[]) {
    const map = new Map<string, number>()
    for (const word of s) {
        if (!map.has(word)) {
            map.set(word, 0)
        }
        map.set(word, map.get(word)! + 1)
    }
    return map
}

export default new TextCommand({
    name: 'pick',
    aliases: ['choose', 'decide', 'picks', 'pk', 'chs'],
    fn(_, message, args) {
        const choices = args.join(' ').split(',').map(s => s.trim())

        const pick = choices[Math.floor(Math.random() * choices.length)]

        const chances = chancesOfEach(choices)

        const totalchance = Array.from(chances.values()).reduce((a, b) => a + b)
        const pickchance = (chances.get(pick)! / totalchance) * 100

        const embed = new MessageEmbed()
            .setTitle(':star: pick')
            .setDescription(`**${pick}** (${pickchance.toFixed(1)}% chance)`)
            .setColor([113, 195, 240])

        message.reply({ embeds: [
            embed
        ]})
    }
})