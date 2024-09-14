const Comment = require('../models/commentSchema');
const postModel = require('../models/postSchema');

const postComment = async (req, res) => {
  const {text, postId} = req.body;
  const {id} = req.user;
  try {
    const existingComment = await Comment.findOne({ text, /*author,*/ postId })
    if(existingComment) {
        return res.json({message: "Ops! You've already said that"})
      }
    const newComment = new Comment({text, commentorId:id, postId});
    const saveComment = await newComment.save();
    //modifying postmodel to include comment
    await postModel.findByIdAndUpdate(postId, {
      $push:{comment:saveComment.id} 
    })
    res.json({message: "commented"})
  }
  catch (error) {
    res.json({message: error})
  }
}



  const editComment = async (req, res) => {
    const { id } = req.params;
    const { text, ...others } = req.body;
  
    try {
      const checkID = await Comment.findById(id);
      if (!checkID) {
        return res.json({ message: "Invalid ID" });
      }
  
      if (!text) {
        return res.json({ message: "Comment cannot be empty" });
      }
  
      const updateComment = await Comment.findByIdAndUpdate(
        id,
        { text, ...others },
        { new: true } 
      );
  
      res.json({ message: "Comment updated successfully", comment: updateComment });
    } catch (error) {
      res.json({ error: "Could not edit comment" });
    }
  };
  

  
  //like or unlike comment 
  const likeComment = async (req, res) => {
    const { id } = req.params; // Extract comment ID from URL parameters
    const { userName } = req.body; // Extract user name from the request body
    try {
      const comment = await Comment.findById(id); // Fetch the comment from the database
      if (!comment) {
        return res.json({ message: 'Comment not found' });
      }
  
      const likesArray = comment.likes; // Get the current likes array
      const isLiked = likesArray.includes(userName); // Check if the user already liked the comment
  
      if (!isLiked) {
        likesArray.push(userName); // Add the user to likes if not already liked
      } else {
        const index = likesArray.indexOf(userName); // Find the index of the user in likes
        likesArray.splice(index, 1); // Remove the user from likes
      }
  
      comment.likes = likesArray; // Update the comment's likes
      await comment.save(); // Save the updated comment
      res.json({ message: 'Like status updated', comment });
    } catch (error) {
      res.json({ error: 'Error updating like status' });
    }
  };


  //delete comment 
  const deleteComment = async (req, res) => {
    const { id } = req.params; // Extract comment ID from URL parameters
    try {
      const deletedComment = await Comment.findByIdAndDelete(id); // Find and delete the comment
      if (!deletedComment) {
        return res.json({ message: 'Comment not found' });
      }
      res.json({ message: 'Comment deleted successfully', comment: deletedComment });
    } catch (error) {
      res.json({ error: 'Error deleting comment' });
    }
  } 


  // Get all comments for a specific post
  const getComments = async (req, res) => {
    const { postId } = req.params; 
    try {
      const comments = await Comment.find({ postId }); 
      res.json({ comments });
    } catch (error) {
      res.json({ error: 'Error fetching comments' });
    }
  }

  module.exports = {postComment, editComment, likeComment, deleteComment, getComments};

