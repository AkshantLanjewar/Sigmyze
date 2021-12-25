import { db } from './db'

class Indicator {
    static AddIndicator(iso3, fullname, ind3, indicator, data) {
        db.indicators.put({
            iso3: iso3,
            fullname: fullname,
            ind3: ind3,
            indicator: indicator,
            data: data
        })
    }

    static FindIndicator(iso3, ind3) {
        return db.indicators.where({
            iso3: iso3,
            ind3: ind3
        }).toArray()
    }
}

export default Indicator