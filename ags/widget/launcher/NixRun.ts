import icons from "lib/icons"
import nix, { type Nixpkg } from "service/nix"

const iconVisible = Variable(false)

function Item(pkg: Nixpkg) {
    const name = Widget.Label({
        class_name: "name",
        label: pkg.name.split(".").at(-1),
    })

    const subpkg = pkg.name.includes(".") ? Widget.Label({
        class_name: "description",
        hpack: "end",
        hexpand: true,
        label: `  ${pkg.name.split(".").slice(0, -1).join(".")}`,
    }) : null

    const version = Widget.Label({
        class_name: "version",
        label: pkg.version,
        hexpand: true,
        hpack: "end",
    })

    const description = pkg.description ? Widget.Label({
        class_name: "description",
        label: pkg.description,
        justification: "left",
        wrap: true,
        hpack: "start",
        max_width_chars: 40,
    }) : null

    return Widget.Box(
        {
            attribute: { name: pkg.name },
            vertical: true,
        },
        Widget.Separator(),
        Widget.Button(
            {
                class_name: "nix-item",
                on_clicked: () => {
                    nix.run(pkg.name)
                    App.closeWindow("launcher")
                },
            },
            Widget.Box(
                { vertical: true },
                Widget.Box([name, version]),
                Widget.Box([
                    description as ReturnType<typeof Widget.Label>,
                    subpkg as ReturnType<typeof Widget.Label>,
                ]),
            ),
        ),
    )
}

export function Spinner() {
    const icon = Widget.Icon({
        icon: icons.nix.nix,
        class_name: "spinner",
        css: `
            @keyframes spin {
                to { -gtk-icon-transform: rotate(1turn); }
            }

            image.spinning {
                animation-name: spin;
                animation-duration: 1s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        `,
        setup: self => self.hook(nix, () => {
            self.toggleClassName("spinning", !nix.ready)
        }),
    })

    return Widget.Revealer({
        transition: "slide_left",
        child: icon,
        reveal_child: Utils.merge([
            nix.bind("ready"),
            iconVisible.bind(),
        ], (ready, show) => !ready || show),
    })
}

export function NixRun() {
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
            const found = await nix.query(term)
            list.children = found.map(k => Item(nix.db[k]))
            revealer.reveal_child = true
        }
    }

    return Object.assign(revealer, {
        filter,
        run: nix.run,
    })
}
