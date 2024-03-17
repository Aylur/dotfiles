const main = "/tmp/ags/greeter.js"
const entry = `${App.configDir}/greeter/greeter.ts`

try {
    await Utils.execAsync([
        "bun", "build", entry,
        "--outfile", main,
        "--external", "resource://*",
        "--external", "gi://*",
        "--external", "file://*",
    ])
    await import(`file://${main}`)
} catch (error) {
    console.error(error)
    App.quit()
}

export { }
