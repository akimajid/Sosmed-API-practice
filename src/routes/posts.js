const { Post } = require("../lib/sequelize")
const { Op } = require("sequelize")

const router = require("express").Router()

router.get("/", async (req, res) => {
    try {
        const { _limit = 30, _page = 1 } = req.query

        delete req.query._limit
        delete req.query._page

        const findPosts = await Post.findAndCountAll({
            where: {
                ...req.query
            },
            limit: _limit ? parseInt(_limit) : undefined,
            offset: (_page - 1) * _limit
        })

        res.status(200).json({
            message: "All posts",
            result: findPosts
        })
    } catch (err) {
        res.status(500).json({
            message: "Server error"
        })
    }
})
router.post("/", async (req, res) => {
    try {
        const { image_url, caption, location } = req.body

        const newPost = await Post.create({
            image_url,
            caption,
            location
        })

        res.status(201).json({
            message: "Post created",
            result: newPost
        })

        Post
    } catch (err) {
        res.status(500).json({
            message: "Server error"
        })
    }
})
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params

        const updateData = await Post.update(
            {
                ...req.body
            },
            {
                where: {
                    id
                }
            }
        )

        res.status(200).json({
            message: "Post edited",
            result: updateData
        })
    } catch (err) {
        res.status(500).json({
            message: "Server error"
        })
    }
})
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params

        const deleteData = await Post.destroy(
            {
                where: {
                    id
                }
            }
        )

        res.status(200).json({
            message: "Post deleted",
            result: deleteData
        })
    } catch (err) {
        res.status(500).json({
            message: "Server error"
        })
    }
})

module.exports = router