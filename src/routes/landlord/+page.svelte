<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { onMount } from 'svelte';

	// Interfaces
	interface MaintenanceRequest {
		id: string;
		unitId: string;
		description: string;
		status: 'pending' | 'in-progress' | 'completed';
		photos: string[];
		comments: string[];
		createdAt: Date;
	}

	interface Profile {
		firstName: string;
		lastName: string;
		phone?: string;
		address?: string;
	}

	interface Unit {
		id: string;
		title: string;
	}

	interface Notification {
		id: string;
		message: string;
		isRead: boolean;
		createdAt: string;
	}

	// Store definitions
	const notifications: Writable<Notification[]> = writable([]);
	const API_URL = 'http://localhost:3000/api';

	// State
	let requests: MaintenanceRequest[] = [];
	let description = '';
	let loading = true;
	let currentUnit: Unit | null = null;
	let profile: Profile | null = null;
	let isLoading = true;
	let error: string | null = null;

	let isUpdateModalOpen = false;
	let selectedRequest: MaintenanceRequest | null = null;

	// Auth helper
	function getAuthHeaders(): Headers {
		const token = localStorage.getItem('co-living-token');
		if (!token) throw new Error('No authentication token found');

		return new Headers({
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		});
	}

	async function fetchMaintenanceRequests(): Promise<void> {
		try {
			const response = await fetch(`${API_URL}/maintenance/landlord`, {
				headers: getAuthHeaders()
			});
			if (!response.ok) throw new Error('Failed to fetch requests');

			const data = await response.json();
			console.log(data);
			requests = data.map((req: any) => ({
				...req,
				createdAt: new Date(req.createdAt)
			}));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load maintenance requests';
		}
	}

	async function fetchProfile(): Promise<void> {
		try {
			const response = await fetch(`${API_URL}/profile`, {
				headers: getAuthHeaders()
			});

			if (!response.ok) throw new Error('Failed to fetch profile');
			profile = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch profile';
		} finally {
			isLoading = false;
		}
	}

	async function fetchNotifications(): Promise<void> {
		try {
			const response = await fetch(`${API_URL}/notifications`, {
				headers: getAuthHeaders()
			});

			if (!response.ok) throw new Error('Failed to fetch notifications');
			const data = await response.json();
			notifications.set(data);
		} catch (err) {
			console.error('Error fetching notifications:', err);
		}
	}

	// Lifecycle
	onMount(async () => {
		try {
			await Promise.all([fetchMaintenanceRequests(), fetchProfile(), fetchNotifications()]);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to initialize dashboard';
		} finally {
			loading = false;
		}
	});

	async function submitMaintenanceRequest(event: Event): Promise<void> {
		event.preventDefault();

		if (!description.trim()) {
			error = 'Please provide a description';
			return;
		}

		if (!currentUnit) {
			error = 'No unit assigned';
			return;
		}

		try {
			const response = await fetch(`${API_URL}/maintenance`, {
				method: 'POST',
				headers: getAuthHeaders(),
				body: JSON.stringify({
					description: description.trim(),
					unitId: currentUnit.id
				})
			});

			if (!response.ok) throw new Error('Failed to create request');

			const newRequest = await response.json();
			console.log(newRequest);
			requests = [{ ...newRequest, createdAt: new Date(newRequest.createdAt) }, ...requests];
			description = '';
			error = null;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to submit request';
		}
	}

	async function updateRequestStatus(
		requestId: string,
		newStatus: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
	): Promise<void> {
		try {
			const response = await fetch(`${API_URL}/maintenance/${requestId}/status`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('co-living-token')}`
				},
				body: JSON.stringify({
					status: newStatus
				})
			});

			if (!response.ok) throw new Error('Failed to update status');

			const updatedRequest = await response.json();
			requests = requests.map((req) => (req.id === requestId ? updatedRequest : req));
		} catch (err) {
			error = 'Failed to update request status';
		}
	}

	function openUpdateModal(request: MaintenanceRequest): void {
		selectedRequest = request;
		isUpdateModalOpen = true;
	}
</script>

<div class="dashboard">
	<div class="box notifications">
		<h2>Notifications</h2>
		<ul>
			{#each $notifications as notification (notification.id)}
				<li class="notification-item">
					<span>{notification.message}</span>
					<span class="notification-date">
						{new Date(notification.createdAt).toLocaleDateString()}
					</span>
				</li>
			{/each}
		</ul>
	</div>

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
					<p>{profile.address || 'No address provided'}</p>
				</div>
			</div>

			<div class="container">
				<h1>Maintenance Requests</h1>
				{#if loading}
					<div class="loading">Loading...</div>
				{:else if error}
					<div class="error">{error}</div>
				{:else}
					<div class="request-list">
						{#each requests as request (request.id)}
							<div class="request-card">
								<div class="request-header">
									<div class="request-title">
										Request #{request.id.slice(0, 8)}
									</div>
									<button class="status-button" on:click={() => openUpdateModal(request)}>
										<span class="status-badge status-{request.status.toLowerCase()}">
											{request.status}
										</span>
									</button>
								</div>
								<div class="request-description">
									{request.description}
								</div>
								{#if request.comments && request.comments.length > 0}
									<div class="request-comments">
										<h4>Comments</h4>
										<ul>
											{#each request.comments as comment}
												<li>{comment}</li>
											{/each}
										</ul>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>

			{#if isUpdateModalOpen && selectedRequest !== null}
				<div
					class="modal"
					role="dialog"
					tabindex="0"
					on:click={() => (isUpdateModalOpen = false)}
					on:keydown={(e) => e.key === 'Escape' && (isUpdateModalOpen = false)}
				>
					<div class="modal-content" role="document" on:click|stopPropagation>
						<h2>Update Request Status</h2>
						<div class="form-group">
							<label for="status">Status</label>
							<select id="status" bind:value={selectedRequest.status}>
								{#each ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as status}
									<option value={status}>{status}</option>
								{/each}
							</select>
						</div>

						<div class="modal-actions">
							<button class="btn-cancel" type="button" on:click={() => (isUpdateModalOpen = false)}>
								Cancel
							</button>
							<button
								class="btn-save"
								type="button"
								on:click={() => updateRequestStatus(selectedRequest.id, selectedRequest.status)}
							>
								Update Status
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

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
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		background-color: #dbdbdb;
	}

	/* General Heading Styles */
	h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	/* Dashboard Grid Layout */
	.dashboard {
		display: flex;
		width: 100%;
		grid-template-columns: 3fr 1.5fr;
		grid-template-rows: auto 1fr;
		gap: 1rem;
		height: 100vh;
		padding: 1rem;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: #2d3748;
		margin-bottom: 2rem;
		font-size: 2rem;
		font-weight: 600;
	}

	.loading {
		text-align: center;
		padding: 2rem;
		color: #4a5568;
	}

	.form {
		background: #fff;
		padding: 1.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.label {
		font-weight: 500;
		color: #4a5568;
		min-width: 80px;
	}

	.form-label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #4a5568;
	}

	.form-textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		resize: vertical;
		min-height: 100px;
	}

	.form-textarea:focus {
		outline: none;
		border-color: #4299e1;
		box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
	}

	.error {
		color: #e53e3e;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background: #fff5f5;
		border-radius: 0.25rem;
	}

	.btn {
		background: #4299e1;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 0.375rem;
		border: none;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn:hover {
		background: #3182ce;
	}

	.btn:disabled {
		background: #a0aec0;
		cursor: not-allowed;
	}

	.request-list {
		display: grid;
		gap: 1.5rem;
	}

	.request-card {
		background: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.request-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.request-title {
		font-weight: 600;
		color: #2d3748;
		margin-bottom: 0.25rem;
	}

	.tenant-info {
		color: #718096;
		font-size: 0.875rem;
	}

	.status-select {
		padding: 0.5rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		background: white;
		color: #4a5568;
		font-size: 0.875rem;
	}

	.request-description {
		color: #4a5568;
		line-height: 1.5;
	}

	/* General Box Styling */
	.box {
		background-color: #ecebeb;
		border-radius: 0.5rem;
		padding: 1rem;
		box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
	}

	/* Notifications Section */
	.notifications {
		padding: 1.5rem;
		width: 100%;
	}

	.notifications ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	.notification-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #f4f4f4;
		padding: 0.5rem;
		border-radius: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.notification-date {
		font-size: 0.9rem;
		color: #666;
		white-space: nowrap;
	}

	/* Maintenance Section */
	.maintenance {
		grid-area: maintenance;
		padding: 1.5rem;
	}

	.form-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label {
		font-weight: bold;
		margin-right: 1rem;
	}

	.input {
		flex-grow: 1;
		padding: 0.3rem;
		background-color: #ffffff;
		border: 1px solid #ecebeb;
		border-radius: 0.25rem;
		height: 2rem;
		display: flex;
		align-items: center;
	}

	.input span {
		display: block;
		padding: 0.5rem;
		line-height: 1.5;
	}

	textarea {
		width: 100%;
		height: 10rem;
		padding: 0.5rem;
		border: 1px solid #ecebeb;
		border-radius: 0.25rem;
		resize: none;
	}

	textarea:focus {
		outline: none !important; /* Ensure outline is removed */
		box-shadow: none !important; /* Remove any box-shadow */
		border: 0.1rem solid #ff6600; /* Orange border with rem unit for focus */
	}

	button {
		align-self: flex-end;
		background-color: #ff6600;
		color: white;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
	}

	button:hover {
		background-color: #ff5500;
	}

	/* My Rent Section */
	.my-rent {
		grid-area: my-rent;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}

	.calendar-container {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.calendar-header button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
		color: #333;
	}

	.calendar-title {
		font-size: 1.2rem;
		font-weight: bold;
		color: #333;
	}

	.visual-calendar {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
		text-align: center;
	}

	.visual-calendar th,
	.visual-calendar td {
		border: 1px solid #ddd;
		padding: 8px;
		width: 14%;
	}

	.visual-calendar th {
		background-color: #f4f4f4;
	}

	.visual-calendar td {
		background-color: #fff;
		cursor: pointer;
	}

	.visual-calendar td.active {
		background-color: #ff6600;
		color: white;
		font-weight: bold;
	}

	.visual-calendar td.selected {
		border: 2px solid #ff6600; /* Highlight border color */
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
	}

	table td,
	table th {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	table th {
		background-color: #f4f4f4;
	}

	/* Responsive Media Queries */
	@media (max-width: 1024px) {
		.dashboard {
			grid-template-areas:
				'notifications'
				'my-rent'
				'maintenance';
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			height: auto;
		}

		.my-rent,
		.maintenance,
		.notifications {
			padding: 1rem;
		}
	}

	@media (max-width: 768px) {
		.dashboard {
			padding: 0.5rem;
		}

		.calendar-container {
			margin-top: 0.5rem;
		}

		.visual-calendar th,
		.visual-calendar td {
			padding: 4px;
			font-size: 0.85rem;
		}

		.calendar-header {
			font-size: 0.9rem;
		}

		.calendar-header button {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		h2 {
			font-size: 1.25rem;
		}

		.dashboard {
			gap: 0.5rem;
		}

		.box {
			padding: 0.75rem;
		}

		.calendar-container {
			margin-top: 0.5rem;
		}

		.visual-calendar th,
		.visual-calendar td {
			padding: 2px;
			font-size: 0.75rem;
		}

		button {
			padding: 0.4rem 0.8rem;
			font-size: 0.9rem;
		}

		textarea {
			height: 7rem;
		}
	}
</style>
