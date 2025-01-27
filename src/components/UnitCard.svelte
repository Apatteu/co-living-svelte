<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';

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

	interface BookingData {
		unitId: string;
		startDate: string;
		endDate: string;
	}

	export let unit: Unit;
	export let onDetails: (unit: Unit) => void;

	let isBookingModalOpen = false;
	let startDate = '';
	let endDate = '';
	let isSubmitting = false;
	let errorMessage = '';
	let startDateError = '';
	let endDateError = '';

	function validateDates(): boolean {
		startDateError = '';
		endDateError = '';

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const selectedStartDate = new Date(startDate);
		const selectedEndDate = new Date(endDate);

		if (selectedStartDate <= today) {
			startDateError = 'Start date must be after today';
			return false;
		}

		if (selectedEndDate <= selectedStartDate) {
			endDateError = 'End date must be after start date';
			return false;
		}

		return true;
	}

	class BookingService {
		private readonly API_URL = 'http://localhost:3000/api/bookings';
		async createBooking(bookingData: BookingData): Promise<any> {
			const bookData = {
				...bookingData,
				startDate: new Date(bookingData.startDate),
				endDate: new Date(bookingData.startDate)
			};
			console.log(bookData);
			const response = await fetch(this.API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('co-living-token')}`
				},
				body: JSON.stringify(bookData)
			});

			if (!response.ok) {
				throw new Error(`Booking failed: ${response.statusText}`);
			}

			return response.json();
		}
	}

	async function handleBookSubmit() {
		if (!unit.id || !startDate || !endDate) return;
		if (!validateDates()) {
			return;
		}

		try {
			isSubmitting = true;
			errorMessage = '';

			const bookingData = {
				unitId: unit.id,
				startDate,
				endDate
			};

			const bookingService = new BookingService();
			await bookingService.createBooking(bookingData);
			isBookingModalOpen = false;
			toast.success('Booking request sent successfully!');
		} catch (error) {
			errorMessage = 'Failed to create booking. Please try again.';
			console.error(error);
		} finally {
			isSubmitting = false;
		}
	}

	function openBookingModal() {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		const defaultEndDate = new Date();
		defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);

		startDate = tomorrow.toISOString().split('T')[0];
		endDate = defaultEndDate.toISOString().split('T')[0];

		isBookingModalOpen = true;
		errorMessage = '';
		startDateError = '';
		endDateError = '';
	}
</script>

<div class="card-inventory">
	<img src={unit.photos?.[0]} alt={unit.title} class="card-img-inventory" />
	<div class="card-content-inventory">
		<h5 class="card-title-inventory">{unit.title}</h5>
		<div class="card-details-inventory">
			<p>{unit.rooms} Rooms</p>
			<p>₱{unit.rentAmount.toLocaleString()}/month</p>
			<p>
				{unit.location.address}, {unit.location.city}, {unit.location.province}, {unit.location
					.country}
				{unit.location.zipCode}
			</p>
			<p>{unit.description}</p>
		</div>
		<div class="card-footer-inventory">
			<span
				class="status-badge-inventory {unit.status === 'OCCUPIED'
					? 'status-occupied-inventory'
					: 'status-available-inventory'}"
			>
				{unit.status}
			</span>
			<div class="button-group">
				<button class="btn-inventory btn-blue-inventory" on:click={() => onDetails(unit)}>
					Details
				</button>
				{#if unit.status === 'AVAILABLE'}
					<button class="btn-inventory btn-green-inventory" on:click={openBookingModal}>
						Book Now
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

{#if isBookingModalOpen}
	<div class="modal-overlay" transition:fade on:click|self={() => (isBookingModalOpen = false)}>
		<div class="modal-content" on:click|stopPropagation>
			<h3>Book Unit: {unit.title}</h3>

			{#if errorMessage}
				<div class="error-message">
					{errorMessage}
				</div>
			{/if}

			<form on:submit|preventDefault={handleBookSubmit}>
				<div class="form-group">
					<label for="startDate">Start Date</label>
					<input
						type="date"
						id="startDate"
						bind:value={startDate}
						min={new Date().toISOString().split('T')[0]}
						required
					/>
					{#if startDateError}
						<span class="error-text">{startDateError}</span>
					{/if}
				</div>

				<div class="form-group">
					<label for="endDate">End Date</label>
					<input type="date" id="endDate" bind:value={endDate} min={startDate} required />
					{#if endDateError}
						<span class="error-text">{endDateError}</span>
					{/if}
				</div>

				<div class="booking-summary">
					<p>Monthly Rent: ₱{unit.rentAmount.toLocaleString()}</p>
					<p>Location: {unit.location.address}, {unit.location.city} {unit.location.province}</p>
				</div>

				<div class="modal-actions">
					<button type="button" class="btn-cancel" on:click={() => (isBookingModalOpen = false)}>
						Cancel
					</button>
					<button type="submit" class="btn-submit" disabled={isSubmitting}>
						{isSubmitting ? 'Submitting...' : 'Confirm Booking'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.button-group {
		display: flex;
		gap: 0.5rem;
	}

	.btn-green-inventory {
		background-color: #10b981;
	}

	.btn-green-inventory:hover {
		background-color: #059669;
	}

	.modal-overlay {
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
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.form-group input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.booking-summary {
		margin: 1.5rem 0;
		padding: 1rem;
		background: #f7f7f7;
		border-radius: 4px;
	}

	.error-message {
		background: #fee2e2;
		color: #991b1b;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.btn-cancel,
	.btn-submit {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		border: none;
		cursor: pointer;
	}

	.btn-cancel {
		background: #e5e7eb;
	}

	.btn-submit {
		background: #10b981;
		color: white;
	}

	.btn-submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.card-inventory {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background-color: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.card-img-inventory {
		width: 100%;
		height: 100%;
		object-fit: cover;
		aspect-ratio: 1/1;
		border-bottom: 1px solid #e5e7eb;
	}

	.card-content-inventory {
		padding: 1rem;
	}

	.card-title-inventory {
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	.card-details-inventory p {
		margin: 0.25rem 0;
		color: #374151;
	}

	.card-footer-inventory {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
	}

	.status-badge-inventory {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 9999px;
	}

	.status-occupied-inventory {
		background-color: #10b981;
		color: #f9fafb;
	}

	.status-available-inventory {
		background-color: #ef4444;
		color: #fef2f2;
	}

	.btn-inventory {
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-blue-inventory {
		background-color: #3b82f6;
		color: #fff;
	}

	.btn-blue-inventory:hover {
		background-color: #2563eb;
	}
</style>
