const v = {
    ags: pkg.version.split(".").map(Number),
    expect: [1, 7, 8],
}

function mismatch() {
    print(`my config needs at least v${v.expect.join(".")}, yours is v${v.ags.join(".")}`)
    App.connect("config-parsed", app => app.Quit())
    return {}
}

function check() {
    if (v.ags[1] < v.expect[1])
        return false

    if (v.ags[2] < v.expect[2])
        return false

    return true
}

const main = "/tmp/ags/main.js"
const outdir = `${App.configDir}/main.ts`

try {
    await Utils.execAsync([
        "bun", "build", outdir,
        "--outfile", main,
        "--external", "resource://*",
        "--external", "gi://*",
        "--external", "file://*",
    ])
} catch (error) {
    console.error(error)
    App.quit()
}

export default check() ? (await import(`file://${main}`)).default : mismatch()
