<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Input } from 'flowbite-svelte';
	import unitService from '../../../services/unit.service';
	import UnitCard from '../../../components/UnitCard.svelte';
	import UnitModal from '../../../components/UnitModal.svelte';

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

	let units: Unit[] = [];
	let selectedUnit: Unit | null = null;
	let searchQuery = '';
	let modalOpen = false;
	let isNew = false;

	onMount(async () => {
		try {
			units = await unitService.getUnits();
			console.log(units);
		} catch (error) {
			console.error('Failed to load units', error);
		}
	});

	function filterUnits(unit: Unit): boolean {
		const query = searchQuery.toLowerCase();
		const locationMatch = Object.values(unit.location)
			.map((value) => value.toLowerCase())
			.some((field) => field.includes(query));
		const titleMatch = unit.title.toLowerCase().includes(query);
		return titleMatch || locationMatch;
	}

	function openDetails(unit: Unit) {
		selectedUnit = unit;
		isNew = false;
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
		selectedUnit = null;
		isNew = false;
	}
</script>

<div class="container">
	<div class="header">
		<div class="search-container">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search units..."
				class="search-input"
			/>
		</div>
	</div>

	<div class="grid">
		{#each units.filter(filterUnits) as unit (unit.id)}
			<UnitCard {unit} onDetails={() => openDetails(unit)} />
		{/each}
	</div>
	<UnitModal bind:isOpen={modalOpen} unit={selectedUnit} onClose={closeModal} />
</div>

<style>
	.container {
		max-width: 1500px;
		margin: 0 auto;
		padding: 1.5rem;
		width: 100%;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		font-weight: 500;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-blue {
		background-color: #3b82f6;
		color: #fff;
	}

	.btn-blue:hover {
		background-color: #2563eb;
	}

	.search-container {
		position: relative;
		width: 18rem;
	}

	.search-input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		padding-left: 2.5rem;
		font-size: 1rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		outline: none;
		transition: border-color 0.2s;
	}

	.search-input:focus {
		border-color: #3b82f6;
	}

	.grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(1, 1fr);
	}

	@media (min-width: 768px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
