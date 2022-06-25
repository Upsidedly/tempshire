import { TextCommand } from '../../classes/textcommand.js'

const characters = [
    'Josuke (P4)',
    'Dio Brando (P1)',
    'Jotaro Kujo',
    'DIO',
    'Josuke (P8)',
    'Jolyne Cujoh',
    'Kakyoin Noriaki',
    'Jean-Pierre Polnareff',
    'Joseph Joestar (P2)',
    'Joseph Joestar (P3)',
    'Stroheim',
    'Jonathan Joestar',
    'Giorno',
    'Bucciarati',
    'Mista',
    'Panacotta Fugo',
    'Naracia Ghirga',
    'Gyro Zeppeli',
    'Ceasar Zeppeli',
    'Johnny Joestar',
    'Bruford',
    'Speedwagon',
    'Smokey',
    'Suzi Q',
    'Kars',
    'Esidisi',
    'Wamuu',
    'Avdol',
    'Hol Horse',
    'Daniel D\'Arby',
    'Alessi (The Pervert)',
    'Oingo',
    'Boingo',
    'Okuyasu',
    'Koichi',
    'Rohan Kishibe',
    'Mikitaka Hazekura (the alien of P4)',
    'Yoshikage Kira',
    'Akira Otoishi (Red Hot Chilli Peppers)',
    'Abbacchio',
    'Trish Una',
    'Diavolo',
    'Vinegar Doppio',
    'Squalo (u gay)',
    'Tiziano (u gay)',
    'Pesci (wierd head man)',
    'Ermes Costello',
    'Foo Fighters',
    'Weather Report',
    'Gwess',
    'Pucci',
    'Diego Brando',
    'Blackmore'
]

export default new TextCommand({
    name: 'which-jojo-char',
    aliases: ['jojowhich', 'wjojo', 'wjj'],
    fn(_, message, args) {
        const random = args[0] === 'random'
        const number = parseInt(message.author.id.slice(-3, -1)) % characters.length
        const character = random ? characters[Math.floor(Math.random() * characters.length)] : characters[number]
        message.reply(`which jojo character are you?\n\nYou are **${character}**`)
    }
})