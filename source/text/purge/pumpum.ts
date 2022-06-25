import { TextCommand } from '../../classes/textcommand.js'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

const ignore = ['mute', 'student council']

export default new TextCommand({
    name: 'purge-empty-roles',
    aliases: ['peroles', 'purge-roles', 'purgeroles','purgeemptyroles', 'pgroles', 'pgrl'],
    fn: async (client, message) => {
        const guild = message.guild

        if (!guild || guild.id !== '984987273797972049') return

        const yesId = `YES_${(parseInt(message.author.id) * Math.random()).toString(16)}`
        const noId = `NO_${(parseInt(message.author.id) * Math.random()).toString(16)}`

        const response = await message.reply({ content: 'alright bro time to chop the roles, but are you sure tho?', components: [
            new MessageActionRow().addComponents([
                new MessageButton().setLabel('Yes').setEmoji('✅').setStyle('SUCCESS').setCustomId(yesId),
                new MessageButton().setLabel('No').setEmoji('❌').setStyle('DANGER').setCustomId(noId)
            ])
        ]})

        const collector = message.channel.createMessageComponentCollector({
            filter: (m) => m.user.id === message.author.id,
        })

        const emptyRoles = Array.from(guild.roles.cache.values()).filter(r => r.members.size === 0 && !ignore.includes(r.name))

        for (const role of emptyRoles) {
            await response.edit({ embeds: [
                new MessageEmbed({
                    author: { name: 'Deleting Role' },
                    title: role.name,
                    color: role.hexColor,
                    description: ':warning: This role is being deleted...'
                })
            ] })
            await role.delete('Color-chan I swear to god')
            await response.edit({
                embeds: [
                    new MessageEmbed({
                        author: { name: 'Deleted Role' },
                        title: role.name,
                        color: 'GREEN',
                        description: `✅ Role \`${role.name}\` has been deleted.`
                    })
                ]
            })
        }

        await response.edit('Done')
    }
})