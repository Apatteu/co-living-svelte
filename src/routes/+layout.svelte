<script lang="ts">
	import { page } from '$app/stores';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	interface UserProfile {
		firstName: string;
		lastName: string;
	}

	interface UserData {
		id: string;
		email: string;
		role: 'LANDLORD' | 'TENANT';
		profile: UserProfile;
		isLandlord: boolean;
		isTenant: boolean;
	}

	let isMenuOpen = false;
	let userName = '';
	let userData: UserData | null = null;

	const navbar1Prefixes = ['/', '/about', '/signup', '/signin'];
	const navbar2Prefixes = ['/tenant', '/landlord'];

	$: isNavbar1 = navbar1Prefixes.some((prefix) => $page.url.pathname.startsWith(prefix));
	$: isNavbar2 = navbar2Prefixes.some((prefix) => $page.url.pathname.startsWith(prefix));

	const fetchUser = async () => {
		try {
			const token = localStorage.getItem('co-living-token');

			if (!token) {
				goto('/signin');
				return null;
			}

			const response = await fetch('http://localhost:3000/api/auth/check-role', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				goto('/signin');
				return null;
			}

			const data = await response.json();
			console.log(data);

			userData = data;
			userName = `${data.profile.firstName} ${data.profile.lastName}`;

			if (data.isLandlord && !$page.url.pathname.startsWith('/landlord')) {
				goto('/landlord');
			} else if (data.isTenant && !$page.url.pathname.startsWith('/tenant')) {
				goto('/tenant');
			}
			console.log(data);
			return data;
		} catch (error) {
			goto('/signin');
			return null;
		}
	};

	onMount(async () => {
		fetchUser();
	});

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function logOut() {
		localStorage.removeItem('co-living-token');
		window.location.href = '/signin';
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;700&display=swap"
		rel="stylesheet"
	/>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
	/>
</svelte:head>

<div class={isNavbar1 ? 'main-wrapper navbar1-active' : ''}>
	{#if isNavbar1}
		<div class="navbar">
			<a href="/" class="logo mr-auto font-bold">Apateu</a>
			<button
				class="burger"
				on:click={toggleMenu}
				aria-label="Toggle navigation"
				aria-expanded={isMenuOpen}
			>
				<div class="line"></div>
				<div class="line"></div>
				<div class="line"></div>
			</button>
			<div class={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
				<a href="/apartment"><i class="fas fa-building"></i> Apartments</a>
				<a href="/about"><i class="fas fa-info-circle"></i> About</a>
			</div>
		</div>
	{/if}

	{#if isNavbar2}
		<div class="navbar">
			<a href="/profile" class="logo mr-auto font-bold">{userName}</a>
			<button
				class="burger"
				on:click={toggleMenu}
				aria-label="Toggle navigation"
				aria-expanded={isMenuOpen}
			>
				<div class="line"></div>
				<div class="line"></div>
				<div class="line"></div>
			</button>
			<div class={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
				<a href="/apartment"><i class="fas fa-building"></i> Apartments</a>
				<a href="/dashboard" class="profile-link"><i class="fas fa-tachometer-alt"></i> Dashboard</a
				>

				<!-- Additional Links for LANDLORD -->
				{#if userData?.role === 'LANDLORD'}
					<a href="/landlord/bookings" class="bookings-link">
						<i class="fas fa-calendar-alt"></i> Bookings
					</a>
				{/if}

				<button on:click={logOut} class="logout-button">
					<i class="fas fa-sign-out-alt"></i> Logout
				</button>
			</div>
		</div>
	{/if}

	<!-- Main Content -->
	<main class="main-content">
		<slot></slot>
		<Toaster />
	</main>
</div>

<style>
	:global(body) {
		font-family: 'Poppins', sans-serif;
		margin: 0;
		padding: 0;
		background-color: #dbdbdb;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.main-wrapper.navbar1-active {
		background-image: url('/image/background.png'); /* Path to your background image */
		background-size: 135%; /* Adjust size to 135% of original width and height */
		background-position: top -180px center; /* Push the background image higher by 50px */
		background-repeat: no-repeat; /* Prevent image from repeating */
		background-attachment: fixed; /* Optional: Fix the background on scroll */
		padding-bottom: 2rem; /* Ensures the content is not hidden behind the navbar */
	}

	.navbar {
		position: fixed; /* Fix the navbar at the top */
		top: 0; /* Align to the top */
		left: 0; /* Align to the left */
		width: 100%; /* Span the full width */
		z-index: 1000; /* Ensure the navbar is on top of other elements */
		background-color: #515739; /* Background color */
		padding: 0.3rem 1rem; /* Adjust padding for a smaller navbar */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.navbar a {
		color: #ffffff;
		text-decoration: none;
		padding: 0.5rem 1rem; /* Adjusted padding */
		font-size: 0.9rem; /* Reduced font size */
		border-radius: 0.5rem;
		display: inline-block;
		transition:
			transform 0.2s,
			background-color 0.2s,
			box-shadow 0.3s;
		display: flex;
		align-items: center;
		gap: 0.5rem; /* Space between icon and text */
	}

	.navbar a:hover {
		background-color: #7a8357;
		color: #ffffff;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
		transform: translateY(-3px);
	}

	.navbar .logo {
		font-size: 1.3rem; /* Adjusted logo size */
		font-weight: bold;
		transition:
			transform 0.2s,
			color 0.2s;
	}

	.navbar-links {
		display: flex;
		align-items: center;
		gap: 1rem;
		position: relative;
	}

	.navbar-links.open {
		display: flex; /* Ensure links are displayed when open */
		flex-direction: column; /* Stack links vertically in responsive mode */
		background-color: #515739; /* Match the navbar background */
		width: 100%; /* Full width in responsive mode */
		padding: 0.5rem 1rem; /* Add padding for links in mobile mode */
		position: absolute; /* Position links below the navbar */
		top: 100%; /* Ensure links are placed below the navbar */
		left: 0;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
		border-radius: 0 0 0.5rem 0.5rem; /* Rounded corners at the bottom */
	}

	.profile-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.logout-button {
		color: #ffffff;
		text-decoration: none;
		padding: 0.5rem 1rem; /* Adjusted padding */
		font-size: 0.9rem; /* Adjusted font size */
		border-radius: 0.5rem;
		display: inline-block;
		transition:
			transform 0.2s,
			background-color 0.2s,
			box-shadow 0.3s;
		display: flex;
		align-items: center;
		gap: 0.5rem; /* Space between icon and text */
	}

	.logout-button:hover {
		background-color: #7a8357;
		color: #ffffff;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
		transform: translateY(-3px);
	}

	.burger {
		display: none;
		flex-direction: column;
		cursor: pointer;
		background: none;
		border: none;
		position: absolute;
		top: 0.3rem; /* Adjusted for better alignment */
		right: 1rem;
	}

	.burger .line {
		width: 18px; /* Adjusted line size */
		height: 2px;
		background-color: #ffffff;
		margin: 3px 0;
		transition: 0.3s;
	}

	.main-content {
		flex: 1;
		padding: 5rem 2rem; /* Adjust padding to account for fixed navbar height */
		display: flex;
		flex-direction: column;
		justify-content: flex-start; /* Adjust alignment */
		min-height: 0; /* Prevents flex container from shrinking */
	}

	@media (max-width: 768px) {
		.navbar {
			flex-direction: column;
			align-items: flex-start;
		}

		.burger {
			display: flex; /* Show burger menu on smaller screens */
			top: 1rem;
			right: 1.5rem;
		}

		.navbar-links {
			display: none; /* Default state: hidden */
		}

		.navbar-links.open {
			display: flex; /* Show links when menu is open */
		}

		.navbar-links a {
			width: 100%; /* Full-width links in mobile mode */
			text-align: left;
			padding: 1rem;
		}

		.logout-button {
			width: 100%; /* Full-width logout button in mobile mode */
			text-align: left;
			padding: 1rem;
		}
	}

	@media (max-width: 480px) {
		.navbar .logo {
			font-size: 1.1rem; /* Adjusted logo size for smaller screens */
		}

		.main-content {
			padding: 5rem 1rem; /* Adjusted padding for smaller screens */
		}
	}
</style>
