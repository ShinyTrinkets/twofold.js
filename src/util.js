import os from 'os'
import fs from 'fs'
import path from 'path'
import { types } from 'util'

export const isFunction = f => typeof f === 'function' || types.isAsyncFunction(f)

// Credit: https://stackoverflow.com/a/32604073/498361
export function toCamelCase(str) {
    return (
        str
            // Replace any - or _ characters with a space
            .replace(/[-_]+/g, ' ')
            // Remove any non alphanumeric characters
            .replace(/[^\w\s]/g, '')
            // Remove space from the start and the end
            .trim()
            // Uppercase the first character in each group immediately following a space
            // (delimited by spaces)
            .replace(/ (.)/g, function ($1) {
                return $1.toUpperCase()
            })
            // Remove all spaces
            .replace(/ /g, '')
    )
}

function unTildify(pth) {
    if (pth[0] === '~') {
        const homeDir = os.homedir()
        return pth.replace(/^~(?=$|\/|\\)/, homeDir)
    }
    return pth
}

export async function importAny(dir) {
    /**
     * Import any local file, module, or all JS files from a folder.
     */
    dir = unTildify(dir)
    dir = dir[0] === '/' ? dir : path.join(process.cwd(), dir)
    try {
        return await import(dir)
    } catch (err) {
        console.warn(`Import error: ${err.message}, require '${dir}'`)
    }
}
