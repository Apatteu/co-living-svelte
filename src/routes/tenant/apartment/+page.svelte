<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, Button, Carousel } from 'flowbite-svelte';
  import { ArrowRightOutline, SearchOutline } from 'flowbite-svelte-icons';
  import unitService, { type Unit } from '../../../services/unit.service';

  interface UnitFilters {
    minPrice?: number;
    maxPrice?: number;
    rooms?: number;
    location?: string;
    amenities?: string[];
  }

  // Dropdown sections configuration
  const dropdownSections = [
    {
      title: 'Room Type',
      options: ['Entire Unit', 'Studio Apartment', 'Dormitory Type', 'Bedspace'],
      isRadio: true
    },
    {
      title: 'Preferred Roommates',
      options: ['Male Roommates Only', 'Female Roommates Only', 'Any Gender'],
      isRadio: true
    },
    {
      title: 'House Rules',
      options: ['Smoking Policy', 'Pet Policy', 'Curfew Policy'],
      isRadio: false
    },
    {
      title: 'Length of Stay',
      options: ['Short-term', 'Long-term', 'Flexible'],
      isRadio: true
    },
    {
      title: 'Monthly Rent',
      options: ['₱2,000.00 - ₱5,000.00', '₱5,001.00 - ₱10,000.00', '₱10,001.00 - ₱20,000.00'],
      isRadio: true
    },
    {
      title: 'Amenities',
      options: [
        'Laundry Facility',
        'Outdoor Space',
        'Furnished Room',
        'High-Speed Wifi',
        'Kitchen Access',
        'Air Conditioning'
      ],
      isRadio: false
    },
    {
      title: 'Barangay',
      options: [
        'Baretto',
        'Mabayuhan',
        'New Ilalim',
        'Pag-asa',
        'East Bajac-bajac',
        'New Asinan',
        'New Kababae',
        'Sta-Rita',
        'East Tapinac',
        'New Banicain',
        'New Cabalan',
        'Old Cabalan',
        'West Tapinac'
      ],
      isRadio: true
    }
  ];

  let units: Unit[] = [];
  let loading = false;
  let error: string | null = null;
  let showDropdown = false;

  let searchQuery = '';
  let filters: UnitFilters = {};

  function debounce<F extends (...args: any[]) => void>(
    fn: F,
    delay: number
  ): (...args: Parameters<F>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  async function fetchUnits() {
    loading = true;
    error = null;
    try {
      const searchFilters = {
        ...filters,
        ...(searchQuery ? { searchTerm: searchQuery } : {})
      };
      units = await unitService.getUnits(searchFilters);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to fetch units';
    } finally {
      loading = false;
    }
  }

  const debouncedFetch = debounce(fetchUnits, 300);

  function handleFilterChange(section: string, value: string, checked: boolean) {
    switch (section) {
      case 'Monthly Rent':
        const [min, max] = value
          .split(' - ')
          .map(price => parseInt(price.replace(/[₱,]/g, '')));
        
        filters = {
          ...filters,
          minPrice: checked ? min : undefined,
          maxPrice: checked ? max : undefined
        };
        break;

      case 'Amenities':
        const currentAmenities = filters.amenities || [];
        filters = {
          ...filters,
          amenities: checked 
            ? [...currentAmenities, value]
            : currentAmenities.filter(a => a !== value)
        };
        break;

      case 'Room Type':
        filters = {
          ...filters,
          rooms: checked ? getRoomCount(value) : undefined
        };
        break;

      case 'Barangay':
        filters = {
          ...filters,
          location: checked ? value : undefined
        };
        break;
    }

    fetchUnits();
  }

  function getRoomCount(roomType: string): number {
    switch (roomType) {
      case 'Studio Apartment':
        return 0;
      case 'Bedspace':
        return 1;
      case 'Dormitory Type':
        return 1;
      case 'Entire Unit':
        return 2;
      default:
        return 2;
    }
  }

  function formatPrice(amount: number): string {
    return `₱${amount.toLocaleString()}`;
  }

  function handleSearch() {
    debouncedFetch();
  }

  onMount(fetchUnits);
</script>

<div class="search-bar">
  <div class="dropdown-container">
    <div class="dropdown-button" on:click={() => (showDropdown = !showDropdown)} tabindex="0">
      All Categories ⮟
    </div>
    
    {#if showDropdown}
      <div class="dropdown-content">
        {#each dropdownSections as section}
          <div class="dropdown-section">
            <div class="dropdown-section-title">{section.title}</div>
            {#each section.options as option}
              <label>
                {#if section.isRadio}
                  <input
                    type="radio"
                    name={section.title}
                    on:change={(e) => handleFilterChange(section.title, option, e.currentTarget.checked)}
                  />
                {:else}
                  <input
                    type="checkbox"
                    on:change={(e) => handleFilterChange(section.title, option, e.currentTarget.checked)}
                  />
                {/if}
                {option}
              </label>
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="input-wrapper">
    <input
      type="text"
      placeholder="Search Units..."
      bind:value={searchQuery}
      on:input={handleSearch}
    />
    <button on:click={fetchUnits}>
      <SearchOutline class="w-5 h-5" />
    </button>
  </div>
</div>

<!-- Loading and Error States -->
{#if loading}
  <div class="flex justify-center p-4">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
{:else if error}
  <div class="text-red-500 p-4 text-center">{error}</div>
{/if}

<!-- Units Grid -->
<div class="cards-container">
  {#each units as unit}
    <Card
      style="background-color: white; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px;"
    >
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {unit.title}
      </h5>
      <p class="mb-3 font-normal text-gray-600 leading-tight">
        {unit.description}
      </p>
      <div class="mb-2">
        <p class="text-sm text-gray-600">{unit.location.address}, {unit.location.city}</p>
        <p class="text-sm text-gray-600">Rooms: {unit.rooms}</p>
      </div>
      <div class="card-footer">
        <p class="text-gray-900 font-bold">{formatPrice(unit.rentAmount)}</p>
        <Button style="background-color: #ff6a00" href={`/units/${unit.id}`}>
          View Details
          <ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
        </Button>
      </div>
    </Card>
  {/each}
</div>

<style>
 /* Search Bar */
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap; /* Allow wrapping */
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
  width: 50%;
}

.input-wrapper input {
  flex: 1;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  outline: none;
}

.input-wrapper input:focus {
  border: 1px solid #ff6a00;
  box-shadow: 0 0 4px #ff6a00;
  border-radius: 0.375rem;
}

.input-wrapper button {
  background-color: #ff6a00;
  color: white;
  border: none;
  padding: 0.64rem 1rem;
  cursor: pointer;
}

.input-wrapper button:hover {
  background-color: #e65b00;
}

/* Dropdown Styles */
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background-color: white;
  color: #333;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  text-align: left;
  width: 165px; /* Original width */
}

.dropdown-button:focus {
  border: 1px solid #ff6a00;
  border-radius: 0.375rem;
  outline: none;
}

.dropdown-content {
  display: block;
  position: absolute;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 810px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 1rem;
}

.dropdown-section {
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dropdown-section-title {
  font-weight: bold;
  width: 100%;
  margin-bottom: 0.5rem;
}

.dropdown-section label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-section input {
  margin: 0;
}

.dropdown-section input[type='radio'],
.dropdown-section input[type='checkbox'] {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  margin: 0;
}

.dropdown-section input[type='radio']:checked,
.dropdown-section input[type='checkbox']:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}

/* Cards Layout */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
  margin-top: -1rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Carousel styling */
.carousel-container {
  width: 100%;
  max-width: 1000px;
  height: 400px;
  margin: 0 auto;
  margin-bottom: -1rem;
}

/* Media Queries for Responsiveness */
/* For mobile devices */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column; /* Stack items vertically */
    gap: .1rem;
  }

  .input-wrapper {
    width: 100%; /* Full-width input on mobile */
    order: -1; /* Move search input and button to the top */
  }

  .dropdown-container {
    width: 100%; /* Make dropdown take full width */
    margin-top: .5rem; /* Space between dropdown and other elements */
    order: 0; /* Position dropdown below search input */
  }

  .dropdown-button {
    width: 50%; /* Full-width dropdown button on mobile */
  }

  .dropdown-content {
    width: 100%;
    padding: 0.5rem;
  }

  .cards-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Single column cards on very small screens */
  }

  .carousel-container {
    height: 250px; /* Adjust height for mobile devices */
  }

  .card-footer {
    flex-direction: column; /* Stack footer elements on small screens */
    align-items: flex-start; /* Align items to the start */
  }
}

</style>
