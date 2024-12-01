# WEB WHISPER

a powerful Chrome extension designed to make web navigation 🧭 hands-free and intuitive. With just your voice, you can open tabs, scroll through pages, click links, and even search the web—no need to lift a finger. Perfect for multitaskers, people with accessibility needs, or anyone looking for a more efficient and futuristic way to browse.. But the page cannot open anymore so that is why I have moved it here.

## Key Features 

1. Voice Command Recognition:
    * Integration with a speech recognition library like Google Web Speech API or a custom solution.
    * Real-time transcription of speech into text to identify commands.
    * Ability to recognize common web navigation commands, such as "go back," "scroll down," "click on link," etc.
2. Customizable Commands:
    * Users can define custom voice commands for specific actions (e.g., "open news," "show menu").
    * Integration with a user-friendly settings page to add, modify, or remove commands.
3. Web Page Navigation:
    * Basic Navigation: Support for commands like "go back," "go forward," "reload," "open new tab," "close tab," and "open URL."
    * Scrolling: Commands like "scroll up," "scroll down," "scroll left," "scroll right," and "scroll to top."
    * Link/Element Interaction: Allow the user to select links, buttons, or other interactive elements using commands like "click on the first link," "press button," "go to settings," etc.
4. Voice Feedback:
    * Text-to-speech feedback (using SpeechSynthesis API) for confirming actions and providing contextual information.
    * Provide feedback for successful or unsuccessful actions (e.g., "Page reloaded," "Link not found").
5. Accessibility Features:
    * High contrast, larger font support for visually impaired users.
    * Option for controlling volume or changing speech speed.
6. Command List and Help:
    * A voice-activated help system that lists available commands.
    * Users can say “What can I say?” or “Help” to receive a list of recognized commands.
7. Multilingual Support:
    * Integration with language models to support multiple languages, allowing commands to be spoken in different languages.
8. Privacy and Security:
    * Ensure that no personal data (such as voice recordings) is stored or shared without the user's consent.
    * Ensure that the voice recognition process is performed locally, without sending data to external servers unless necessary.

### Workflow

1. Installation & Setup
* Users install the extension from the Chrome Web Store.
* During the first launch, the user is prompted to grant permissions for microphone access.
* Users can access settings to customize voice commands, language preferences, and other accessibility options.
2. Activating Voice Control
* The user activates voice control via a click on the extension icon or a voice command like "Hey, Google."
* The extension begins listening for commands through the microphone.
3. Processing Voice Commands
* Speech is transcribed into text using a speech recognition engine (e.g., the Google Web Speech API).
* The extension processes the transcription and matches it to predefined voice commands.
* Contextual analysis is performed to determine what part of the web page the command applies to (e.g., selecting a link, scrolling, etc.).
4. Executing Actions
* Based on the recognized command, the extension triggers the appropriate browser action:
    * Navigation commands (back, forward, reload) control the browser's history.
    * Scrolling commands (scroll up, scroll down) adjust the page's scroll position.
    * Interaction commands (click on a link, submit a form) simulate user actions on the page.
    * Accessibility adjustments can be made (e.g., enlarging text, changing contrast).
5. Providing Feedback
* After executing a command, the extension can provide audio or visual feedback to confirm the action (e.g., "The page has reloaded").
* If an action could not be performed, feedback is provided (e.g., “I couldn’t find that link”).
6. Ongoing Voice Interaction
* The extension remains active, continuously listening for new commands as long as the user hasn’t deactivated it.
* Users can interrupt the ongoing command processing by saying “Stop listening” or clicking on the extension icon.
7. Settings & Customization
* Users can customize the voice commands and their corresponding actions via the settings menu.
* Commands can be added or removed, and the user can set preferences for voice speed, volume, and language.
8. Exit
* The user can deactivate voice control by saying “Stop listening” or clicking on the extension icon again.
* The extension stops listening and provides a confirmation

## Use Cases

1. Search the Web
* Use Case: Performing a web search using voice commands.
    * Actors: User, Voice-Controlled Chrome Extension, Web Browser, Search Engine
    * Description: The user says something like, "Search for [query]" or "Find [topic]" and the extension automatically opens a search engine with the query.
    * Example: "Search for how to bake a cake" performs a Google search for the recipe.
2. Open/Close Incognito Mode
* Use Case: Managing browser modes with voice.
    * Actors: User, Voice-Controlled Chrome Extension, Web Browser
    * Description: The user can say, "Open incognito mode" to open a new incognito window, or "Close incognito window" to exit incognito mode.
    * Example: "Open incognito mode" launches a private browsing window.
3. Highlighting Text
* Use Case: Highlighting text or selecting a portion of text on a webpage.
    * Actors: User, Voice-Controlled Chrome Extension, Web Browser
    * Description: The user can say, "Highlight [text]" to select specific text for further actions such as copying, sharing, or searching.
    * Example: "Highlight the title" selects the title of the webpage.
4. Control Media Playback
* Use Case: Controlling audio or video playback on websites like YouTube, Netflix, or music streaming services.
    * Actors: User, Voice-Controlled Chrome Extension, Web Browser, Media Player
    * Description: The user can issue voice commands to control media playback, such as "Play," "Pause," "Next," "Previous," "Mute," or "Unmute."
    * Example: "Play" resumes the video; "Next" skips to the next video or song.
5. Form Filling
* Use Case: Filling out online forms using voice commands.
    * Actors: User, Voice-Controlled Chrome Extension, Web Browser
    * Description: The user can say, "Fill in my name," "Enter my email," or "Submit the form" to complete fields in a form.
    * Example: "Fill in my name" autofills the name field of an online form with the user's saved information.
6. Bookmark Management
* Use Case: Adding or managing bookmarks via voice.
    * Actors: User, Voice-Controlled Chrome Extension, Web Browser
    * Description: The user can say, "Bookmark this page," "Add to favorites," or "Show my bookmarks" to manage their browsing bookmarks.
    * Example: "Bookmark this page" saves the current webpage to the user's bookmark list.

## User Stories

1. Voice Navigation for Web Pages
* As a user, I want to navigate through web pages using voice commands so that I can browse the internet without needing to use a mouse or keyboard.
* Acceptance Criteria:
    * The extension listens to predefined voice commands, such as "next page," "previous page," or "scroll down."
    * The web page responds to commands with smooth transitions and actions.
    * The extension supports voice commands for navigation buttons (e.g., "click home," "open settings").
2. Voice Command for Opening Links
* As a user, I want to be able to open links on a page using voice commands so that I can easily access additional content without using a mouse.
* Acceptance Criteria:
    * The extension listens for commands like "click [link name]" or "open [link description]."
    * The system identifies links based on the spoken text and opens the correct page.
3. Voice Commands for Page Actions (e.g., Submit, Cancel)
* As a user, I want to perform page actions like submitting forms or cancelling actions using voice commands.
* Acceptance Criteria:
    * The extension allows voice commands for interacting with page buttons such as "submit," "cancel," or "save."
    * Confirmation of the action should be provided (e.g., "Form submitted").
4. Customizable Voice Command Settings
* As a user, I want to customize voice commands to fit my preferences or language so that the experience is more personalized.
* Acceptance Criteria:
    * The user can add or modify voice commands through a settings menu.
    * Custom commands should be stored and work seamlessly.
5. Voice Command for Page Refresh
* As a user, I want to refresh the webpage using a voice command, allowing for easy reloading without manually clicking the refresh button.
* Acceptance Criteria:
    * The user can say "refresh page" to reload the current web page.
6. Voice Command for Browser Tabs Management
* As a user, I want to switch between tabs, open new tabs, or close tabs using voice commands so that I can manage my browsing experience hands-free.
* Acceptance Criteria:
    * Commands like "switch to tab 1," "close tab," or "open new tab" should work as expected.
    * The extension can identify open tabs by their titles and allow switching between them via voice.
7. Multilingual Voice Support
* As a user, I want to use the extension in my preferred language so that I can navigate the web in the language that is most comfortable for me.
* Acceptance Criteria:
    * The extension should support multiple languages (e.g., English, Spanish, French) for voice commands.
    * Users should be able to switch language settings from the extension’s settings page.
8. Privacy and Data Security for Voice Commands
* As a user, I want to ensure that my voice data is secure and not stored or misused by the extension.
* Acceptance Criteria:
    * The extension should not record or save any voice data unless explicitly allowed by the user.
    * Users should be able to review and delete any voice command history stored locally.


## Deployment

Add additional notes to deploy this on a live system

## Built With

  - [Contributor Covenant](https://www.contributor-covenant.org/) - Used
    for the Code of Conduct
  - [Creative Commons](https://creativecommons.org/) - Used to choose
    the license

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning. For the versions
available, see the [tags on this
repository](https://github.com/PurpleBooth/a-good-readme-template/tags).

## Authors

  - **Kirti Khatri** - *Provided README Template* -
    [sushi-ki](https://github.com/sushi-ki)

    - **Lavanya Mishra** - *Provided README Template* -
    [Lava-Iris](https://github.com/Lava-Iris)

    - **Somya Tomar** - *Provided README Template* -
    [Lava-Iris](https://github.com/Lava-Iris)


## License

This project is licensed under the [CC0 1.0 Universal](LICENSE.md)
Creative Commons License - see the [LICENSE.md](LICENSE.md) file for
details

## Acknowledgments

  - Hat tip to anyone whose code is used
  - Inspiration
  - etc


