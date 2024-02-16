/* eslint-disable max-len */
import { type Opt } from "lib/option"
import options from "options"
import { bash } from "lib/utils"

const deps = ["font", "theme", "bar.flatButtons", "bar.position"]

const dirs = [
    `${App.configDir}/style/mixins`,
    `${App.configDir}/style/widget`,
]

const {
    dark,
    light,
    scheme,
    padding,
    spacing,
    radius,
    shadows,
    widget,
    border,
} = options.theme

const popoverPaddingMultiplier = 1.6

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const t = (dark: Opt<any> | string, light: Opt<any> | string) => scheme.value === "dark"
    ? `${dark}` : `${light}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $ = (name: string, value: string | Opt<any>) => `$${name}: ${value};`

const variables = () => [
    $("bg", t(dark.bg, light.bg)),
    $("fg", t(dark.fg, light.fg)),

    $("primary-bg", t(dark.primary.bg, light.primary.bg)),
    $("primary-fg", t(dark.primary.fg, light.primary.fg)),

    $("error-bg", t(dark.error.bg, light.error.bg)),
    $("error-fg", t(dark.error.fg, light.error.fg)),

    $("padding", `${padding}pt`),
    $("spacing", `${spacing}pt`),
    $("radius", `${radius}px`),
    $("transition", `${options.transition}ms`),

    $("shadows", `${shadows}`),

    $("widget-bg", `transparentize(${t(dark.widget, light.widget)}, ${widget.opacity.value / 100})`),

    $("hover-bg", `transparentize(${t(dark.widget, light.widget)}, ${(widget.opacity.value * .9) / 100})`),
    $("hover-fg", `lighten(${t(dark.fg, light.fg)}, 8%)`),

    $("border-width", `${border.width}px`),
    $("border-color", `transparentize(${t(dark.border, light.border)}, ${border.opacity.value / 100})`),
    $("border", "$border-width solid $border-color"),

    $("active-gradient", `linear-gradient(to right, ${t(dark.primary.bg, light.primary.bg)}, darken(${t(dark.primary.bg, light.primary.bg)}, 4%))`),
    $("shadow-color", t("rgba(0,0,0,.6)", "rgba(0,0,0,.4)")),
    $("text-shadow", t("2pt 2pt 2pt $shadow-color", "none")),

    $("popover-border-color", `transparentize(${t(dark.border, light.border)}, ${Math.max(((border.opacity.value - 1) / 100), 0)})`),
    $("popover-padding", `$padding * ${popoverPaddingMultiplier}`),
    $("popover-radius", radius.value === 0 ? "0" : "$radius + $popover-padding"),

    $("font-size", `${options.font.size}pt`),
    $("font-name", options.font.name),

    // etc
    $("charging-bg", "#00D787"),
    $("charging-fg", "#141414"),
    $("bar-battery-blocks", options.bar.battery.blocks),
    $("bar-position", options.bar.position),
    $("hyprland-gaps-multiplier", options.hyprland.gaps),
]

async function resetCss() {
    const vars = "/tmp/ags/variables.scss"
    await Utils.writeFile(variables().join("\n"), vars)

    const files = dirs.flatMap(dir => Utils.exec(`ls ${dir}`)
        .split(/\s+/)
        .map(file => `@import '${dir}/${file}';`))

    const scss = [`@import '${vars}';`, ...files].join("\n")
    const css = await bash`echo "${scss}" | sass --stdin`
    const file = "/tmp/ags/style.css"

    await Utils.writeFile(css, file)
    App.resetCss()
    App.applyCss(file)
}

export default function init() {
    dirs.forEach(dir => Utils.monitorFile(dir, resetCss))
    options.handler(deps, resetCss)
    resetCss()
}
