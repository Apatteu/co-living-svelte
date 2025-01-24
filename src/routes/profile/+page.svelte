<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let firstName = "";
  let lastName = "";
  let email = "";
  let phone = "";
  let bio = "";
  let avatarUrl: string | null = null;

  function saveProfile(event: Event) {
    event.preventDefault();
    if (firstName && lastName && email && phone) {
      console.log({ firstName, lastName, email, phone, bio, avatarUrl });
      alert("Profile saved!");
    } else {
      alert("Please fill out all required fields.");
    }
  }

  function handleAvatarChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        avatarUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  function triggerFileInput(): void {
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.click();
    }
  }

  function handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      triggerFileInput();
    }
  }

  const defaultAvatarUrl = './image/avatar.jpg';

  // Lock scrolling when this page is active
  onMount(() => {
    document.body.style.overflow = 'hidden';
  });

  // Restore scrolling when leaving this page
  onDestroy(() => {
    document.body.style.overflow = '';
  });
</script>

<style>
  .page-container {
    height: 100vh; /* Full viewport height */
    overflow: hidden; /* Prevent scrolling */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .profile-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px; /* Reduced gap for better fit */
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 12px;
    flex-wrap: wrap;
    background-color: transparent;
    box-shadow: none;
    height: 100%; /* Fill the container */
  }

  .form-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 700px;
    background-color: transparent;
    padding: 10px 20px;
    margin-top: 0;
    border-radius: 8px;
    box-shadow: none;
  }

  .avatar {
    width: 330px;
    height: 330px;
    background-color: #dcdcdc;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border: 2px solid #ccc;
  }

  .avatar:hover {
    background-color: #bbb;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
    font-size: 2rem;
  }

  .form-group {
    display: flex;
    gap: 20px;
    width: 100%;
  }

  .form-group input {
    flex-grow: 1;
  }

  label {
    font-size: 0.9rem;
    margin-bottom: 5px;
    display: block;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.85rem;
  }

  textarea {
    resize: none;
  }

  button {
    background-color: #ff6700;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #e55a00;
  }

  .email-phone-group {
    display: flex;
    gap: 20px;
  }

  .form-section button {
    align-self: flex-end;
  }

  /* Mobile responsiveness adjustments */
  @media (max-width: 768px) {
    .profile-container {
      flex-direction: column;
      gap: 20px;
      padding: 20px;
    }

    .avatar {
      width: 200px; /* Reduced avatar size */
      height: 200px;
    }

    .form-section {
      width: 100%;
      max-width: 100%; /* Full width on smaller screens */
      padding: 10px;
    }

    .form-group {
      flex-direction: column; /* Stack form fields vertically */
      gap: 15px;
    }

    label {
      font-size: 1rem; /* Slightly larger text for readability */
    }

    input,
    textarea {
      font-size: 1rem; /* Adjusted input font size */
    }

    button {
      width: 100%; /* Full-width button on mobile */
    }
  }

  /* Adjustments for very small screens (e.g., under 500px) */
  @media (max-width: 480px) {
    .avatar {
      width: 150px; /* Even smaller avatar */
      height: 150px;
    }

    h2 {
      font-size: 1.5rem; /* Smaller heading */
    }

    .form-group input {
      padding: 8px; /* Slightly smaller input padding */
    }

    .form-section button {
      padding: 12px 16px; /* Larger button padding */
    }
  }
</style>

<div class="page-container">
  <div class="profile-container">
    <div
      class="avatar"
      style="background-image: url({avatarUrl ?? defaultAvatarUrl})"
      role="button"
      aria-label="Upload avatar"
      tabindex="0"
      on:click={triggerFileInput}
      on:keydown={handleKeyboardEvent}
    >
      <input
        type="file"
        id="avatar-upload"
        accept="image/*"
        style="display: none"
        on:change={handleAvatarChange}
      />
    </div>

    <form class="form-section" on:submit={saveProfile}>
      <h2>Your Profile</h2>
      <div class="form-group">
        <div>
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" bind:value={firstName} placeholder="Enter first name" required />
        </div>
        <div>
          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" bind:value={lastName} placeholder="Enter last name" required />
        </div>
      </div>

      <div class="email-phone-group">
        <div>
          <label for="email">Email Address</label>
          <input id="email" type="email" bind:value={email} placeholder="example@gmail.com" required />
        </div>
        <div>
          <label for="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            bind:value={phone}
            placeholder="Enter phone number"
            required
            minlength="11"
            on:input={(e: Event) => {
              const input = e.target as HTMLInputElement;
              phone = input.value.replace(/[^0-9]/g, ''); 
              input.value = phone; 
            }}
          />
        </div>
      </div>

      <div>
        <label for="bio">Bio</label>
        <textarea id="bio" rows="4" bind:value={bio} placeholder="Write text here..."></textarea>
      </div>

      <button type="submit">Save</button>
    </form>
  </div>
</div>
