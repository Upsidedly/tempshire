/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Command } from './command.js'
import { Client, ClientEvents, ClientOptions, Collection, MessageEmbed, Snowflake } from 'discord.js'
import { readdir } from 'fs/promises'
import config from '../hellshire.config.js'
import { Event } from './event.js'
import { TextCommand } from './textcommand.js'

interface HellshireOptions extends ClientOptions {
    owners: string[]
}

export class Hellshire extends Client<true> {
    public readonly owners: Snowflake[]

    public readonly command = new Collection<string, Collection<string, Command>>([
        ['globals', new Collection()],
    ])

    public readonly textcommand = new Collection<string, TextCommand>()
    public readonly aliases = new Collection<string, string>()
    public readonly categories = new Collection<string, Collection<string, TextCommand>>()

    constructor(options: HellshireOptions) {
        super(options)
        this.owners = options.owners
    }

    async events() {
        const directory = (await readdir('./dist/events/')).filter(file => file.endsWith('.js'))

        for (const file of directory) {
            const event: Event<keyof ClientEvents> = (await import(`../events/${file}`)).default
            if (event.how === 'on') {
                this.on(event.name, (...args) => {
                    event.callback(this, ...args as ClientEvents[keyof ClientEvents])
                })
            } else {
                this.once(event.name, (...args) => {
                    event.callback(this, ...args as ClientEvents[keyof ClientEvents])
                })
            }
        }
    }

    async text() {
        const directories = (await readdir('./dist/text/'))

        for (const directory of directories) {
            try {
                for (const file of (await readdir(`./dist/text/${directory}`)).filter(f => f.endsWith('.js'))) {
                    const command: TextCommand = (await import(`../text/${directory}/${file}`)).default
                    this.textcommand.set(command.name, command)
                    if (command.aliases) {
                        for (const alias of command.aliases) {
                            this.aliases.set(alias, command.name)
                        }
                    }

                    if (command.categories) {
                        for (const category of command.categories) {
                            if (!this.categories.has(category)) this.categories.set(category, new Collection())
                            this.categories.get(category)!.set(command.name, command)
                        }
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }

        const cooldowns = new Collection<string, Collection<string, number>>() 

        this.on('messageCreate', async (message) => {
            if (!message.content.startsWith(config.prefix)) return

            const args = message.content.slice(config.prefix.length).split(/\s+/)
            const name = args.shift()!.toLowerCase().trim()

            if (!this.textcommand.has(name) && !this.textcommand.has(this.aliases.get(name) || '')) return

            const command = (this.textcommand.get(name) || this.textcommand.get(this.aliases.get(name) || ''))!

            // Permission Check

            if (command.permissions) {
                if (command.permissions.onlyOwners) {
                    if (!this.owners.includes(message.author.id)) {
                        await message.reply('You are not allowed to use this command!')
                        return
                    }
                }

                if (command.permissions.onlyUsers) {
                    if (!command.permissions.onlyUsers.includes(message.author.id)) {
                        await message.reply('You are not allowed to use this command!')
                        return
                    }
                }

                if (command.permissions.onlyRoles) {
                    if (!message.member!.roles.cache.some(r => command.permissions!.onlyRoles!.includes(r.id))) {
                        await message.reply('You are not allowed to use this command!')
                        return
                    }
                }
            }

            // Cooldown Check

            if (command.cooldown) {
                if (!cooldowns.has(command.name)) {
                    cooldowns.set(command.name, new Collection())
                }

                const now = Date.now()
                const timestamps = cooldowns.get(command.name)!
                const cooldownAmount = command.cooldown

                const timestamp = timestamps.get(message.author.id)
                if (timestamp) {
                    const exp = timestamp + cooldownAmount

                    if (now < exp) {
                        const left = exp - now
                        await message.reply({
                            embeds: [
                                new MessageEmbed({
                                    color: [209, 86, 86],
                                    author: { iconURL: message.author.displayAvatarURL({ dynamic: true }), name: message.author.tag },
                                    description: `:hourglass: This command is on cooldown, please wait until you attempt to use this command again in <t:${Math.round(Date.now() / 1000 + left / 1000)}:R>`
                                })
                            ]
                        })
                    }
                }

                timestamps.set(message.author.id, now)
            }

            try {
                command.fn(this, message, args, name)
            } catch (err) {
                console.error(err)
            }

        })
    }

    async commands() {
        const directories = (await readdir('./dist/commands/'))

        for (const directory of directories) {
            for (const file of (await readdir(`./dist/commands/${directory}`)).filter(f => f.endsWith('.js'))) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const command: Command = (await import(`../commands/${directory}/${file}`)).default

                const server = null
                // pass
            }
        }
    }
}