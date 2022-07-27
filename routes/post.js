const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get("/allpost",requireLogin,(req,res)=>{
  Post.find()
  .populate("postedBy","_id name")
  .populate("comments.postedBy","_id name")
  .then(allposts=>{
    res.json({allposts})
  })
  .catch(err=>{
    console.log(err);
  })
})

router.get("/getfrndspost",requireLogin,(req,res)=>{
  Post.find({postedBy:{$in:req.user.following}})
  .populate("postedBy","_id name")
  .populate("comments.postedBy","_id name")
  .then(getfrndsposts=>{
    res.json({getfrndsposts})
  })
  .catch(err=>{
    console.log(err);
  })
})

router.post("/createpost",requireLogin,(req,res)=>{
  const {title,body,url} = req.body
  console.log("req");
  console.log(title,body,url);
  if(!title || !body || !url){
    console.log("required");
    return res.status(422).json({error:"Please add all the fields"})
  }
  req.user.password = undefined
  const newpost = new Post({
    title,
    body,
    photo:url,
    postedBy:req.user
  })
  newpost.save()
  .then(result=>{
    res.json({newpost:result})
  })
  .catch(err=>{
    console.log(err);
  })
})



router.get("/myposts",requireLogin,(req,res)=>{
  Post.find({postedBy:req.user._id})
  .populate("postedBy","_id name")
  .then(myposts=>{
    res.json({myposts})
  })
  .catch(err=>{
    console.log(err);
  })
})

router.put("/likepost",requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    } else{
      res.json(result)
    }
  })
})

router.put("/unlikepost",requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    } else{
      res.json(result)
    }
  })
})

router.put("/commentpost",requireLogin,(req,res)=>{
  const comment = {
    text:req.body.text,
    postedBy:req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{comments:comment}
  },{
    new:true
  })
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    } else{
      res.json(result)
    }
  })
})

router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((err,post)=>{
    if(err || !post){
      return res.status(422).json({error:err})
    }
    if(post.postedBy._id.toString() === req.user._id.toString()){
      post.remove()
      .then(result=>{
        res.json(result)
      }).catch(err=>{
        console.log(err);
      })
    }
  })
})

// router.delete("/deletecomment/:commentId",requireLogin,(req,res)=>{
//   Post.findOne({_id:req.params.commentId})
//   .populate("postedBy","_id")
//   .exec((err,comment)=>{
//     if(err || !comment){
//       return res.status(422).json({error:err})
//     }
//     if(comment.comments._id.toString() === req.user._id.toString()){
//       post.remove()
//       .then(result=>{
//         res.json(result)
//       }).catch(err=>{
//         console.log(err);
//       })
//     }
//   })
// })
//







module.exports = router
