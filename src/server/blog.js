const Router = require('express').Router

function blogRouter() {
    const router = Router()

    router.get('/', async (req, res) => {
        res.json([])
    })

    return router
}

exports.blogRouter = blogRouter