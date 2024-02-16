import options from "options"
const { messageAsync } = await Service.import("hyprland")

const { hyprland } = options
const {
    spacing,
    radius,
    border: { width },
    shadows,
    dark: { primary: { bg: darkActive } },
    light: { primary: { bg: lightActive } },
    scheme,
} = options.theme

const deps = [
    "hyprland",
    spacing.id,
    radius.id,
    width.id,
    shadows.id,
    darkActive.id,
    lightActive.id,
    scheme.id,
]

export default function init() {
    options.handler(deps, setupHyprland)
    setupHyprland()
}

function activeBorder() {
    const color = scheme.value === "dark"
        ? darkActive.value
        : lightActive.value

    return color.replace("#", "")
}

function sendBatch(batch: string[]) {
    const cmd = batch
        .filter(x => !!x)
        .map(x => `keyword ${x}`)
        .join("; ")

    messageAsync(`[[BATCH]]/${cmd}`)
}

function blur(name: string) {
    const blur = hyprland.blur.value
    const alpha = hyprland.alpha.value
    const rule = [
        `layerrule unset, ${name}`,
        `layerrule blur, ${name}`,
    ]

    if (blur === "*")
        return [...rule, `layerrule ignorealpha ${alpha}, ${name}`]

    if (blur.some(b => name.includes(b)))
        return [...rule, `layerrule ignorealpha ${alpha}, ${name}`]

    return []
}

function setupHyprland() {
    const wm_gaps = Math.floor(hyprland.gaps.value * spacing.value)

    sendBatch([
        `general:border_size ${width.value}`,
        `general:gaps_out ${wm_gaps}`,
        `general:gaps_in ${Math.floor(wm_gaps / 2)}`,
        `general:col.active_border rgba(${activeBorder()}ff)`,
        `general:col.inactive_border rgba(${hyprland.inactiveBorder.value})`,
        `decoration:rounding ${radius.value}`,
        `decoration:drop_shadow ${shadows.value ? "yes" : "no"}`,
    ])

    sendBatch(App.windows.flatMap(({ name }) => blur(name!)))
}
