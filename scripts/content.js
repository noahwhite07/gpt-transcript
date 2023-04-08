console.log("I'm a content script.");

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "readHtml") {
//       const html = document.documentElement.innerHTML;
//       sendResponse({ html: html });
//     }
//   });
  
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "readHtml") {
//       const className = "min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap";
//       const elements = Array.from(document.getElementsByClassName(className));
  
//       const innerHtmlList = [];
//       elements.forEach((element) => {
//         innerHtmlList.push(element.innerHTML);
//       });
  
//       sendResponse({ html: innerHtmlList.join('\n\n') });
//     }
//   });
  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if (request.action === "readHtml") {
    const className = "min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap";
    const elements = Array.from(document.getElementsByClassName(className));

    const textList = [];
    elements.forEach((element) => {
    textList.push(element.innerText.trim());
    });

    sendResponse({ html: textList.join('\n\n') });
}
});