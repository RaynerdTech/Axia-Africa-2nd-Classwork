const express = require('express');
const router = express.Router();
const {makePost, getAllPost, getPost, deletePost, updatePost, likePost} = require('../controllers/post')
const {verify} = require('../middleware/verify')

router.post('/new-post', verify, makePost);
router.get('/allpost', getAllPost);
router.get('/getpost/:id', getPost);
router.put('/editpost/:id', updatePost);
router.delete('/deletepost/:id', deletePost);
router.post('/postlike', likePost);



module.exports = router;          