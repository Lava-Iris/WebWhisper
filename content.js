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

const findElement = (query, clickable = false) => {
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
  if (clickable) {
    for (const { item } of result) {
      if (item.element instanceof HTMLElement && item.element.click) {
        return item.element;
      }
    }
    return null;
  }
  return result.length ? result[0].item.element : null;

  // return elements.find((el) => el.text.toLowerCase().includes(query.toLowerCase()));
};

const actions = {
  click: (elementText) => {
    const element = findElement(elementText, clickable = true);
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
  open_in_new_tab: (url = null) => {
    window.open(url, "_blank");
  },
  type: (text, area = null) => {
    if (area) {
      findElement(area).value = text;
    } else if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
      document.activeElement.value = text;
    } else {
      const el = findElement("input") || findElement("textarea");
      if (el) el.value = text;
    }
  }
};

const handleVoiceCommand = (command) => {
  command = command.trim().toLowerCase();

  // Define regex patterns
  const patterns = [
    { type: "click", regex: /^click (on )?(.*)$/ },
    { type: "scroll", regex: /^scroll (up|down|to the (top|bottom))$/ },
    { type: "type", regex: /^((type|write)\s+(.+?)\s+in\s+(.+)|(type|write)\s+(.+))$/ },
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
          actions.scroll(match[-1]);
          return;
        case "type":
          if (match3) {
            actions.type(match[3], match[4]);
          } else {
            actions.type(match[6]);
          }
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
  prompt_template = `
  You are an assistant capable of controlling web page elements through simple commands. Your task is to interpret 
  a user's command and map it to actions on the page. The input can have some spelling errors or be incomplete.

  User Command: "${query}"

  Your response should be a list of the tuples of actions and corresponding input. The actions and their inputs are as follows:
  1. 'click': name of the element to click on (with fuzzy search)
  2. 'scroll': 'up', 'down', 'top', 'bottom'
  3. 'open_in_new_tab': URL to open in a new tab (if the input is empty, it opens  blank new tab)
  4. 'type': text to type in the active input field (if no input field is active, find the first input field and type in it)

  Please respond only with the action and the target element, or state if no matching action is possible.

  For example: 
  Input: "Scroll up and click on q n a"
  Output: "[(scroll, up), (click, q&a)]"

  Input: "find cats and go down to the bottom"
  Output: "[(click, search), (type, cats), (scroll, bottom)]"

  Input: "dance"
  Output: "No matching action found, please try again."

  Input: "open google in a new tab"
  Output: "[(open_in_new_tab, https://www.google.com)]"
  `;
  console.log(prompt_template);

  if (available !== "no") {
    const session = await ai.languageModel.create();
    console.log("created session");
  
    // Prompt the model and wait for the whole result to come back.  
    const result = await session.prompt(prompt_template);
    console.log(result);
  }
  
  const result = await geminiModel.process(query); // Replace with actual Gemini model API
  if (result.action && actions[result.action]) {
    actions[result.action](result.data);
  } else {
    console.error("Unrecognized command or action:", result);
  }
};
