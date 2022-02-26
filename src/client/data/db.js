import Dexie from 'dexie'

export const db = new Dexie('lunar')
db.version(1).stores({
    indicators: '[iso3+ind3],iso3,fullname,ind3,units,&*data',
    descriptions: '[iso3+ind3], iso3, ind3, profile'
})