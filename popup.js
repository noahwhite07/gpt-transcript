console.log("This is a popup!");

document.getElementById("readHtmlButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id, { name: "popupToContent" });
    port.postMessage({ action: "readHtml" });

    port.onMessage.addListener((response) => {
      console.log("Response from content.js");
      console.log(response.html);
    });

    port.onDisconnect.addListener(() => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }
    });
  });
});
