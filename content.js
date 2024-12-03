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
    keys: ["text", "id", "class", "ariaLabel", "tag"],
    threshold: 0.6, // Match tolerance
    isCaseSensitive: false,
  });

  const result = fuse.search(query);
  console.log(result);
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
      top: direction === "down" ? 500 : direction == "up" ? -500 : direction == "top" ? -window.scrollY : window.scrollY,
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
  const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();
  console.log("sent to model");
  prompt = ```
  You are an assistant capable of controlling web page elements through simple commands. Your task is to interpret 
  a user's command and map it to actions on the page. The input can have some spelling errors or be incomplete.

  User Command: "${query}"

  Your response should be a list of the tuples of actions and corresponding input. The actions are as follows:
  1. 'click': name of the element to click on (with fuzzy search)
  2. 'scroll': 'up', 'down', 'top', 'bottom'
  3. 'search': search query to input into the search bar

  Please respond only with the action and the target element, or state if no matching action is possible.

  For example: 
  Input: "Scroll up and click on q n a"
  Output: "[(scroll, up), (click, q&a)]"

  Input: "find cats and go down to the bottom"
  Output: "[(search, cats), (scroll, bottom)]"

  Input: "dance"
  Output: "No matching action found"

  ```
  console.log(prompt);

  if (available !== "no") {
    const session = await ai.languageModel.create();
    console.log("created session");
  
    // Prompt the model and wait for the whole result to come back.  
    const result = await session.prompt(prompt);
    console.log(result);
  }
  
  
  // const result = await geminiModel.process(query); // Replace with actual Gemini model API
  // if (result.action && actions[result.action]) {
  //   actions[result.action](result.data);
  // } else {
  //   console.error("Unrecognized command or action:", result);
  // }
};
