// Log a message to indicate the popup script has been loaded
console.log("This is a popup!");

// Add a click event listener for the "Read HTML" button
document.getElementById("readHtmlButton").addEventListener("click", () => {
  // Query the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Establish a connection to the content script in the active tab
    const port = chrome.tabs.connect(tabs[0].id, { name: "popupToContent" });

    // Send a message to the content script with the "exportTranscript" action
    port.postMessage({ action: "exportTranscript" });

    // Listen for messages from the content script
    port.onMessage.addListener((response) => {
      console.log("Response from content.js");
      console.log(response.html);
    });

    // Handle disconnect events and log any errors
    port.onDisconnect.addListener(() => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }
    });
  });
});
