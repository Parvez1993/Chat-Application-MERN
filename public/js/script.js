const socket = io()


// Handle incoming text messages
socket.on("message", (message) => {
    console.log("New message:", message);

    const messagesContainer = document.getElementById("messages");
    if (!messagesContainer) {
        console.error("Missing #messages container in HTML");
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
});

// Handle location messages
socket.on("locationMessage", (locationData) => {
    console.log("Location shared:", locationData);

    // Create a message element for the DOM
    const messageElement = document.createElement('div');
    messageElement.className = 'message';

    // Create a clickable link
    const link = document.createElement('a');
    link.href = locationData.url;
    link.textContent = 'My current location';
    link.target = '_blank'; // Open in new tab

    // Add the link to the message element
    messageElement.appendChild(link);

    // Add the message to your messages container
    document.getElementById('messages').appendChild(messageElement);
});



const sendLocationBtn = document.getElementById('send-location');

// Handle form submission
document.getElementById("message-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    const message = document.getElementById("message-input").value.trim();
    if (message !== "") {
        socket.emit("newMessage", message); // Emit message to server
        document.getElementById("message-input").value = ""; // Clear input
    }
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
            // Re-enable the button
            sendLocationBtn.removeAttribute('disabled');
            sendLocationBtn.textContent = 'Send location';

            socket.emit("shareLocation", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        },
        (error) => {
            // Re-enable the button
            sendLocationBtn.removeAttribute('disabled');
            sendLocationBtn.textContent = 'Send location';

            alert("Unable to fetch location: " + error.message);
        }
    );
});