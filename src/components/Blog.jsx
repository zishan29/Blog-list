import { useState } from "react";

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const [visible, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility(!visible);
  };

  const handleLikes = (e) => {
    e.preventDefault();
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    updateBlog(updatedBlog, updatedBlog.id);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("loggedNoteappUser"));
    console.log(user.name, blog);
    if (!user) {
      alert("Please log in to delete blogs");
      return;
    }
    if (user.name !== blog.user.name) {
      alert("You can only delete blogs created by you");
      return;
    }
    if (user.name === blog.user.name) {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        deleteBlog(blog, blog.id);
      }
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && <div>{blog.url}</div>}
      {visible && (
        <div>
          likes: {blog.likes} <button onClick={handleLikes}>like</button>
        </div>
      )}
      {visible && <div>{blog.user.name}</div>}
      {visible && <button onClick={handleDelete}>remove</button>}
    </div>
  );
};

export default Blog;
