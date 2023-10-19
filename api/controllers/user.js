import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js'; // Подставьте путь к вашей модели User

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json('User not found!');
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export const addUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Проверка существования пользователя с таким же username или email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json('User already exists!');
        }

        const newUser = new User({
            username,
            email,
            password,
        });

        await newUser.save();
        return res.status(201).json('User has been created.');
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        // Удаление пользователя по ID
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json('User not found!');
        }
        return res.status(200).json('User has been deleted!');
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, password } = req.body;

        // Обновление информации о пользователе по ID
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, password },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json('User not found!');
        }
        return res.status(200).json('User has been updated.');
    } catch (error) {
        return res.status(500).send(error.message);
    }
};
