// Initialize socket connection


const socket = io();

// Handle incoming text messages
socket.on("message", (message) => {
    console.log("New message:", message);

    const messagesContainer = document.getElementById("messages");
    if (!messagesContainer) {
        console.error("Missing #messages container in HTML");
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.textContent = message.text;

    // Add timestamp if needed
    const timeElement = document.createElement("span");
    timeElement.className = "timestamp";
    timeElement.textContent = moment(message.created).format('h:mm A');
    messageElement.appendChild(document.createElement("br"));
    messageElement.appendChild(timeElement);

    messagesContainer.appendChild(messageElement);

    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Handle location messages
socket.on("locationMessage", (locationData) => {
    console.log("Location shared:", locationData);

    const messagesContainer = document.getElementById("messages");
    if (!messagesContainer) {
        console.error("Missing #messages container in HTML");
        return;
    }

    // Create a message element for the DOM
    const messageElement = document.createElement('div');
    messageElement.className = 'message location-message';

    // Create a clickable link
    const link = document.createElement('a');
    link.href = locationData.url;
    link.textContent = 'My current location';
    link.target = '_blank'; // Open in new tab

    // Add the link to the message element
    messageElement.appendChild(link);

    // Add timestamp if needed
    if (locationData.created) {
        const timeElement = document.createElement("span");
        timeElement.className = "timestamp";
        timeElement.textContent =moment(locationData.created).format('h:mm A');
        messageElement.appendChild(document.createElement("br"));
        messageElement.appendChild(timeElement);
    }

    // Add the message to your messages container
    messagesContainer.appendChild(messageElement);

    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Get DOM elements
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const sendLocationBtn = document.getElementById('send-location');

// Make sure all elements exist
if (!messageForm || !messageInput || !sendLocationBtn) {
    console.error("Missing required DOM elements");
} else {
    // Handle form submission
    messageForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Prevent page reload

        // Disable the form during submission
        const submitBtn = messageForm.querySelector("button");
        if (submitBtn) submitBtn.setAttribute('disabled', 'disabled');

        const message = messageInput.value.trim();
        if (message !== "") {
            socket.emit("newMessage", message); // Emit message to server

            // Clear input and re-enable form
            messageInput.value = "";
            messageInput.focus();
        }

        // Re-enable the button
        if (submitBtn) submitBtn.removeAttribute('disabled');
    });

    // Send location button handler
    sendLocationBtn.addEventListener("click", () => {
        if (!navigator.geolocation) {
            return alert("Geolocation is not supported by your browser");
        }

        // Disable the button during location retrieval
        sendLocationBtn.setAttribute('disabled', 'disabled');
        sendLocationBtn.textContent = 'Sending location...';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Send location data to server
                socket.emit("shareLocation", {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                // Re-enable the button
                sendLocationBtn.removeAttribute('disabled');
                sendLocationBtn.textContent = 'Send location';
            },
            (error) => {
                // Re-enable the button
                sendLocationBtn.removeAttribute('disabled');
                sendLocationBtn.textContent = 'Send location';
                alert("Unable to fetch location: " + error.message);
            }
        );
    });
}