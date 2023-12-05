import axios from 'axios';
import {useEffect, useState} from "react";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [userIdToUpdate, setUserIdToUpdate] = useState('');
    const [updatedUserName, setUpdatedUserName] = useState('');
    const [updatedUserEmail, setUpdatedUserEmail] = useState('');
    const [updatedUserPassword, setUpdatedUserPassword] = useState('');

    const [posts, setPosts] = useState([]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostDesc, setNewPostDesc] = useState('');
    const [newPostImg, setNewPostImg] = useState('');
    const [newPostCat, setNewPostCat] = useState('');
    const [postIdToUpdate, setPostIdToUpdate] = useState('');
    const [updatedPostTitle, setUpdatedPostTitle] = useState('');
    const [updatedPostDesc, setUpdatedPostDesc] = useState('');
    const [updatedPostImg, setUpdatedPostImg] = useState('');
    const [updatedPostCat, setUpdatedPostCat] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8800/api/users')
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error('Ошибка получения списка пользователей:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8800/api/posts')
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error('Ошибка получения списка постов:', error);
            });
    }, []);

    const addPost = () => {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('access_token'));

        if (tokenCookie) {
            try {
                const token = tokenCookie.split('=')[1];

                axios.post('http://localhost:8800/api/posts', {
                        title: newPostTitle,
                        desc: newPostDesc,
                        img: newPostImg,
                        cat: newPostCat,
                        // Дополнительные поля в соответствии с моделью
                    },
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}` // Передача JWT-токена в заголовке запроса
                        }
                    }
                )
                    .then((response) => {
                        setPosts([...posts, response.data]);
                        setNewPostTitle('');
                        setNewPostDesc('');
                        setNewPostImg('');
                        setNewPostCat('');
                        console.log('Пост успешно добавлен:', response.data);
                    })
                    .catch((error) => {
                        console.error('Ошибка при добавлении поста:', error);
                    });
            } catch (error) {
                console.error('Ошибка при получении токена из куки:', error);
            }
        } else {
            console.error('Токен не найден в куки');
            // Обработка ситуации, когда токен не найден в куки
        }
    };


    const deletePost = (id) => {
        axios.delete(`http://localhost:8800/api/posts/${id}`)
            .then(() => {
                const updatedPosts = posts.filter((post) => post._id !== id);
                setPosts(updatedPosts);
                console.log(`Пост с ID ${id} успешно удален`);
            })
            .catch((error) => {
                console.error(`Ошибка при удалении поста с ID ${id}:`, error);
            });
    };

    const updatePost = () => {
        axios.put(`http://localhost:8800/api/posts/${postIdToUpdate}`, {
            title: updatedPostTitle,
            desc: updatedPostDesc,
            img: updatedPostImg,
            cat: updatedPostCat,
            // Дополнительные поля для обновления в соответствии с моделью
        })
            .then((response) => {
                const updatedList = posts.map((post) => {
                    if (post._id === postIdToUpdate) {
                        return response.data;
                    }
                    return post;
                });
                setPosts(updatedList);
                // Очистка переменных состояния после успешного обновления
                console.log('Пост успешно обновлен:', response.data);
            })
            .catch((error) => {
                console.error('Ошибка при обновлении поста:', error);
            });
    };


    const addUser = () => {
        axios.post('http://localhost:8800/api/users', {
            username: newUserName,
            email: newUserEmail,
            password: newUserPassword,
        })
            .then((response) => {
                setUsers([...users, response.data]); // Добавление нового пользователя в текущий список
                // Очистка полей после успешного добавления
                setNewUserName('');
                setNewUserEmail('');
                setNewUserPassword('');
                console.log('Пользователь успешно добавлен:', response.data);
            })
            .catch((error) => {
                console.error('Ошибка при добавлении пользователя:', error);
            });
    };

    const deleteUser = (id) => {
        axios.delete(`http://localhost:8800/api/users/${id}`)
            .then(() => {
                const updatedUsers = users.filter((user) => user._id !== id);
                setUsers(updatedUsers);
                console.log(`Пользователь с ID ${id} успешно удален`);
            })
            .catch((error) => {
                console.error(`Ошибка при удалении пользователя с ID ${id}:`, error);
            });
    };


    const updateUser = () => {
        axios.put(`http://localhost:8800/api/users/${userIdToUpdate}`, {
            username: updatedUserName,
            email: updatedUserEmail,
            password: updatedUserPassword,
        })
            .then((response) => {
                // Обновление списка пользователей после успешного обновления
                const updatedList = users.map((user) => {
                    if (user.id === userIdToUpdate) {
                        return response.data;
                    }
                    return user;
                });
                setUsers(updatedList);
                // Очистка полей после успешного обновления
                setUserIdToUpdate('');
                setUpdatedUserName('');
                setUpdatedUserEmail('');
                setUpdatedUserPassword('');
                console.log('Пользователь успешно обновлен:', response.data);
            })
            .catch((error) => {
                console.error('Ошибка при обновлении пользователя:', error);
            });
    };

    return (
        <div>
            <h1>Админ-панель</h1>

            <h2>Добавить пользователя</h2>
            <input
                type="text"
                placeholder="Имя"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Пароль"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
            />
            <button onClick={addUser}>Добавить</button>

            <h2>Изменить пользователя</h2>
            <input
                type="text"
                placeholder="ID пользователя"
                value={userIdToUpdate}
                onChange={(e) => setUserIdToUpdate(e.target.value)}
            />
            <input
                type="text"
                placeholder="Новое имя"
                value={updatedUserName}
                onChange={(e) => setUpdatedUserName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Новый Email"
                value={updatedUserEmail}
                onChange={(e) => setUpdatedUserEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Новый пароль"
                value={updatedUserPassword}
                onChange={(e) => setUpdatedUserPassword(e.target.value)}
            />
            <button onClick={updateUser}>Изменить</button>

            <h2>Пользователи</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        ID: {user._id} - {user.username} - {user.email}
                        <button onClick={() => deleteUser(user._id)}>Удалить</button>
                    </li>
                ))}
            </ul>

            {/*<h2>Добавить пост</h2>*/}
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Заголовок"*/}
            {/*    value={newPostTitle}*/}
            {/*    onChange={(e) => setNewPostTitle(e.target.value)}*/}
            {/*/>*/}
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Описание"*/}
            {/*    value={newPostDesc}*/}
            {/*    onChange={(e) => setNewPostDesc(e.target.value)}*/}
            {/*/>*/}
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Ссылка на изображение"*/}
            {/*    value={newPostImg}*/}
            {/*    onChange={(e) => setNewPostImg(e.target.value)}*/}
            {/*/>*/}
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Категория"*/}
            {/*    value={newPostCat}*/}
            {/*    onChange={(e) => setNewPostCat(e.target.value)}*/}
            {/*/>*/}
            {/*<button onClick={addPost}>Добавить пост</button>*/}

            {/*<h2>Изменить пост</h2>*/}
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="ID поста"*/}
            {/*    value={postIdToUpdate}*/}
            {/*    onChange={(e) => setPostIdToUpdate(e.target.value)}*/}
            {/*/>*/}
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Новый заголовок"*/}
            {/*    value={updatedPostTitle}*/}
            {/*    onChange={(e) => setUpdatedPostTitle(e.target.value)}*/}
            {/*/>*/}
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Новое описание"*/}
            {/*    value={updatedPostDesc}*/}
            {/*    onChange={(e) => setUpdatedPostDesc(e.target.value)}*/}
            {/*/>*/}
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Новая ссылка на изображение"*/}
            {/*    value={updatedPostImg}*/}
            {/*    onChange={(e) => setUpdatedPostImg(e.target.value)}*/}
            {/*/>*/}
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Новая категория"*/}
            {/*    value={updatedPostCat}*/}
            {/*    onChange={(e) => setUpdatedPostCat(e.target.value)}*/}
            {/*/>*/}
            {/*<button onClick={updatePost}>Изменить пост</button>*/}

            {/*<h2>Посты</h2>*/}
            {/*<ul>*/}
            {/*    {posts.map((post) => (*/}
            {/*        <li key={post._id}>*/}
            {/*            ID: {post._id} - {post.title} - {post.desc}*/}
            {/*            <button onClick={() => deletePost(post._id)}>Удалить</button>*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}


        </div>
    );

};

export default AdminPanel;