const Router = require('express').Router
const fs = require('fs')
const lunarpost = require('./lunar-post')
const moment = require('moment')

function blogRouter() {
    const router = Router()

    router.get('/', async (req, res) => {
        let blogdata = []
        fs.readdirSync('./data/blog').forEach(file => {
            const path = './data/blog/' + file
            let pack = lunarpost.ReadPost(path)

            let dateSplit = file.split('.')
            let date      = moment(dateSplit[0], "MM-DD-YYYY")
            pack["date"] = date.format("MMMM Do YYYY")
            blogdata.push(pack)
        })

        for(let i = 0; i < blogdata.length; i++) {
            let blog = blogdata[i]
            let elements = blog["blogElements"]

            let summaryFound = false
            let summary = ""

            for(let x = 0; x < elements.length && summaryFound == false; x++) {
                let element = elements[x]
                let elementName = element["indicator"]

                if(elementName == "__PARAGRAPH") {
                    summary = element["content"].substring(0, 150) + "..."
                    summaryFound = true
                }
            }

            blog["summary"] = summary
            blog["blogElements"] = []
            blogdata[i] = blog
        }

        res.json(blogdata)
    })

    return router
}

exports.blogRouter = blogRouter