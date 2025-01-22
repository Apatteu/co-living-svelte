<script lang="ts">
  import { onMount } from 'svelte';

  // Define types for year, month, day
  let currentDate: Date = new Date();
  let currentYear: number = currentDate.getFullYear();
  let currentMonth: number = currentDate.getMonth(); // 0 = January, 1 = February, ...
  let activeDate: number = currentDate.getDate(); // Default active date to today's date

  // Define the structure of the calendar
  type CalendarRow = (number | null)[]; 
  type CalendarDates = CalendarRow[];

  function getCalendarDates(year: number, month: number): CalendarDates {
      const firstDay: Date = new Date(year, month, 1);
      const lastDay: Date = new Date(year, month + 1, 0);
      const daysInMonth: number = lastDay.getDate();
      const startingDay: number = firstDay.getDay(); // 0 - Sunday, 1 - Monday, ...

      let calendar: CalendarDates = [];
      let row: (number | null)[] = [];

      for (let i = 0; i < startingDay; i++) {
          row.push(null);
      }

      for (let i = 1; i <= daysInMonth; i++) {
          row.push(i);
          if (row.length === 7) {
              calendar.push(row);
              row = [];
          }
      }

      while (row.length < 7) {
          row.push(null);
      }
      calendar.push(row);

      return calendar;
  }

  function previousMonth(): void {
      if (currentMonth === 0) {
          currentMonth = 11;
          currentYear--;
      } else {
          currentMonth--;
      }
      updateCalendar();
  }

  function nextMonth(): void {
      if (currentMonth === 11) {
          currentMonth = 0;
          currentYear++;
      } else {
          currentMonth++;
      }
      updateCalendar();
  }

  function updateCalendar(): void {
      calendarDates = getCalendarDates(currentYear, currentMonth);
      monthTitle = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;
  }

  function selectDate(day: number | null): void {
      if (day !== null) {
          activeDate = day;
      }
  }

  let calendarDates: CalendarDates = getCalendarDates(currentYear, currentMonth);
  let monthTitle: string = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;

  onMount(() => {
      updateCalendar();
  });
</script>

<style>
  :global(html, body) {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: Arial, sans-serif;
      background-color: #DBDBDB;
  }

  h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
  }

  .dashboard {
      display: grid;
      grid-template-areas:
          "notifications my-rent"
          "maintenance my-rent";
      grid-template-columns: 3fr 1.5fr;
      grid-template-rows: auto 1fr;
      gap: 1rem;
      height: 100vh;
      padding: 1rem;
  }

  .box {
      background-color: #ECEBEB;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  }

  .notifications {
      grid-area: notifications;
      padding: 1.5rem;
  }

  .maintenance {
      grid-area: maintenance;
      padding: 1.5rem;
  }

  .my-rent {
      grid-area: my-rent;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
  }

  .calendar-container {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  }

  .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
  }

  .calendar-header button {
      background-color: transparent;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: #333;
  }

  .calendar-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
  }

  .visual-calendar {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      text-align: center;
  }

  .visual-calendar th,
  .visual-calendar td {
      border: 1px solid #ddd;
      padding: 8px;
      width: 14%;
  }

  .visual-calendar th {
      background-color: #f4f4f4;
  }

  .visual-calendar td {
      background-color: #fff;
      cursor: pointer;
  }

  .visual-calendar td.active {
      background-color: #FF6600;
      color: white;
      font-weight: bold;
  }

  table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
  }

  table td,
  table th {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
  }

  table th {
      background-color: #f4f4f4;
  }

  /* Notifications Styling */
  .notifications ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
  }

  .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f4f4f4;
      padding: 0.5rem;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
  }

  .notification-date {
      font-size: 0.9rem;
      color: #666;
      white-space: nowrap;
  }

  /* Request Maintenance Styling */
  .form-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
  }

  .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .label {
      font-weight: bold;
      margin-right: 1rem;
  }

  .input {
      flex-grow: 1;
      padding: 0.3rem;
      background-color: #FFFFFF;
      border: 1px solid #ECEBEB;
      border-radius: 0.25rem;
      height: 2rem;
      display: flex;
      align-items: center;
  }

  .input span {
      display: block;
      padding: 0.5rem;
      line-height: 1.5;
  }

  textarea {
      width: 100%;
      height: 10rem;
      padding: 0.5rem;
      border: 1px solid #ECEBEB;
      border-radius: 0.25rem;
      resize: none;
  }

  button {
      align-self: flex-end;
      background-color: #FF6600;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
  }

  button:hover {
      background-color: #FF5500;
  }
/* Remove default blue outline and apply custom border color on focus for textarea */
textarea:focus {
  outline: none !important; /* Ensure outline is removed */
  box-shadow: none !important; /* Remove any box-shadow */
  border: 0.1rem solid #FF6600; /* Orange border with rem unit for focus */
}

</style>

<div class="dashboard">
  <div class="box notifications">
      <h2>Notification</h2>
      <ul>
          <li class="notification-item">
              <span>Your request is now being processed by the landlord.</span>
              <span class="notification-date">Dec 17, 2024</span>
          </li>
          <li class="notification-item">
              <span>Your request is now being processed by the landlord.</span>
              <span class="notification-date">Dec 17, 2024</span>
          </li>
          <li class="notification-item">
              <span>Congratulations! Your booking has been approved by the landlord.</span>
              <span class="notification-date">Aug 06, 2024</span>
          </li>
      </ul>
  </div>

  <div class="box maintenance">
      <h2>Request Maintenance</h2>
      <div class="form-container">
          <div class="row">
              <div class="label">To:</div>
              <div class="input"><span>Landlord</span></div>
          </div>
          <div class="row">
              <div class="label">Date:</div>
              <div class="input"><span>{currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
          </div>
          <div class="row">
              <div class="label">Unit:</div>
              <div class="input"><span>Unit 101</span></div>
          </div>
          <textarea placeholder="Write your request here..."></textarea>
          <button type="submit">Send</button>
      </div>
  </div>

  <div class="box my-rent">
      <h2>My Rent</h2>
      <div class="calendar-container">
          <div class="calendar-header">
              <button on:click="{previousMonth}">&lt;</button>
              <div class="calendar-title">{monthTitle}</div>
              <button on:click="{nextMonth}">&gt;</button>
          </div>
          <table class="visual-calendar">
              <thead>
                  <tr>
                      <th>Sun</th>
                      <th>Mon</th>
                      <th>Tue</th>
                      <th>Wed</th>
                      <th>Thu</th>
                      <th>Fri</th>
                      <th>Sat</th>
                  </tr>
              </thead>
              <tbody>
                  {#each calendarDates as row}
                      <tr>
                          {#each row as day}
                          <td
                          class="{day !== null && day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() ? 'active' : ''}"
                          on:click={() => selectDate(day)}
                      >
                          {day || ''} 
                      </td>
                          {/each}
                      </tr>
                  {/each}
              </tbody>
          </table>
      </div>
      <table>
          <thead>
              <tr>
                  <th>Date</th>
                  <th>Details</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>December 1, 2024</td>
                  <td>Payment Due</td>
              </tr>
              <tr>
                  <td>December 5, 2024</td>
                  <td>Late Fee Charged</td>
              </tr>
          </tbody>
      </table>
  </div>
</div>