const express = require('express');
const router = express.Router();
const {postComment, editComment, likeComment, deleteComment, getComments} = require('../controllers/comment')
const {verify} = require('../middleware/verify')

router.post('/post-comment', verify, postComment)
router.put('/edit-comment/:id', editComment)
router.patch('/comments/like/:id', likeComment)
router.delete('/comments/delete/:id', deleteComment)
router.get('/comments/get/:postId', getComments)

module.exports = router;