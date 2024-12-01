const Fuse = require('fuse.js'); // Webpack will handle this

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

const findElement = (query) => {
  const elements = [...document.querySelectorAll("*")].map((el) => ({
    element: el,
    text: el.textContent.trim(),
    id: el.id,
    class: el.className,
    ariaLabel: el.getAttribute("aria-label"),
    tag: el.tagName.toLowerCase(),
  }));

  const fuse = new Fuse(elements, {
    keys: ["text", "id", "class"],
    threshold: 0.4, // Match tolerance
  });

  const result = fuse.search(query);
  return result.length ? result[0].item.element : null;
};

const actions = {
  click: (elementText) => {
    const element = findElement(elementText);
    if (element) {
      element.click();
    } else {
      console.warn("No element found for:", elementText);
      
    }
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
  open_in_new_tab: (url = null) => {
    window.open(url, "_blank");
  }
};

const handleVoiceCommand = (command) => {
  command = command.trim().toLowerCase();

  // Define regex patterns
  const patterns = [
    { type: "click", regex: /^click (on )?(.*)$/ },
    { type: "scroll", regex: /^scroll (up|down)$/ },
    { type: "search", regex: /^(search for|find) (.+)$/ },
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
