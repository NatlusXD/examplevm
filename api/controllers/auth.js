import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
    if (existingUser) {
      return res.status(409).json('User already exists!');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });

    await newUser.save();
    return res.status(200).json('User has been created.');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json('User not found!');
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json('Wrong username or password!');
    }

    const token = jwt.sign({ id: user._id }, 'jwtkey');
    const { password, ...other } = user.toObject();

    res.cookie('access_token', token, {
      httpOnly: true,
    }).status(200).json(other);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const logout = (req, res) => {
  res.clearCookie('access_token', {
    sameSite: 'none',
    secure: true,
  }).status(200).json('User has been logged out.');
};
