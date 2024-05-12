import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/LoginForm";
import loginServices from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Toggle from "./components/Toggle";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    (async () => {
      const blogs = await blogService.getAll();
      blogs.sort((a, b) => {
        if (a.likes > b.likes) {
          return 1;
        }
        if (a.likes < b.likes) {
          return -1;
        }
        return 0;
      });
      setBlogs(blogs);
    })();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await loginServices.login(credentials);

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setMessage(exception.response.data.error);
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    }
  };

  const addNewBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog);
      blogFormRef.current.toggleVisibility();
      setMessage(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
      setMessageType("message");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
      setBlogs(blogs.concat(returnedBlog));
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  const blogForm = () => {
    return (
      <>
        <Toggle buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm addNewBlog={addNewBlog} />
        </Toggle>
      </>
    );
  };

  const updateBlog = async (blog, id) => {
    const updatedBlog = await blogService.update(blog, id);
    const updatedBlogs = blogs.map((blog) => {
      if (blog.id === updatedBlog.id) {
        return updatedBlog;
      }
      return blog;
    });
    setBlogs(updatedBlogs);
  };

  const deleteBlog = async (blog, id) => {
    try {
      await blogService.deleteBlog(id);
      const updatedBlogs = blogs.filter((blog) => blog.id != id);
      setBlogs(updatedBlogs);
      setMessage(`Deleted blog ${blog.title} by ${blog.author}`);
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    } catch (exception) {
      console.log(exception);
      setMessage(`Deleted ${blog.name} by ${blog.author}`);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification type={messageType} message={message} />
        <Login handleLogin={handleLogin} />
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
      {blogForm()}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;
