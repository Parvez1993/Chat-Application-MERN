const socket = io()

// Update the counter when received from the server
socket.on("countUpdated", (count) => {
    document.getElementById("counter").textContent = count;
});

// Send an "increment" event when the button is clicked
document.getElementById("increment-btn").addEventListener("click", () => {
    socket.emit("increment");
});


document.getElementById("decrement-btn").addEventListener("click", () => {
    socket.emit("decrement");
});
