// these are functionalities that I might include in ags

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { Binding } from "types/service"
import { Variable } from "resource:///com/github/Aylur/ags/variable.js"
import { App } from "resource:///com/github/Aylur/ags/app.js"
import GObject from "gi://GObject?version=2.0"

type GObj = GObject.Object | App
type B<T> = Binding<Variable<T>, any, T>

export function watch<T>(init: T, objs: Array<GObj | [GObj, signal?: string]>, callback: () => T): B<T>
export function watch<T>(init: T, obj: GObj, signal: string, callback: () => T): B<T>
export function watch<T>(init: T, obj: GObj, callback: () => T): B<T>
export function watch<T>(
    init: T,
    objs: GObj | Array<GObj | [GObj, signal?: string]>,
    sigOrFn: string | (() => T),
    callback?: () => T,
) {
    const v = new Variable(init)
    const f = typeof sigOrFn === "function" ? sigOrFn : callback ?? (() => v.value)
    const set = () => v.value = f()

    if (Array.isArray(objs)) {
        // multiple objects
        for (const obj of objs) {
            if (Array.isArray(obj)) {
                // obj signal pair
                const [o, s = "changed"] = obj
                o.connect(s, set)
            } else {
                // obj on changed
                obj.connect("changed", set)
            }
        }
    } else {
        // watch single object
        const signal = typeof sigOrFn === "string" ? sigOrFn : "changed"
        objs.connect(signal, set)
    }

    return v.bind()
}
