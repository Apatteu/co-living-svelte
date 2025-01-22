<script lang="ts">
	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let phone = '';
	let role = '';
	let passwordError = '';
	let phoneError = '';

	function handleSubmit() {
		if (password !== confirmPassword) {
			passwordError = "Passwords do not match";
		} else {
			passwordError = '';
			if (!/^\d{11}$/.test(phone)) {
				phoneError = "Please enter a valid Philippine phone number (11 digits, starting with 09)";
			} else {
				phoneError = '';
				console.log({ role, username, email, password, confirmPassword, phone });
			}
		}
	}

	function handlePhoneInput(event: Event) {
		const target = event.target as HTMLInputElement;
		phone = target.value.replace(/\D/g, '');
	}
</script>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		background-color: #DBDBDB;
	}

	.create-account {
		text-align: center;
		padding: 0.6rem;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.8);
		box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
		width: 410px;
		max-width: 100%;
		margin: 0 auto;
		margin-top: -17px;
		position: relative;
	}

	.create-account h2 {
		margin-bottom: 0.8rem;
		color: #333;
		font-size: 1.3rem;
		font-weight: bold;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		width: 80%;
		max-width: 240px;
		margin: 0.5rem auto;
		text-align: left;
	}

	.form-group label {
		font-size: 0.8rem;
		color: #555;
		margin-bottom: 0.2rem;
		font-weight: 500;
	}

	.form-group input,
	.form-group select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 0.85rem;
		outline: none;
		box-shadow: none;
	}

	.form-group input:focus,
	.form-group select:focus {
		border-color: #ff6a00;
		outline: none;
		box-shadow: none;
	}

	.error-message {
		color: #ff6a00;
		font-size: 0.85rem;
		margin-top: 0.5rem;
	}

	.action-buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90%;
		max-width: 300px;
		margin: 1rem auto 0;
	}

	.action-button {
		background-color: #ff6a00;
		color: #fff;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: bold;
		cursor: pointer;
		margin: 0 10px;
		text-decoration: none;
		text-align: center;
	}

	.action-button:hover {
		background-color: #e65a00;
	}

	.action-button.close {
		background-color: #a7a7a7;
		color: #fffbfb;
	}

	.action-button.close:hover {
		background-color: #858585;
	}

	@media (max-width: 768px) {
		.create-account {
			width: 90%;
			margin-top: 0;
		}

		.form-group {
			width: 100%;
		}

		.create-account h2 {
			font-size: 1.1rem;
		}

		.action-buttons {
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.create-account {
			width: 95%;
		}
	}
</style>

<div class="create-account">
	<h2>Create Your Account</h2>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="role">Role</label>
			<select id="role" bind:value={role} required>
				<option value="" disabled selected>Select your role</option>
				<option value="Tenant">Tenant</option>
				<option value="Landlord">Landlord</option>
			</select>
		</div>

		<div class="form-group">
			<label for="username">Username</label>
			<input
				id="username"
				type="text"
				placeholder="Enter your username"
				bind:value={username}
				required
			/>
		</div>

		<div class="form-group">
			<label for="email">Email Address</label>
			<input
				id="email"
				type="email"
				placeholder="example@gmail.com"
				bind:value={email}
				required
			/>
		</div>

		<div class="form-group">
			<label for="phone">Phone Number</label>
			<input
				id="phone"
				type="tel"
				inputmode="numeric"
				placeholder="09171234567"
				bind:value={phone}
				on:input={handlePhoneInput}
				required
			/>
			{#if phoneError}
				<div class="error-message">{phoneError}</div>
			{/if}
		</div>

		<div class="form-group">
			<label for="password">Password</label>
			<input
				id="password"
				type="password"
				placeholder="**********"
				bind:value={password}
				required
			/>
		</div>

		<div class="form-group">
			<label for="confirmPassword">Confirm Password</label>
			<input
				id="confirmPassword"
				type="password"
				placeholder="**********"
				bind:value={confirmPassword}
				required
			/>
		</div>

		{#if passwordError}
			<div class="error-message">{passwordError}</div>
		{/if}

		<div class="action-buttons">
			<a href="./" class="action-button close">Close</a>
			<button class="action-button" type="submit">Submit</button>
		</div>
	</form>
</div>