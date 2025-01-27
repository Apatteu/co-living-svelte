<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	interface Booking {
		id: string;
		tenantName: string;
		date: string;
		unit: string;
		status: string;
	}

	let bookings: Booking[] = [];

	async function fetchBookingRequests() {
		try {
			const token = localStorage.getItem('co-living-token');

			if (!token) {
				goto('/signin');
				return;
			}

			const response = await fetch('http://localhost:3000/api/bookings/landlord', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			const data = await response.json();

			bookings = data.map((booking: any) => ({
				id: booking.id,
				tenantName: booking.tenant.profile.firstName + ' ' + booking.tenant.profile.lastName,
				date: new Date(booking.startDate).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}),
				unit: booking.unit.title,
				status: booking.status
			}));
			console.log(bookings);
		} catch (error) {
			console.error('Failed to fetch booking requests:', error);
		}
	}

	async function handleBookingStatus(
		bookingId: string,
		status: 'APPROVED' | 'REJECTED' | 'CANCELLED'
	) {
		try {
			const token = localStorage.getItem('co-living-token');

			const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}/status`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status })
			});

			if (response.ok) {
				toast.success(`User ${status}`);
			}
			bookings = bookings.filter((booking) => booking.id !== bookingId);
		} catch (error) {
			console.error(`Failed to ${status.toLowerCase()} booking:`, error);
		}
	}

	onMount(() => {
		fetchBookingRequests();
	});
</script>

<div class="booking-container">
	<h2 class="booking-title">Booking Requests</h2>

	<div class="booking-table">
		<div class="table-header">
			<div class="header-cell">NAME</div>
			<div class="header-cell">DATE</div>
			<div class="header-cell">UNIT</div>
			<div class="header-cell">ACTION</div>
		</div>

		<div class="table-body">
			{#each bookings as booking (booking.id)}
				<div class="table-row">
					<div class="table-cell">{booking.tenantName}</div>
					<div class="table-cell">{booking.date}</div>
					<div class="table-cell">{booking.unit}</div>
					{#if booking.status === 'APPROVED'}
						<div class="action-cell table-cell">
							<button
								class="btn btn-decline"
								on:click={() => handleBookingStatus(booking.id, 'CANCELLED')}
							>
								Cancel
							</button>
						</div>
					{:else}
						<div class="action-cell table-cell">
							<button
								class="btn btn-accept"
								on:click={() => handleBookingStatus(booking.id, 'APPROVED')}
							>
								Accept
							</button>
							<button
								class="btn btn-decline"
								on:click={() => handleBookingStatus(booking.id, 'REJECTED')}
							>
								Decline
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.booking-container {
		background-color: #ffffff;
		border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		padding: 24px;
	}

	.booking-title {
		font-size: 1.8rem;
		color: #333;
		margin-bottom: 20px;
		font-weight: 600;
		border-bottom: 2px solid #f0f0f0;
		padding-bottom: 10px;
	}

	.booking-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
	}

	.table-header {
		display: grid;
		grid-template-columns: 2fr 2fr 2fr 3fr;
		background-color: #f5f5f5;
		font-weight: 600;
		color: #666;
		padding: 12px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	.header-cell {
		text-transform: uppercase;
		font-size: 0.9rem;
		letter-spacing: 0.5px;
	}

	.table-body {
		display: grid;
		gap: 8px;
	}

	.table-row {
		display: grid;
		grid-template-columns: 2fr 2fr 2fr 3fr;
		align-items: center;
		padding: 15px 12px;
		background-color: #fafafa;
		border-radius: 8px;
		transition: background-color 0.3s ease;
	}

	.table-row:hover {
		background-color: #f0f0f0;
	}

	.table-cell {
		color: #333;
		font-size: 1rem;
	}

	.action-cell {
		display: flex;
		gap: 10px;
	}

	.btn {
		padding: 8px 16px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s ease;
		font-size: 0.9rem;
	}

	.btn-accept {
		background-color: #4caf50;
		color: white;
	}

	.btn-accept:hover {
		background-color: #45a049;
	}

	.btn-decline {
		background-color: #f44336;
		color: white;
	}

	.btn-decline:hover {
		background-color: #d32f2f;
	}
</style>
