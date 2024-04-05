import options from "options"

const { interval, key, cities, unit } = options.datemenu.weather

class Weather extends Service {
    static {
        Service.register(this, {}, {
            "forecasts": ["jsobject"],
        })
    }

    #forecasts: Forecast[] = []
    get forecasts() { return this.#forecasts }

    async #fetch(placeid: number) {
        const url = "https://api.openweathermap.org/data/2.5/forecast"
        const res = await Utils.fetch(url, {
            params: {
                id: placeid,
                appid: key.value,
                untis: unit.value,
            },
        })
        return await res.json()
    }

    constructor() {
        super()
        if (!key.value)
            return this

        Utils.interval(interval.value, () => {
            Promise.all(cities.value.map(this.#fetch)).then(forecasts => {
                this.#forecasts = forecasts as Forecast[]
                this.changed("forecasts")
            })
        })
    }
}

export default new Weather

type Forecast = {
    city: {
        name: string,
    }
    list: Array<{
        dt: number
        main: {
            temp: number
            feels_like: number
        },
        weather: Array<{
            main: string,
            description: string,
            icon: string,
        }>
    }>
}
