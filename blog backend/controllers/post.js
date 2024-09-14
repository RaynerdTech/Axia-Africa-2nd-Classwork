const postModel = require('../models/postSchema');


const makePost = async (req, res) => {
   const {creatorId, ...others} = req.body; 
   const {id} = req.user;
   const newPost = new postModel({...others, creatorId: id});
   try {
    await newPost.save();
    res.json({message: "Post successfully created"})
   }
   catch (error) {
    res.json({error: "cannot create post"})
    console.log(error);
   }
}


const getAllPost = async (req, res) => {
  try {
    const allPost = await postModel.find()
      .populate({ path: "creatorId", select: "userName email gender" })
      .populate({ path: "comment", select: "text commentorId" }); 

    res.json(allPost);
  } catch (error) {
    res.status(500).json({ error: "Cannot get posts" });
  }
}



//update post 
const updatePost = async (req, res) => {
  const { id, creatorId, likes, ...others } = req.body;
  
  try {
    const ownerPost = await postModel.findById(id);  

    if (!ownerPost) {
      return res.json({ error: "Post not found" });
    }

    if (ownerPost.creatorId.toString() !== creatorId) {
      return res.json({ error: "You can only update your own post" });
    }

    await postModel.findByIdAndUpdate(id, { ...others }, { new: true });
    res.json({ message: "Post updated" });

  } catch (error) {
    res.json({ error: "Cannot update post" });
  }
};


const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const getPost = await postModel.findById(id)
      .populate({ path: "creatorId", select: "userName email gender" })
      .populate({ path: "comment", select: "text commentorId" }); // Fetch associated comments

    res.json(getPost);
  } catch (error) {
    res.status(500).json({ error: "Cannot get post" });
  }
}


const deletePost = async (req, res) => {
    const {id} = req.params;
    try{
        await postModel.findByIdAndDelete(id);
        res.json("post deleted")
    } catch (error) {
        res.status(500).json("could not delete post");
    }
}  


//add like feature 

const likePost = async (req, res) => {
  const { id, name } = req.body; // Assuming you send `id` and `name` in the request body

  try {
    // Fetch the post from the database using its ID
    const thePost = await postModel.findById(id);

    if (!thePost) {
      return res.json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const gottenLikes = thePost.likes;
    const checkUserInArray = gottenLikes.includes(name);

    if (!checkUserInArray) {
      // If the user hasn't liked the post, add their name to the likes array
      gottenLikes.push(name);
    } else {
      // If the user has already liked the post, remove their name from the likes array
      const index = gottenLikes.indexOf(name);
      gottenLikes.splice(index, 1); // Unlike (remove user from likes)
    }

    // Update the post with the modified likes array
    thePost.likes = gottenLikes;
    await thePost.save(); // Save the updated post back to the database

    res.json({ message: "Post like status updated", post: thePost }); // Respond with the updated post

  } catch (error) {
    res.json({ error: "Error processing like/unlike" });
  }
};




module.exports = {makePost, getAllPost, getPost, deletePost, updatePost, likePost};




