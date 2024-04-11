import icons from "lib/icons"
import sh from "service/sh"

const iconVisible = Variable(false)

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
            const found = await sh.query(term)
            list.children = found.map(Item)
            revealer.reveal_child = true
        }
    }

    return Object.assign(revealer, {
        filter,
        run: sh.run,
    })
}
