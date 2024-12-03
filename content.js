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

const findElementHeuristically = (query) => {
  const candidates = document.querySelectorAll("button, a, input, textarea, [aria-label]");
  for (const element of candidates) {
    const label = element.textContent || element.getAttribute("aria-label") || element.placeholder;
    if (label && label.toLowerCase().includes(query.toLowerCase())) {
      return element;
    }
  }
  return null;
};


const actions = {
  click: (elementText) => {
    const element = findElement(elementText, true) || findElementHeuristically(elementText);
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
      (findElement(area) || findElementHeuristically(area)).value = text;
    } else if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
      document.activeElement.value = text;
    } else {
      const el = findElement("input") || findElement("textarea") || findElement("div[contenteditable]");
      if (el) el.value = text;
    }
  }
};

const handleVoiceCommand = (command) => {
  command = command.trim().toLowerCase();

  // Define regex patterns
  const patterns = [
    { type: "click", regex: /^(click (on )?|go (to)?)(.*)$/ },
    { type: "scroll", regex: /^scroll (up|down|to the (top|bottom))$/ },
    { type: "type", regex: /^((type|write)\s+(.+?)\s+in\s+(.+)|(type|write)\s+(.+))$/ },
  ];

  // Match command to an action
  for (const { type, regex } of patterns) {
    const match = command.match(regex);
    if (match) {
      switch (type) {
        case "click":
          actions.click(match[4]);
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
  const prompt_template = `
  You are an assistant capable of controlling web page elements through simple commands. Your task is to interpret 
  a user's command and map it to actions on the page. The input can have some spelling errors or be incomplete.

  User Command: "${query}"

  Your response should be a list of the tuples of actions and corresponding input. The actions and their inputs are as follows:
  1. (click, text): where text is used to search for the relevant element to click on based on element text or id (with fuzzy search)
  2. (scroll, direction): directions can be 'up', 'down', 'top' or 'bottom'
  3. (open_in_new_tab, url): url (optional) is the url to open in a new tab (if url is empty, it opens a blank new tab)
  4. (type, text, element): element is optional and is used to find the element to type in. If no element is selected, it types the
   text in the active input field (if no input field is active, it finds the first input field and types in it)

  Please respond only with the action and the inputs, or state if no matching action is possible.

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
