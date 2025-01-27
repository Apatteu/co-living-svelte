<script lang="ts">
	interface Unit {
		id?: string;
		title: string;
		description: string;
		location: Location;
		rentAmount: number;
		rooms: number;
		status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
		photos?: string[];
		amenities?: string[];
	}

	interface Location {
		address: string;
		city: string;
		province: string;
		zipCode: string;
		country: string;
	}
	import { fade } from 'svelte/transition';

	export let unit: Unit | null = null;
	export let isOpen = false;
	export let onClose: () => void;

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleOverlayKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

{#if isOpen && unit}
	<div
		class="modal-overlay"
		role="dialog"
		aria-modal="true"
		transition:fade
		on:click={handleOverlayClick}
		on:keydown={handleOverlayKeydown}
	>
		<div class="modal-container visible" on:click|stopPropagation>
			<div class="modal-content">
				<div class="modal-header">
					<h3>{unit.title}</h3>
				</div>

				<div class="details-grid">
					<div class="detail-item">
						<span class="label">Monthly Rent:</span>
						<span class="value">${unit.rentAmount}</span>
					</div>

					<div class="detail-item full-width">
						<span class="label">Description:</span>
						<p class="value description">{unit.description}</p>
					</div>

					<div class="detail-item full-width">
						<span class="label">Location:</span>
						<address class="value">
							{unit.location.address}<br />
							{unit.location.city}, {unit.location.province}
							{unit.location.zipCode}<br />
							{unit.location.country}
						</address>
					</div>

					{#if unit.photos?.length}
						<div class="detail-item full-width">
							<span class="label">Images:</span>
							<div class="image-grid">
								{#each unit.photos as image}
									<div class="image-container">
										<img src={image} alt="Unit" />
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<div class="modal-actions">
					<button class="btn-close" on:click={onClose}>Close</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(45, 55, 72, 0.7);
		backdrop-filter: blur(5px);
	}

	.modal-container {
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: auto;
	}

	.modal-content {
		padding: 2rem;
	}

	.modal-header h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 1.5rem;
	}

	.details-grid {
		display: grid;
		gap: 1.5rem;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.full-width {
		grid-column: 1 / -1;
	}

	.label {
		font-weight: 500;
		color: #4a5568;
	}

	.value {
		color: #2d3748;
	}

	.description {
		white-space: pre-wrap;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.image-container {
		aspect-ratio: 4/3;
		border-radius: 8px;
		overflow: hidden;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 2rem;
	}

	.btn-close {
		padding: 0.75rem 1.5rem;
		background-color: #e2e8f0;
		color: #2d3748;
		border: none;
		border-radius: 8px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-close:hover {
		background-color: #cbd5e0;
	}
</style>
