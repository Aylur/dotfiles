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

const { default: config } = await import(`file://${main}`)
export default config
