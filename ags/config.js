const main = "/tmp/ags/main.js"
const entry = `${App.configDir}/main.ts`

const v = {
    ags: pkg.version.split(".").map(Number),
    expect: [1, 8, 0],
}

try {
    await Utils.execAsync([
        "bun", "build", entry,
        "--outfile", main,
        "--external", "resource://*",
        "--external", "gi://*",
        "--external", "file://*",
    ])
    if (v.ags[1] < v.expect[1] || v.ags[2] < v.expect[2]) {
        print(`my config needs at least v${v.expect.join(".")}, yours is v${v.ags.join(".")}`)
        App.quit()
    }
    await import(`file://${main}`)
} catch (error) {
    console.error(error)
    App.quit()
}
