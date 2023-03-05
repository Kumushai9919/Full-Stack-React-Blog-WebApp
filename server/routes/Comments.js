const express = require('express');
const router = express.Router();
const { Comments } = require("../models");
const {validateToken} = require("../middlewares/AuthMiddlewares");

router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({ where: { Postid: postId } });
    res.json(comments);
});

//validateToken-middlewares, as a func runs before the request checks if it's valid and if it's true it's moving forward to request 
router.post("/", validateToken, async (req, res) => {
    const comment = req.body; //getting comment object
    const username = req.user.username;
    comment.username = username; //now when we pass 'comment' object it chould create a comment in db with the username who logged in

    await Comments.create(comment); //create comment in Comments model

    res.json(comment);  //to display
});

//in order to delete we need to kknow the id of the comment
router.delete("/:commentId", validateToken, async (req, res) => {
    try {
        const commentId = req.params.commentId; 
        
        console.log("Deleting comment with ID:", commentId);
    
        await Comments.destroy({
          where: {
            id: commentId, 
          },
        });
    
        res.json("DELETED SUCCESSFULLY");
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
      }
  });
module.exports = router;
 // truncate: true