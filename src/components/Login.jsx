const Login = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => {
  return (
    <>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <div>
          username
          <input
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default Login;
