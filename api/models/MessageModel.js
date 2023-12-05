import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel', // Ссылка на модель пользователя, если нужно
    },
}, { timestamps: true }); // Добавляем поля createdAt и updatedAt

const Message = mongoose.model('chat_messages', messageSchema);

export default Message;
