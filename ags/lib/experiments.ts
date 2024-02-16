// these are functionalities that I might include in ags

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { Binding } from "types/service"
import { Variable } from "resource:///com/github/Aylur/ags/variable.js"
import { App } from "resource:///com/github/Aylur/ags/app.js"
import GObject from "gi://GObject?version=2.0"

type GObj = GObject.Object | App

export function watch<T>(init: T, objs: Array<[GObj, signal?: string]>, signal: string, callback: (v: Variable<T>) => T): Binding<Variable<T>, any, T>
export function watch<T>(init: T, obj: GObj, signal: string, callback: (v: Variable<T>) => T): Binding<Variable<T>, any, T>
export function watch<T>(init: T, obj: GObj, callback: (v: Variable<T>) => T): Binding<Variable<T>, any, T>
export function watch<T>(
    init: T,
    objs: GObj | Array<[GObj, signal?: string]>,
    sigOrFn: string | ((v: Variable<T>) => T),
    callback?: (v: Variable<T>) => T,
) {
    const v = new Variable(init)
    const fn = typeof sigOrFn === "function" ? sigOrFn : callback ?? (() => v.value)
    if (Array.isArray(objs)) {
        objs.map(([o, s = "changed"]) => [o, o.connect(s, () => fn(v))] as const)
        return v.bind()
    }

    const signal = typeof sigOrFn === "string" ? sigOrFn : "changed"
    objs.connect(signal, () => fn(v))
    return v.bind()
}
