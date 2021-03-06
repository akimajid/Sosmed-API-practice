const router = require("express").Router()
const { Post, User, Like } = require("../lib/sequelize")
const { Op } = require("sequelize")
const fileUploader = require("../lib/uploader")
const { authorizedLoggedInUser, authorizeUserWithRole } = require("../middlewares/authMiddleware")

router.get("/", authorizedLoggedInUser,authorizeUserWithRole(["admin"]), async (req, res) => {
  try {
    const { _limit = 30, _page = 1 } = req.query

    delete req.query._limit
    delete req.query._page

    const findPosts = await Post.findAndCountAll({
      where: {
        ...req.query
      },
      limit: _limit ? parseInt(_limit) : undefined,
      offset: (_page - 1) * _limit,
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"]
          }
        }
      ],
    })

    return res.status(200).json({
      message: "Find posts",
      result: findPosts
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error"
    })
  }
})

router.post("/",
authorizedLoggedInUser, 
fileUploader({
  destinationFolder: "posts",
  fileType: "image",
  prefix: "POST"
}).single("post_image_file"), 
async (req, res) => {
  try {
    const { caption, location } = req.body;

    const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN
    const filePath = "post_images"
    const { fileName } = req.file

    const newPost = await Post.create({
      image_url: `${uploadFileDomain}/${filePath}/${fileName}`,
      caption,
      location,
      user_id: req.token.id
    })

    return res.status(201).json({
      message: "Post created",
      result: newPost
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error"
    })
  }
})

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPost = await Post.update(
      {
        ...req.body
      },
      {
        where: {
          id
        }
      }
    )

    return res.status(201).json({
      message: "Updated post",
      result: updatedPost
    })
  } catch (error) {
    console.log(err)
    return res.status(500).json({
      message: "Server error"
    })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.destroy({
      where: {
        id
      }
    })

    return res.status(201).json({
      message: "Deleted post",
      result: deletedPost
    })
  } catch (error) {
    console.log(err)
    return res.status(500).json({
      message: "Server error"
    })
  }
})

router.get("/:id/likes", async (req, res) => {
  try {
    const { id } = req.params
    const postLikes = await Like.findAll({
      where: {
        PostId: id
      },
      include: User
    })

    return res.status(200).json({
      message: "Fetch likes",
      result: postLikes
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error"
    })
  }
})

router.post("/:postId/likes/:userId", async (req, res) => {
  try {
    const { userId, postId } = req.params

    const [ newPost, didCreatePost ] = await Like.findOrCreate({
      where: {
        post_id: postId,
        user_id: userId
      },
      defaults: {
        ...req.body
      }
    })

    if (!didCreatePost) {
      return res.status(400).json({
        message: "User already liked post"
      })
    }

    await Post.increment(
      { like_count: 1 },
      {
        where: {
          id: postId
        }
      }
    )

    return res.status(200).json({
      message: "Liked post"
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server error"
    })
  }
})

module.exports = router