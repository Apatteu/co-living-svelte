<script lang="ts">
  import { Carousel } from 'flowbite-svelte';

  // Define the image type
  type Image = {
    src: string;
    alt: string;
  };

  // Define your image paths directly
  let images: Image[] = [
    { src: '/image/A.jpg', alt: 'Image 1' },
    { src: '/image/B.jpg', alt: 'Image 2' },
    { src: '/image/C.jpg', alt: 'Image 3' }
  ];

  // Initialize the image variable (optional, not used now)
  let image: Image | undefined;
</script>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%; /* Ensure the body takes the full height of the viewport */
    overflow: hidden; /* Disable scrolling on the entire page */
  }

  .dashboard {
    display: grid;
    grid-template-areas:
      "summary calendar"
      "booking calendar";
    grid-template-columns: 3.5fr 2fr;
    grid-template-rows: auto 1fr;
    gap: 1rem;
    height: 100vh;
    padding: 1rem;
  }

  .box {
    background-color: #ECEBEB; /* White background for containers */
    border-radius: 0.5rem;
    padding: 1rem;
    height: 83%; /* Maintain original height */
  }

  .summary {
    grid-area: summary;
    padding-top: -3.8rem; /* Adjusted top padding */
    padding-right: 1rem;
    padding-bottom: 2rem;
    padding-left: 2rem;
    height: auto; /* Allow the height to adjust based on content */
    min-height: 270px; /* Set a minimum height to avoid collapsing */
    overflow: visible; /* Ensure overflow content is visible */
  }

  .carousel-text {
    margin-top: 1rem; /* Space between the carousel and the text */
  }

  .carousel-text h1 {
    font-size: 2rem; /* Set the font size for h1 */
    font-weight: bold; /* Optional: Makes the heading bold */
    text-align: left; /* Aligns h1 to the left */
  }

  .carousel-text p {
    text-align: justify; /* Justifies the paragraph text */
  }

  .carousel-text button {
    margin-top: 3rem; /* Space between paragraph and button */
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #ff6a00; /* Green background color */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .carousel-text button:hover {
    background-color: #e65b00; /* Darker green on hover */
  }

  .calendar {
    grid-area: calendar;
    padding: 2rem;
  }
</style>

<div class="dashboard">
<!-- Carousel directly in the .summary without the white box -->
<div class="summary">
  <Carousel {images} let:Indicators let:Controls>
    <Controls />
    <Indicators />
  </Carousel>

  <!-- Add h1 and p below the carousel -->
  <div class="carousel-text">
    <h1>Elizabeth's Apartment</h1>
    <p>
      Spacious and modern 4 bedroom apartment in SBMA, featuring a fully-equipped kitchen, air conditioning, and ample natural light. 
      Conveniently located near Ayala Malls. Ideal for professionals or small families.
    </p>
    <!-- Add a button aligned to the left -->
    <button>Book</button>
  </div>
</div>

<!-- Visible calendar div -->
<div class="box calendar"></div>
</div>