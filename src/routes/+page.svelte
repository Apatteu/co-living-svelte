<script>
  let email = '';
  let password = '';
  let passwordError = '';

  function handleSubmit() {
    if (!email || !password) {
      passwordError = "Both fields are required";
    } else {
      passwordError = '';
      console.log({ email, password });
    }
  }
</script>

<style>

  .container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 80vh;
    padding: 2rem;
    box-sizing: border-box;
  }

  .left-side {
    width: 45%;
    text-align: left;
    padding-right: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .left-side h2 {
    font-size: 5.5rem;
    color: #333;
    margin-bottom: 1rem;
  }

  .left-side p {
    font-size: 1rem;
    color: #555;
  }

  .create-account {
    font-family: 'Poppins', sans-serif;
    text-align: center;
    padding: 0.6rem;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 390px;
    height: 450px;
    max-width: 100%;
    margin: 0 auto;
    flex-shrink: 0;
  }

  .create-account h2 {
    font-size: 1.5rem;
    color: #333;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    width: 80%;
    max-width: 240px;
    margin: 2rem auto;
    text-align: left;
    position: relative;
  }

  .form-group label {
    font-size: 0.8rem;
    color: #141414;
    margin-bottom: 0.2rem;
    font-weight: 500;
  }

  .form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.85rem;
    outline: none;
    transition: border-color 0.3s ease;
    box-shadow: none;
  }

  .form-group input:focus {
    border: 1px solid #ff6a00;
    outline: none;
    box-shadow: none;
  }

  .forgot-password {
    font-size: 0.85rem;
    color: #666;
    position: absolute;
    right: 0;
    top: 120%;
    transform: translateY(-50%);
  }

  .forgot-password a {
    color: #ff6a00;
    text-decoration: none;
  }

  .forgot-password a:hover {
    text-decoration: underline;
  }

  .create-account button {
    width: 80%;
    max-width: 120px;
    padding: 0.5rem;
    margin-top: 1rem;
    border: none;
    border-radius: 6px;
    background-color: #ff6a00;
    color: white;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .create-account button:hover {
    background-color: #e65b00;
  }

  .links {
    margin-top: 2rem;
    font-size: 0.85rem;
    color: #666;
  }

  .links a {
    color: #ff6a00;
    text-decoration: none;
  }

  .links a:hover {
    text-decoration: underline;
  }

  .error-message {
    color: #ff6a00;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }
</style>

<div class="container">
  <div class="left-side">
    <h2>Apateu</h2>
    <p>
      Find your ideal co-living space effortlessly. With Apateu, discover
      shared apartments, manage unit partitions, and connect with the perfect
      housemates all in one place. Start your journey toward better shared
      living today!
    </p>
  </div>

  <div class="create-account">
    <h2>Login</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          bind:value={email}
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          bind:value={password}
          required
        />
        <p class="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </div>

      {#if passwordError}
        <div class="error-message">{passwordError}</div>
      {/if}

      <button type="submit">Login</button>
    </form>

    <div class="links">
      <p>Don't have an account? <a href="./signup">Register</a></p>
    </div>
  </div>
</div>