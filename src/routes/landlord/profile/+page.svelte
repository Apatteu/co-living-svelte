<script lang="ts">
	import { onMount } from 'svelte';

	interface Profile {
		firstName: string;
		lastName: string;
		phone?: string;
		address?: string;
	}

	interface Location {
		address: string;
		city: string;
		province: string;
		zipCode: string;
		country: string;
	}

	interface Unit {
		id: string;
		title: string;
		description: string;
		rentAmount: number;
		rooms: number;
		status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
		location: Location;
		photos: string[];
		amenities: string[];
	}

	let profile: Profile | null = null;
	let units: Unit[] = [];
	let isLoading = true;
	let error: string | null = null;
	let isEditModalOpen = false;
	let editedProfile: Profile = {
		firstName: '',
		lastName: '',
		phone: '',
		address: ''
	};

	async function fetchProfileData() {
		try {
			const token = localStorage.getItem('co-living-token');
			if (!token) {
				throw new Error('No authentication token found');
			}

			const profileResponse = await fetch('http://localhost:3000/api/profile', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			const unitsResponse = await fetch('http://localhost:3000/api/profile/units', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (!profileResponse.ok || !unitsResponse.ok) {
				throw new Error('Failed to fetch profile or units');
			}

			profile = await profileResponse.json();
			units = await unitsResponse.json();
			isLoading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
			isLoading = false;
		}
	}

	function openEditModal() {
		if (profile) {
			editedProfile = { ...profile };
			isEditModalOpen = true;
		}
	}

	async function saveProfile() {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch('http://localhost:3000/api/profile', {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editedProfile)
			});

			if (!response.ok) {
				throw new Error('Failed to update profile');
			}

			profile = { ...editedProfile };
			isEditModalOpen = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update profile';
		}
	}

	onMount(fetchProfileData);
</script>

{#if isLoading}
	<div class="loading">Loading profile...</div>
{:else if error}
	<div class="error">{error}</div>
{:else if profile}
	<div class="profile-container">
		<div class="profile-header">
			<div class="profile-avatar">
				{profile.firstName[0]}{profile.lastName[0]}
			</div>
			<div class="profile-info">
				<h1>{profile.firstName} {profile.lastName}</h1>
				<p>{profile.phone || 'No phone number'}</p>
				<p>{profile.address || 'No address provided'}</p>
			</div>
			<button class="edit-button" on:click={openEditModal}> Edit Profile </button>
		</div>

		<div class="units-section">
			<h2>My Properties</h2>
			{#if units.length === 0}
				<p>No properties found</p>
			{:else}
				<div class="unit-grid">
					{#each units as unit}
						<div class="unit-card">
							<img
								src={unit.photos[0] || 'https://via.placeholder.com/300'}
								alt={unit.title}
								class="unit-image"
							/>
							<div class="unit-content">
								<div class="unit-header">
									<h3>{unit.title}</h3>
									<div
										class="status-badge"
										class:status-available={unit.status === 'AVAILABLE'}
										class:status-occupied={unit.status === 'OCCUPIED'}
										class:status-maintenance={unit.status === 'MAINTENANCE'}
									>
										{unit.status}
									</div>
								</div>
								<p>{unit.description}</p>
								<div>
									<strong>Rent:</strong> ${unit.rentAmount.toFixed(2)}
								</div>
								<div>
									<strong>Rooms:</strong>
									{unit.rooms}
								</div>
								<div>
									<strong>Location:</strong>
									{unit.location.city}, {unit.location.province}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if isEditModalOpen}
	<div class="modal" on:click={() => (isEditModalOpen = false)}>
		<div class="modal-content" on:click|stopPropagation>
			<div class="modal-header">
				<h2>Edit Profile</h2>
			</div>
			<div class="modal-body">
				<form class="modal-form" on:submit|preventDefault={saveProfile}>
					<div class="form-group">
						<label for="firstName">First Name</label>
						<input
							type="text"
							id="firstName"
							class="form-input"
							bind:value={editedProfile.firstName}
							required
						/>
					</div>
					<div class="form-group">
						<label for="lastName">Last Name</label>
						<input
							type="text"
							id="lastName"
							class="form-input"
							bind:value={editedProfile.lastName}
							required
						/>
					</div>
					<div class="form-group">
						<label for="phone">Phone Number</label>
						<input type="tel" id="phone" class="form-input" bind:value={editedProfile.phone} />
					</div>
					<div class="form-group">
						<label for="address">Address</label>
						<input type="text" id="address" class="form-input" bind:value={editedProfile.address} />
					</div>
					<div class="modal-actions">
						<button type="button" class="btn-cancel" on:click={() => (isEditModalOpen = false)}>
							Cancel
						</button>
						<button type="submit" class="btn-save"> Save Changes </button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	.profile-container {
		max-width: 1536px;
		margin: 2rem auto;
		background: linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%);
		border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		width: 100%;
	}

	.profile-header {
		display: flex;
		align-items: center;
		background: linear-gradient(to right, #4e6d9c, #2c3e50);
		color: white;
		padding: 1.5rem;
	}

	.profile-avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 1.5rem;
		border: 3px solid rgba(255, 255, 255, 0.3);
		font-size: 2rem;
		font-weight: bold;
	}

	.profile-info {
		flex-grow: 1;
	}

	.profile-info h1 {
		margin: 0;
		font-size: 1.8rem;
		font-weight: 600;
	}

	.profile-info p {
		margin: 0.5rem 0 0;
		opacity: 0.8;
	}

	.units-section {
		padding: 1.5rem;
	}

	.unit-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.unit-card {
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: transform 0.3s ease;
	}

	.unit-card:hover {
		transform: translateY(-5px);
	}

	.unit-image {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.unit-content {
		padding: 1rem;
	}

	.unit-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.status-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: bold;
	}

	.status-available {
		background-color: #4caf50;
		color: white;
	}

	.status-occupied {
		background-color: #ff9800;
		color: white;
	}

	.status-maintenance {
		background-color: #f44336;
		color: white;
	}

	.loading,
	.error {
		text-align: center;
		padding: 2rem;
		color: #666;
	}
	.edit-button {
		background-color: #4e6d9c;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.edit-button:hover {
		background-color: #2c3e50;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		width: 100%;
		max-width: 500px;
		max-height: 80%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 12px;
	}

	.modal-form {
		display: grid;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1rem;
	}

	.btn-save {
		background-color: #4caf50;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}

	.btn-cancel {
		background-color: #f44336;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}

	.modal-body {
	}
</style>
