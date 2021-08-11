const Router = require('express').Router
const fs = require('fs')
const lunarpost = require('./lunar-post')

function blogRouter() {
    const router = Router()

    router.get('/', async (req, res) => {
        let blogdata = []
        fs.readdirSync('./data/blog').forEach(file => {
            const path = './data/blog/' + file
            let pack = lunarpost.ReadPost(path)
            blogdata.push(pack)
        })

        res.json(blogdata)
    })

    return router
}

exports.blogRouter = blogRouter