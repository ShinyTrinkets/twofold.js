import fetch from 'node-fetch'

export async function fetchHttp(_, { url, headers = {} }, { double = false }) {
    /**
     * Make a HTTP request.
     */

    if (url.slice(0, 4) !== 'http') {
        url = 'http://' + url
    }

    const resp = await fetch(url, { headers })
    let text = await resp.text()
    text = text.trim()

    if (!resp.ok) text = `ERROR code ${resp.status}: ${text}`

    if (double) {
        return `\n${text}\n`
    }

    return text
}
