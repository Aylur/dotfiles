import { Variable } from "resource:///com/github/Aylur/ags/variable.js"
import { wait } from "./utils"

type OptProps = {
    persistent?: boolean
}

export class Opt<T = unknown> extends Variable<T> {
    static { Service.register(this) }

    constructor(initial: T, { persistent = false }: OptProps = {}) {
        super(initial)
        this.initial = initial
        this.persistent = persistent
    }

    initial: T
    id = ""
    persistent: boolean
    toString() { return `${this.value}` }
    toJSON() { return `opt:${this.value}` }

    init(cacheFile: string) {
        const cacheV = JSON.parse(Utils.readFile(cacheFile) || "{}")[this.id]
        if (cacheV !== undefined)
            this.value = cacheV

        this.connect("changed", () => {
            const cache = JSON.parse(Utils.readFile(cacheFile) || "{}")
            cache[this.id] = this.value
            Utils.writeFileSync(JSON.stringify(cache, null, 2), cacheFile)
        })
    }

    reset() {
        if (this.persistent)
            return

        if (JSON.stringify(this.value) !== JSON.stringify(this.initial)) {
            this.value = this.initial
            return this.id
        }
    }
}

export const opt = <T>(initial: T, opts?: OptProps) => new Opt(initial, opts)

function getOptions(object: object, path = ""): Opt[] {
    return Object.keys(object).flatMap(key => {
        const obj: Opt = object[key]
        const id = path ? path + "." + key : key

        if (obj instanceof Variable) {
            obj.id = id
            return obj
        }

        if (typeof obj === "object")
            return getOptions(obj, id)

        return []
    })
}

export function mkOptions<T extends object>(cacheFile: string, object: T) {
    for (const opt of getOptions(object))
        opt.init(cacheFile)

    Utils.ensureDirectory(cacheFile.split("/").slice(0, -1).join("/"))

    const configFile = `${TMP}/config.json`
    const values = getOptions(object).reduce((obj, { id, value }) => ({ [id]: value, ...obj }), {})
    Utils.writeFileSync(JSON.stringify(values, null, 2), configFile)
    Utils.monitorFile(configFile, () => {
        const cache = JSON.parse(Utils.readFile(configFile) || "{}")
        for (const opt of getOptions(object)) {
            if (JSON.stringify(cache[opt.id]) !== JSON.stringify(opt.value))
                opt.value = cache[opt.id]
        }
    })

    async function reset(
        [opt, ...list] = getOptions(object),
        id = opt?.reset(),
    ): Promise<Array<string>> {
        if (!opt)
            return wait(0, () => [])

        return id
            ? [id, ...(await wait(50, () => reset(list)))]
            : await wait(0, () => reset(list))
    }

    return Object.assign(object, {
        configFile,
        array: () => getOptions(object),
        async reset() {
            return (await reset()).join("\n")
        },
        handler(deps: string[], callback: () => void) {
            for (const opt of getOptions(object)) {
                if (deps.some(i => opt.id.startsWith(i)))
                    opt.connect("changed", callback)
            }
        },
    })
}

