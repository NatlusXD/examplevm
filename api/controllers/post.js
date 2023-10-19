import jwt from 'jsonwebtoken';
import Post from '../models/PostModel.js'; // Подставьте путь к вашей модели Post

export const getPosts = async (req, res) => {
  try {
    const cat = req.query.cat;
    const query = cat ? { cat } : {};
    const posts = await Post.find(query);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json('Post not found!');
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const addPost = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json('Not authenticated! Invalid Token');
    }
    const userInfo = jwt.verify(token, 'jwtkey');
    const { title, desc, img, cat, date } = req.body;
    const newPost = new Post({
      title,
      desc,
      img,
      cat,
      date,
      uid: userInfo.id,
    });
    await newPost.save();
    return res.status(201).json('Post has been created.');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json('Not authenticated!');
    }
    const userInfo = jwt.verify(token, 'jwtkey');
    const postId = req.params.id;
    const deletedPost = await Post.findOneAndDelete({ _id: postId, uid: userInfo.id });
    if (!deletedPost) {
      return res.status(403).json('You can delete only your post!');
    }
    return res.status(200).json('Post has been deleted!');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const updatePost = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json('Not authenticated!');
    }
    const userInfo = jwt.verify(token, 'jwtkey');
    const postId = req.params.id;
    const { title, desc, img, cat } = req.body;
    const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, uid: userInfo.id },
        { title, desc, img, cat },
        { new: true }
    );
    if (!updatedPost) {
      return res.status(403).json('You can update only your post!');
    }
    return res.status(200).json('Post has been updated.');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
