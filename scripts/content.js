console.log("I'm a content script.");

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popupToContent") {
        port.onMessage.addListener((request) => {

            console.log("Message from popup.js");
            if (request.action === "readHtml") {
                const user1ClassName = "group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800";
                const user2ClassName = "group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]";

                const user1OuterDivs = Array.from(document.getElementsByClassName(user1ClassName));
                const user2OuterDivs = Array.from(document.getElementsByClassName(user2ClassName));

                const extractInnerText = (element) => {
                    const innerDiv = element.querySelector('[class="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap"]');
                    return innerDiv ? innerDiv.innerText.trim() : '';
                };

                const allOuterDivs = document.querySelectorAll('[class="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800"], [class="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]"]');

                const messages = Array.from(allOuterDivs).map((element) => {
                    const user = element.classList.contains('dark:bg-gray-800') ? "Me" : "GPT";
                    return { user, text: extractInnerText(element) };
                });

                const formattedMessages = messages.map((message) => `${message.user}: "${message.text}"`).join('\n\n');

                downloadTextFile('transcript.txt', formattedMessages);
                port.postMessage({ html: formattedMessages });
            }
        });
    }
});

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
