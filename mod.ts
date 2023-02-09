import { parse } from 'https://deno.land/std@0.123.0/flags/mod.ts'
import { copy, readerFromStreamReader } from 'https://deno.land/std@0.123.0/streams/conversion.ts'
import { bold, green, red, yellow, blue, gray, inverse } from 'https://deno.land/x/std@0.123.0/fmt/colors.ts'

const between = (n: number, x: number, y: number) => x >= n && n < y

type Arguments = {
    headers: boolean,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body?: BodyInit,
    url: string,
    json?: boolean,
    output?: boolean,
}

function parseArguments(): Arguments {
    const { headers, method, body, json, output, _ } = parse(Deno.args, {
        boolean: ['headers', 'output', 'json'],
        string: ['method', 'body'],
        alias: {
            headers: ['h'],
            method: ['m', 'verb', 'v'],
            body: ['b', 'data', 'd'],
            output: ['o', 'response', 'r']
        },
        default: {
            method: 'GET'
        }
    })

    const url = _.shift() || prompt('URL: ')
    if (!url) {
        console.error('Invalid URL')
        Deno.exit(1)
    }

    return { url, headers, method, body, json, output } as Arguments
}

const { url, headers, method, body, json, output } = parseArguments()

const response = await butler(url.toString(), { method, body })

if (output && response.body) {
    const reader = readerFromStreamReader(response.body.getReader())
    await copy(reader, Deno.stdout)
    Deno.exit(0)
}

const result = inverse([
    bold(blue(' ' + method + ' ')),
    response.url,
    function () {
        const str = ' ' + response.status + ' ' + response.statusText + ' '
        if (between(response.status, 200, 300)) {
            return green(str)
        } else if (between(response.status, 400, 500)) {
            return red(str)
        } else if (between(response.status, 500, 600)) {
            return yellow(str)
        } else { return blue(str) }
    }(),
].join(' '))

console.log('\n' + result + '\n')

if (headers) {
    console.log(blue(bold(' Headers ')) + '\n')
    for (const [header, value] of response.headers) {
        console.log(gray(header + ': '), value)
    }
    console.log('\n' + blue(bold(' Response ')) + '\n')
}

if (response.headers.get('content-type')?.includes('json') || json) {
    const data = response.json()
    console.log(await data, '\n')
    Deno.exit(0)
}

if (response.body) {
    const reader = readerFromStreamReader(response.body.getReader())
    await copy(reader, Deno.stdout)
    console.log('\n')
}
