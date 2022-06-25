import { ApplicationCommandData, ApplicationCommandOptionData, CommandInteraction, MessageContextMenuInteraction, UserContextMenuInteraction } from 'discord.js'
import { Hellshire } from './client.js'

function objectExists(obj: Record<string, unknown> | null | undefined): obj is Record<string, unknown> {
    if (obj === null || obj === undefined) return false
    if (Object.keys(obj).length === 0) return false
    return true
}

function arrayExists(arr: unknown[] | null | undefined): arr is unknown[] {
    if (arr === null || arr === undefined) return false
    if (arr.length === 0) return false
    return true
}

type CommandTypes = {
    'CHAT_INPUT': CommandInteraction,
    'MESSAGE': MessageContextMenuInteraction,
    'USER': UserContextMenuInteraction
}

type CommandOptions = {
    [K in keyof CommandTypes]: {
        name: string,
        description: string,
        type: K,
        fn: (client: Hellshire, inter: CommandTypes[K]) => unknown,
        options?: ApplicationCommandOptionData[]
    }
}[keyof CommandTypes] | {
    name: string,
    description: string,
    fn: (client: Hellshire, inter: CommandInteraction) => unknown,
    options?: ApplicationCommandOptionData[]
}

type CommandPermissions = {
    onlyUsers?: string[],
    onlyRoles?: string[],
    onlyOwners?: boolean,
    onlyServers?: string[],
}

export class Command {
    name: string
    description: string
    fn: ((client: Hellshire, inter: CommandInteraction) => unknown) | ((client: Hellshire, inter: MessageContextMenuInteraction) => unknown) | ((client: Hellshire, inter: UserContextMenuInteraction) => unknown) | ((client: Hellshire, inter: CommandInteraction) => unknown)
    permissions: CommandPermissions | null
    options: ApplicationCommandOptionData[] | null

    constructor(options: CommandOptions, perms?: CommandPermissions) {
        this.name = options.name
        this.description = options.description
        this.fn = options.fn
        this.permissions = objectExists(perms) ? perms : null
        this.options = arrayExists(options.options) ? options.options : null
    }

    format(): ApplicationCommandData {
        return {
            name: this.name,
            description: this.description,
            options: this.options ? this.options : undefined,
            defaultPermission: objectExists(this.permissions),
        }
    }
}