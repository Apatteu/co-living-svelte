<script>
  // Any Svelte logic can go here
</script>

<style>
/* Ensure the wrapper div takes full height */
.wrapper {
  height: 100%; /* Full height of the viewport */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent scrolling within the wrapper */
}

/* Centering the content */
.centered-div {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 100%; /* Take up the full height of the wrapper */
  text-align: center;
  flex-direction: column; /* Stack the content vertically */
  padding: 10px; /* Added padding to prevent content from touching screen edges */
}

/* Content styling */
.content {
  padding: 30px 20px 20px; /* Increased top padding for space */
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: keeps the shadow */
  width: 80%; /* Default width of content */
  max-width: 700px; /* Max width for larger screens */
  margin-top: 20px; /* Space between content sections */
  box-sizing: border-box; /* Ensures padding is included in the width */
}

/* Further reduce space above the first "About Us" div */
.centered-div > .content:first-of-type {
  margin-top: 5px; /* Reduce top margin further */
}

/* Further reduce space below the "Our Mission" div */
.centered-div > .content:last-of-type {
  margin-bottom: 0; /* Remove bottom margin completely */
}

/* Header styling */
h1 {
  font-size: 2rem; /* Adjust the font size of the heading */
  color: #333; /* Set a color for the heading */
  font-weight: bold; /* Make the h1 bold */
  margin-bottom: 10px; /* Space below the heading */
}

/* Paragraph styling */
p {
  color: #555; /* Adjust the color for the paragraph text */
  font-size: 1rem; /* Set a reasonable font size */
  line-height: 1.5; /* Improve readability */
  margin-bottom: 20px; /* Add space at the bottom of the paragraph */
}

/* Responsive adjustments for smaller screens (e.g., tablets and mobile phones) */
@media (max-width: 768px) {
  /* Adjust content width for smaller screens */
  .content {
    width: 90%; /* Content takes up 90% of the width on smaller screens */
  }
  h1 {
    font-size: 1.5rem; /* Adjust font size of h1 */
  }
  p {
    font-size: 0.9rem; /* Adjust font size for paragraphs */
  }
}

@media (max-width: 480px) {
  /* Further reduce content width for very small screens */
  .content {
    width: 95%; /* Content takes up 95% of the width on very small screens */
  }
  h1 {
    font-size: 1.3rem; /* Smaller font size for h1 */
  }
  p {
    font-size: 0.85rem; /* Smaller font size for paragraphs */
  }
}
</style>

<div class="wrapper">
  <div class="centered-div">
    <div class="content">
      <h1>About</h1>
      <p>We are your trusted platform for finding and renting apartments with ease and convenience. Whether you're searching for a cozy studio or a spacious family home, Apateu connects you with the best rental options to suit your needs.</p>
    </div>

    <!-- New content section (same size and styling) -->
    <div class="content">
      <h1>Our Mission</h1>
      <p>Our mission is to transform apartment renting into a seamless and enjoyable experience. We connect renters with their ideal homes and provide landlords with a reliable platform to find the right tenants. By focusing on simplicity, transparency, and innovative tools, we aim to eliminate the challenges of renting and create a trusted space where finding a home feels effortless and rewarding.</p>
    </div>
  </div>
</div>
