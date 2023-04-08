// Log a message to indicate the content script has been loaded
console.log("I'm a content script.");

// Listen for connections from the popup script
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popupToContent") {
    // Listen for messages from the popup script
    port.onMessage.addListener((request) => {

      console.log("Message from popup.js");

      // Check if the action is to export the transcript
      if (request.action === "exportTranscript") {
        // Define class names for the outer divs corresponding to each user
        const user1ClassName = "group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800";
        const user2ClassName = "group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]";

        // Get all outer divs for both users
        const user1OuterDivs = Array.from(document.getElementsByClassName(user1ClassName));
        const user2OuterDivs = Array.from(document.getElementsByClassName(user2ClassName));

        // Function to extract the inner text from a given element
        const extractInnerText = (element) => {
          const innerDiv = element.querySelector('[class="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap"]');
          return innerDiv ? innerDiv.innerText.trim() : '';
        };

        // Get all outer divs for both users using a combined selector
        const allOuterDivs = document.querySelectorAll('[class="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800"], [class="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]"]');

        // Extract messages and associated users from the outer divs
        const messages = Array.from(allOuterDivs).map((element) => {
          const user = element.classList.contains('dark:bg-gray-800') ? "Me" : "GPT";
          return { user, text: extractInnerText(element) };
        });

        // Format the messages with user labels
        const formattedMessages = messages.map((message) => `${message.user}: "${message.text}"`).join('\n\n');

        // Download the formatted messages as a text file
        downloadTextFile('transcript.txt', formattedMessages);

        // Send the formatted messages back to the popup script
        port.postMessage({ html: formattedMessages });
      }
    });
  }
});

// Function to download a text file with the given filename and text content
function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = filename;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
