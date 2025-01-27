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

	const navbar1Prefixes = ['/about', '/signup', '/signin'];
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

{#if isNavbar1}
<nav class="navbar navbar-guest">
	<div class="navbar-container">
		<a href="/" class="logo">Apateu</a>
		<div class="menu-toggle" on:click={toggleMenu}>
			<span class="bar"></span>
			<span class="bar"></span>
			<span class="bar"></span>
		</div>
		<div class={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
			<a href="/about" class="nav-link">About</a>
		</div>
	</div>
</nav>
<img src="./image/background.png" alt="background" class="background" />
{/if}

{#if isNavbar2}
<nav class="navbar navbar-user">
	<div class="navbar-container">
		<a href="/" class="logo">Apateu</a>
		<div class="menu-toggle" on:click={toggleMenu}>
			<span class="bar"></span>
			<span class="bar"></span>
			<span class="bar"></span>
		</div>
		<div class={`nav-menu ${isMenuOpen ? 'active' : ''}`}>

			{#if userData?.role === 'TENANT'}
			<a href="/tenant/apartment" class="nav-link">Units</a>
			<a href="/tenant/book" class="nav-link">Transactions</a>
			<a href="/request" class="nav-link">Maintenance</a>
					<a href="/landlord/bookings" class="nav-link" >
						 Bookings
					</a>
				{/if}

			{#if userData?.role === 'LANDLORD'}
			<a href="/apartment" class="nav-link">Units</a>
			<a href="/book" class="nav-link">Transactions</a>
			<a href="/request" class="nav-link">Maintenance</a>
					<a href="/landlord/bookings" class="bookings-link">
						<i class="fas fa-calendar-alt"></i> Bookings
					</a>
				{/if}
			<a href="/profile" class="nav-link profile-link">
				<i class="fas fa-user-circle"></i>
				<span>Profile</span>
				
			<button on:click={logOut} class="logout-btn">
				<i class="fas fa-sign-out-alt"></i>
				Logout
			</button>
		</div>
	</div>
</nav>
{/if}
<main class="main-content">
	<slot></slot>
	<Toaster />
</main>	




<style lang="postcss">
	:global(body) {
		font-family: 'Inter', sans-serif;
		margin: 0;
		padding: 0;
		background-color: #f4f4f4;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		color: #333;
		line-height: 1.6;
	}

	.background {
		position: absolute;
		z-index: 1;
		width: 100%;
	}

	.navbar {
		background-color: #2c3e50;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.navbar-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.75rem 1rem;
	}

	.logo {
		color: white;
		font-size: 1.5rem;
		font-weight: 700;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.logo:hover {
		color: #3498db;
	}

	.nav-menu {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.nav-link {
		color: white;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
	}

	.nav-link:hover {
		background-color: rgba(255, 255, 255, 0.1);
		transform: translateY(-2px);
	}

	.profile-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.profile-link i {
		font-size: 1.2rem;
	}

	.logout-btn {
		background-color: #e74c3c;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
	}

	.logout-btn:hover {
		background-color: #c0392b;
		transform: translateY(-2px);
	}

	.menu-toggle {
		display: none;
		flex-direction: column;
		cursor: pointer;
	}

	.bar {
		width: 25px;
		height: 3px;
		background-color: white;
		margin: 3px 0;
		transition: 0.4s;
	}

	.main-content {
		flex: 1;
		padding: 2rem;
		max-width: 1536px;
		margin: 0 auto;
		width: 100%;
		z-index: 2;
	}

	@media (max-width: 768px) {
		.menu-toggle {
			display: flex;
		}

		.nav-menu {
			display: none;
			flex-direction: column;
			width: 100%;
			position: absolute;
			top: 100%;
			left: 0;
			background-color: #2c3e50;
			padding: 1rem;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		}

		.nav-menu.active {
			display: flex;
		}

		.nav-link,
		.logout-btn {
			width: 100%;
			text-align: center;
			margin: 0.5rem 0;
		}

		.navbar-container {
			position: relative;
		}
	}

	@media (max-width: 480px) {
		.main-content {
			padding: 1rem;
		}
	}
</style>
