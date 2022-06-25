import { Event } from '../classes/event.js'
import { writeFile, readFile } from 'fs/promises'

function randomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default new Event('messageCreate', async (client, message) => {
    if (message.author.id === '801563711332024320') {
        const shouldsend = (await readFile('./gabbyphrase.txt', 'utf-8')) === 'enable' ? true : false

        if (!shouldsend) return

        if (randomNum(1, 2) === 1 && !['wanna', 'would'].includes(message.content.toLowerCase().split('')[0]) && !message.content.endsWith('?')) {
            return await message.reply('ok')
        } else {
            return await message.reply('jah')
        }
    } else if (message.author.id === '935932557013426176') {
        if (['gabby:disable', 'gabby:enable'].includes(message.content.toLowerCase())) {
            await writeFile('./gabbyphrase.txt', message.content.toLowerCase().split(':')[1], 'utf-8')

            if (message.content.toLowerCase().startsWith('gabby:disable')) {
                return await message.reply('function `gabby:reply` has been disabled!')
            } else {
                return await message.reply('function `gabby:reply` has been enabled!')
            }
        }
    }
})