<script>
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let email = '';
	let password = '';
	let passwordError = '';
	let serverError = '';

	async function handleSubmit() {
		if (!email || !password) {
			passwordError = 'Both fields are required';
			toast.error('Fields Required', { description: 'Please ensure to input email and password.' });

			return;
		}

		passwordError = '';
		serverError = '';

		try {
			const response = await fetch('http://localhost:3000/api/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (!response.ok) {
				const errorData = await response.json();
				serverError = errorData.message || 'Login failed';
				toast.error('Login Failed', {
					description: 'Check if there is error in your credentials.'
				});

				return;
			}

			const data = await response.json();
			toast.success('Login Successful!', {
				description: `Welcome ${data.user.profile.firstName}`
			});
			localStorage.setItem('co-living-token', data.token);
			if (data.user.role === 'TENANT') {
				window.location.href = '/tenant';
			} else if (data.user.role === 'LANDLORD') {
				window.location.href = '/landlord';
			}
		} catch (error) {
			console.error('Error connecting to the backend:', error);
			serverError = 'Failed to connect to the server';
		}
	}
</script>

<div class="container">
	<div class="left-side">
		<h2>Apateu</h2>
		<p>
			Find your ideal co-living space effortlessly. With Apateu, discover shared apartments, manage
			unit partitions, and connect with the perfect housemates all in one place. Start your journey
			toward better shared living today!
		</p>
	</div>

	<div class="create-account">
		<h2>Login</h2>
		<form on:submit|preventDefault={handleSubmit}>
			<div class="form-group">
				<label for="email">Email Address</label>
				<input id="email" type="email" placeholder="Enter your email" bind:value={email} required />
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
				<!-- <p class="forgot-password">
					<a href="/forgot-password">Forgot Password?</a>
				</p> -->
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

<style>
	.container {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		height: 80vh;
		padding: 2rem;
		box-sizing: border-box;
		flex-wrap: wrap;
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
		position: relative;
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

	/* Media Queries for Responsiveness */

	/* Tablet screens (portrait) and smaller */
	@media screen and (max-width: 768px) {
		.container {
			flex-direction: column; /* Stack the left side and create account form */
			align-items: center;
			height: auto;
			padding: 1rem;
		}

		.left-side {
			width: 100%;
			padding-right: 0;
			text-align: center;
			margin-bottom: 2rem;
		}

		.left-side h2 {
			font-size: 3rem; /* Smaller font size for mobile */
		}

		.create-account {
			width: 90%; /* Take up more space on small screens */
			max-width: 400px;
			height: auto;
			padding: 2rem;
		}

		.form-group {
			width: 100%;
			max-width: 100%;
			margin: 1.5rem 0; /* Adjust margin for small screens */
		}

		.create-account h2 {
			font-size: 1.25rem; /* Slightly smaller heading */
		}

		.forgot-password {
			font-size: 0.8rem; /* Slightly smaller font for the link */
		}

		.create-account button {
			width: 100%;
		}

		.links {
			font-size: 0.8rem;
		}
	}

	/* Mobile screens (portrait) */
	@media screen and (max-width: 480px) {
		.container {
			padding: 1rem;
		}

		.left-side h2 {
			font-size: 2.5rem;
		}

		.create-account {
			width: 100%;
			max-width: 100%;
			padding: 1.5rem;
		}

		.form-group {
			margin: 1.5rem 0;
		}

		.create-account button {
			width: 100%;
		}

		.create-account h2 {
			font-size: 1.2rem;
		}

		.forgot-password {
			font-size: 0.75rem;
		}

		.links {
			font-size: 0.75rem;
		}
	}
</style>
