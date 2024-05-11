import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import loginServices from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginServices.login({ username, password });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage(exception.response.data.error);
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    }
  };

  const addNewBlog = async (e) => {
    e.preventDefault();
    const newBlog = {
      title,
      author,
      url,
    };
    try {
      const returnedBlog = await blogService.create(newBlog);
      setMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
      setMessageType("message");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
      setBlogs(blogs.concat(returnedBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    window.localStorage.clear();
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification type={messageType} message={message} />
        <Login
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div>
      <Notification type={messageType} message={message} />
      <h2>blogs</h2>
      <p>
        {user.name} logged-in <button onClick={logout}>log out</button>
      </p>
      <BlogForm
        title={title}
        author={author}
        url={url}
        setTitle={setTitle}
        setAuthor={setAuthor}
        setUrl={setUrl}
        addNewBlog={addNewBlog}
      />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
