/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TextCommand } from '../../classes/textcommand.js'

const m = new Map([
    [1, 'a'],
    [2, 'b'],
    [3, 'c'],
    [4, 'd'],
    [5, 'e'],
    [6, 'f'],
    [7, 'g'],
    [8, 'h'],
    [9, 'i'],
    [10, 'j'],
    [11, 'k'],
    [12, 'l'],
    [13, 'm'],
    [14, 'n'],
    [15, 'o'],
    [16, 'p'],
    [17, 'q'],
    [18, 'r'],
    [19, 's'],
    [20, 't'],
    [21, 'u'],
    [22, 'v'],
    [23, 'w'],
    [24, 'x'],
    [25, 'y'],
    [26, 'z']
])

function encrypt(s: string) {
    let safe = Array.from(s.normalize('NFC'))
    safe = safe.map(c => c !== ' ' ? (c.charCodeAt(0) + 1).toString() : ' ')
    // safe = safe.map(c => shuffle(Array.from(c)).join(''))
    safe = Array.from(safe.join('').match(/.{1,2}|\s/g) ?? ['34', '58'])
    safe = safe.map(c => {
        if (c === ' ') return ' '
        const n = (parseInt(c) % 26) || 1
        return m.get(n)!
    })
    return safe.join('')
}

export default new TextCommand({
    name: 'encrypt',
    aliases: ['enc', 'encode'],
    fn: async (client, message, args) => {
        message.reply(`Result:\n\n${args.map(s => encrypt(s)).join(' ')}`)
    }
})