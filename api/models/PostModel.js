import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: String,
    desc: String,
    img: String,
    cat: String,
    date: { type: Date, default: Date.now },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Подставьте ссылку на модель пользователя, если нужно
    },
    // Другие поля, если необходимо
});

const Post = mongoose.model('posts', postSchema);

export default Post;
