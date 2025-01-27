<script lang="ts">
	import { onMount } from 'svelte';

	interface Tenant {
		id: string;
		name: string;
		unit: string;
	}

	interface MaintenanceRequest {
		id: string;
		tenantId: string;
		description: string;
		status: 'pending' | 'in-progress' | 'completed';
		photos: string[];
		comments: string[];
		createdAt: Date;
	}

	let requests: MaintenanceRequest[] = [];
	let unitId: any = '';
	let description: string = '';
	let error: string = '';
	let loading = true;

	const API_URL = 'http://localhost:3000/api/maintenance';

	async function fetchUnitId() {
		try {
			const response = await fetch(`${API_URL}/current-unit`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('co-living-token')}`
				}
			});
			if (!response.ok) throw new Error('Failed to fetch tenants');
			unitId = await response.json();
		} catch (err) {
			throw new Error('No Unit Id found');
		}
	}

	async function fetchRequests() {
		try {
			const response = await fetch(`${API_URL}/tenant`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('co-living-token')}`
				}
			});
			if (!response.ok) throw new Error('Failed to fetch requests');
			const data = await response.json();

			requests = data.map((req: any) => ({
				...req,
				createdAt: new Date(req.createdAt)
			}));
		} catch (err) {
			error = 'Failed to load maintenance requests. Please try again.';
		}
	}

	// async function updateRequestStatus(requestId: string, newStatus: MaintenanceRequest['status']) {
	// 	try {
	// 		const response = await fetch(`${API_URL}/maintenance-requests/${requestId}`, {
	// 			method: 'PATCH',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Authorization: `Bearer ${localStorage.getItem('co-living-token')}`
	// 			},
	// 			body: JSON.stringify({ status: newStatus })
	// 		});

	// 		if (!response.ok) throw new Error('Failed to update status');

	// 		requests = requests.map((req) =>
	// 			req.id === requestId ? { ...req, status: newStatus } : req
	// 		);
	// 	} catch (err) {
	// 		error = 'Failed to update request status. Please try again.';
	// 	}
	// }

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		if (!description.trim()) {
			error = 'Please provide both description';
			return;
		}

		try {
			const response = await fetch(`${API_URL}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('co-living-token')}`
				},
				body: JSON.stringify({
					description: description.trim()
				})
			});

			if (!response.ok) throw new Error('Failed to create request');

			const newRequest = await response.json();
			requests = [{ ...newRequest, createdAt: new Date(newRequest.createdAt) }, ...requests];
			description = '';
			error = '';
		} catch (err) {
			error = 'Failed to submit request. Please try again.';
		}
	};

	onMount(async () => {
		try {
			await Promise.all([fetchUnitId(), fetchRequests()]);
		} finally {
			loading = false;
		}
	});

	function handleInput(event: Event): string {
		const target = event.target as HTMLSelectElement;
		return target.value;
	}
	let currentDate: Date = new Date();
</script>

<div class="container">
	<h1>Maintenance Requests</h1>

	{#if loading}
		<div class="loading">Loading...</div>
	{:else}
		<form on:submit={handleSubmit} class="form">
			<div class="form-group">
				<div class="row">
					<div class="label">Date:</div>
					<div class="input">
						<span
							>{currentDate.toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}</span
						>
					</div>
				</div>
				<div class="row">
					<div class="label">Unit Id:</div>
					<div class="input">
						<span>{unitId ? unitId.title : 'You do not have unit yet.'}</span>
					</div>
				</div>
			</div>

			<div class="form-group">
				<label for="description" class="form-label">Description</label>
				<textarea
					id="description"
					bind:value={description}
					required
					class="form-textarea"
					rows="4"
				/>
			</div>

			{#if error}
				<div class="error">{error}</div>
			{/if}

			<button type="submit" class="btn" disabled={!description.trim() || unitId === ''}>
				Submit Request
			</button>
		</form>

		<div class="request-list">
			{#each requests as request (request.id)}
				<div class="request-card">
					<div class="request-header">
						<div>
							<div class="request-title">
								Request #{request.id.slice(0, 8)}
							</div>
							<!-- <div class="tenant-info">
								{requests.find((t) => t.id === request.tenantId)?.name ?? 'Unknown'} - Unit {tenants.find(
									(t) => t.id === request.tenantId
								)?.unit ?? 'Unknown'}
							</div> -->
						</div>
						<span>{request.status}</span>
					</div>
					<div class="request-description">
						{request.description}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
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
</style>
