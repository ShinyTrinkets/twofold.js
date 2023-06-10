import { $ } from 'execa'

export async function cmd(_, { cmd, args = [] } = {}, { double = false } = {}) {
    /**
     * Execute a system command and return the output.
     */

    // Shell?
    const { stdout } = await $`${cmd} ${args}`

    if (double) {
        return `\n${stdout.trim()}\n`
    }

    return stdout.trim()
}
