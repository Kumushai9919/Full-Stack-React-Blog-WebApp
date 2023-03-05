const express = require('express');
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddlewares");

router.post("/", validateToken, async (req, res) => {
    const { PostId } = req.body;
    const UserId = req.user.id;

    const found = await Likes.findOne({
        where: { PostId: PostId, UserId: UserId },
    });

    //if there isn't user or post that's already liked we create likes
    if (!found) {
        await Likes.create({ PostId: PostId, UserId: UserId })
        res.json({liked: true});
    } else { 
        //or if it's already liked => we unlike the post with destroy()
        await Likes.destroy({
            where: { PostId: PostId, UserId: UserId },
        });
        res.json({liked: false});
    }
   
})



module.exports = router;
