chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'message') {
    processMessage(message.text);
  }
});

function processMessage(message) {
  console.log(message);
  const el = document.createElement('h3')
  el.textContent = message;
  document.body.prepend(el);
  handleVoiceCommand(message);
}

const actions = {
  click: (elementText) => {
    const element = [...document.querySelectorAll("*")].find(
      (el) => el.textContent.trim().toLowerCase() === elementText.toLowerCase()
    );
    if (element) element.click();
  },
  scroll: (direction) => {
    window.scrollBy({
      top: direction === "down" ? 500 : -500,
      behavior: "smooth",
    });
  },
  search: (query) => {
    const searchBox = document.querySelector("input[type='search'], input[type='text']");
    if (searchBox) {
      searchBox.value = query;
      searchBox.dispatchEvent(new Event("input", { bubbles: true }));
    }
  },
};

const handleVoiceCommand = (command) => {
  command = command.trim().toLowerCase();

  // Define regex patterns
  const patterns = [
    { type: "click", regex: /^click (on )?(.*)$/ },
    { type: "scroll", regex: /^scroll (up|down)$/ },
    { type: "search", regex: /^search for (.+)$/ },
  ];

  // Match command to an action
  for (const { type, regex } of patterns) {
    const match = command.match(regex);
    if (match) {
      switch (type) {
        case "click":
          actions.click(match[2]);
          return;
        case "scroll":
          actions.scroll(match[1]);
          return;
        case "search":
          actions.search(match[1]);
          return;
      }
    }
  }

  // If no match, fallback to LLM
  sendToLLM(command);
};

const sendToLLM = async (query) => {
  console.log("sent to model");
  // const result = await geminiModel.process(query); // Replace with actual Gemini model API
  // if (result.action && actions[result.action]) {
  //   actions[result.action](result.data);
  // } else {
  //   console.error("Unrecognized command or action:", result);
  // }
};
