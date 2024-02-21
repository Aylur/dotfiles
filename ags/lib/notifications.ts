import options from "options"
const notifs = await Service.import("notifications")

// TODO: consider adding this to upstream

const { blacklist } = options.notifications

export default function init() {
    const notify = notifs.constructor.prototype.Notify.bind(notifs)
    notifs.constructor.prototype.Notify = function(appName: string, ...rest: unknown[]) {
        if (blacklist.value.includes(appName))
            return Number.MAX_SAFE_INTEGER

        return notify(appName, ...rest)
    }
}
