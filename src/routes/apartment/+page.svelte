<script lang="ts">
  import { Card, Button } from 'flowbite-svelte';
  import { ArrowRightOutline } from 'flowbite-svelte-icons';
  import { SearchOutline } from 'flowbite-svelte-icons';
  import { Carousel } from 'flowbite-svelte';

  // Carousel images type
  type CarouselImage = {
    src: string;
    alt: string;
  };

  let images: CarouselImage[] = [
    { src: '/image/A.jpg', alt: 'Image 1' },
    { src: '/image/B.jpg', alt: 'Image 2' },
    { src: '/image/C.jpg', alt: 'Image 3' }
  ];

  // State for dropdown visibility
  let showDropdown = false;

  // Apartment card data
  const apartments = [
    {
      title: 'Noteworthy technology acquisitions 2021',
      description: 'Here are the biggest enterprise technology acquisitions of 2021 so far.',
      price: '₱8,000 – ₱15,000',
      img: '/image/B1.jpg',
      rating: 4
    },
    {
      title: 'Luxury Apartment in the City Center',
      description: 'A beautiful apartment located in the heart of the city with modern amenities.',
      price: '₱20,000 – ₱25,000',
      img: '/image/B2.jpg',
      rating: 5
    },
    {
      title: 'Cozy Studio with Scenic Views',
      description: 'A cozy and compact studio apartment with breathtaking views of the skyline.',
      price: '₱10,000 – ₱12,000',
      img: '/image/building.jpg',
      rating: 3
    }
  ];

  // Dropdown options without "Parking"
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
        'Laundry Facility (In-unit shared)',
        'Outdoor Space (Balcony, Garden)',
        'Furnished Room/Apartment',
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
</script>

<style>
  /* Search Bar */
  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0;
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
    width: 165px;
  }

  .dropdown-button:focus {
    border: 2px solid #ff6a00;
    box-shadow: 0 0 4px #ff6a00;
    outline: none;
    border-radius: 0.375rem;
  }

  .dropdown-content {
    display: block;
    position: absolute;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    width: 850px;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 1rem;
  }

  .dropdown-section {
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
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
    margin-left: 3rem;
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

  .cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;  /* Reduce the padding here */
  margin-top: -1rem;  /* Reduce the space above the apartment cards */
}

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Carousel styling */
  .carousel-container {
  width: 100%;  /* Adjust the width of the carousel */
  max-width: 1000px;  /* Maximum width */
  height: 400px;  /* Set a height */
  margin: 0 auto;  /* Center the carousel */
  margin-bottom: -1rem;  /* Add a little margin at the bottom */
}
</style>

<!-- Search Bar -->
<div class="search-bar">
  <!-- Dropdown -->
  <div class="dropdown-container">
    <div class="dropdown-button" on:click={() => (showDropdown = !showDropdown)}>
      All Categories ⮟
    </div>

    {#if showDropdown}
      <div class="dropdown-content">
        {#each dropdownSections as section}
          <div class="dropdown-section {section.title.toLowerCase()}">
            <div class="dropdown-section-title">{section.title}</div>
            {#each section.options as option}
              <label>
                {#if section.isRadio}
                  <input type="radio" name={section.title} />
                {:else}
                  <input type="checkbox" />
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
    <input type="text" placeholder="Search Units..." />
    <button>
      <SearchOutline class="w-5 h-5" />
    </button>
  </div>
</div>

<!-- Carousel Component -->
<div class="carousel-container">
  <Carousel {images} let:Indicators let:Controls>
    <Controls />
    <Indicators />
  </Carousel>
</div>

<!-- Apartment Cards -->
<div class="cards-container">
  {#each apartments as apartment}
    <Card img={apartment.img}>
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {apartment.title}
      </h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
        {apartment.description}
      </p>
      <div class="flex items-center mb-2">
        {#each Array(5).fill(0) as _, i}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={i < apartment.rating ? 'gold' : 'none'}
            viewBox="0 0 24 24"
            stroke="gold"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        {/each}
      </div>
      <div class="card-footer">
        <p class="text-gray-900 font-bold">{apartment.price}</p>
        <Button style="background-color: #ff6a00">
          Read more
          <ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
        </Button>
      </div>
    </Card>
  {/each}
</div>