import icons from "lib/icons"
import options from "options"
import { bash, dependencies } from "lib/utils"

const iconVisible = Variable(false)

const MAX = options.launcher.sh.max
const BINS = `${Utils.CACHE_DIR}/binaries`
bash("{ IFS=:; ls -H $PATH; } | sort ")
    .then(bins => Utils.writeFile(bins, BINS))

async function query(filter: string) {
    if (!dependencies("fzf"))
        return [] as string[]

    return bash(`cat ${BINS} | fzf -f ${filter} | head -n ${MAX}`)
        .then(str => Array.from(new Set(str.split("\n").filter(i => i)).values()))
        .catch(err => { print(err); return [] })
}

function run(args: string) {
    Utils.execAsync(args)
        .then(out => {
            print(`:sh ${args.trim()}:`)
            print(out)
        })
        .catch(err => {
            Utils.notify("ShRun Error", err, icons.app.terminal)
        })
}

function Item(bin: string) {
    return Widget.Box(
        {
            attribute: { bin },
            vertical: true,
        },
        Widget.Separator(),
        Widget.Button({
            child: Widget.Label({
                label: bin,
                hpack: "start",
            }),
            class_name: "sh-item",
            on_clicked: () => {
                Utils.execAsync(bin)
                App.closeWindow("launcher")
            },
        }),
    )
}

export function Icon() {
    const icon = Widget.Icon({
        icon: icons.app.terminal,
        class_name: "spinner",
    })

    return Widget.Revealer({
        transition: "slide_left",
        child: icon,
        reveal_child: iconVisible.bind(),
    })
}

export function ShRun() {
    const list = Widget.Box<ReturnType<typeof Item>>({
        vertical: true,
    })

    const revealer = Widget.Revealer({
        child: list,
    })

    async function filter(term: string) {
        iconVisible.value = Boolean(term)

        if (!term)
            revealer.reveal_child = false

        if (term.trim()) {
            const found = await query(term)
            list.children = found.map(Item)
            revealer.reveal_child = true
        }
    }

    return Object.assign(revealer, { filter, run })
}
