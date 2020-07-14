# Prioritizer
Tool that helps you get your priorities straight!

Live at https://frontendlane.github.io/prioritizer/

## Project goals
### end goals
- a tool the helps direct effort toward more important goals
- a tool that removes cognitive burden of deciding which conflicting goal is more important during development

### intermediary goals
- high quality code 5
- practice TypeScript 5
- learn Node.js basics 3
- learn/practice accessibility solutions 1
- learn to support no-JavaScript users 1

## Development notes
- index.html needs to
    1. serve as a loading page until the data loads
    2. be the main page when the data loads
    3. be the scaffold for the sample-page.html
    4. hyperlink to the sample-page.html
- Node v13 docs: https://nodejs.org/docs/latest-v13.x/api/fs.html
- make sure to start Live Server extension before `npm run build`

### Initialization scenarios
- stored data doesn't exist
    - sample data downloaded
    - sample data malformed
    - sample data cannot be downloaded (slow connection)
    - sample data cannot be downloaded (wrong url)
    - safari "block all cookies"
        - sample data downloaded
        - sample data cannot be downloaded
- stored data exists
    - stored data retrieved
    - stored data malformed, sample data downloaded
    - stored data malformed, sample data cannot be downloaded (slow internet)
    - stored data malformed, sample data cannot be downloaded (wrong url)

## Roadmap
### 1.1: add shareability to attract users
- make it shareable. shorten url project
    - client-side interpretation of shortened URL params. extract the url shortener into a separate project
    - server-side interpretation of shortened URL params: node.js??
    - generate firefox share link

### 1.2: add categories to attract users
- group by categories?? or use tags instead??
    Accessibility
    Performance
    UX
    Privacy
    Security
    Developer comfort
    - some more categories: https://frontendchecklist.io/#section-accessibility
    - if categories, allow for drag n drop ordering

### 1.2.1: improve ux to make users happy
- return caret when renaming priority

### 1.2.2: improve ux to make users happy
- slider width should indicate how much weight a priority has, or should it be indicated by some (colored) bars next to each priority
    - in edit mode the label width is smaller and it twiddles when you enter/leave edit mode

### 1.2.3: improve ux to make users happy
- disable crement buttons if they can't complete

### 1.2.4: improve ux to make users happy
- holding - or + pressed should decrease/increase multiple times

### 1.2.5: improve ux to make users happy
- add support for CTRL + Z on Windows/Linux for undo

### 1.2.6: improve ux to make users happy
- print
    - generate priority weight graph for print
    - higher priority has greater font size for print

### 1.3: support multiple projects
- ability to store and view priorities for multiple projects, optionally simultaneously

### 1.4: add print preview
- print preview button??

### 2.0: add urgency prioritization
- once you rank projects, then order them in the chronological order from most urgent to least urgent

### backlog
#### bugs
- automatic weight redistribution doesn't evenly remove weight from top 3 items
- safari workaround: `(form?.querySelector('button:nth-child(3)') as HTMLButtonElement).click();` in `form-elements.ts`
- safari workaround: `const targetButton = submitEvent.submitter || document.activeElement;` in `submit-action-handler.ts`

#### features
- "delete stored data" button
- "replace stored data with sample data" button
- installable app (PWA)
- export, import priority list
- export to .txt file
- save as .html file
- export to .csv file
- save to clipboard
- save as .md file
- command palete: extract into a separate library
- create my own baseline.css

#### ux
- replace decrement and increment button icons
- button press on safari makes button content invisible because of `:active{ color: <whatever>; }`
- it need not only be priorities, it can be tasks as well. up to the user
    - replace sample data with real project priorities for prioritizer (optionally provide different sets of sample data)
- on new priority input blur, reset the form in order to remove :invalid styling
- 3 seconds after last change, check if sort order would be different and if so unobtrusively offer to re-order (but only if sort has been pressed at least once)
- 3 seconds after reducing to 0 unobtrusively offer to remove the priority item
- input for adding new priority should be transform: scale(1.2); when :focus
- move "what is prioritizer" and "how does it work" to an FAQ page
- remove spellcheck for h1 when not in focus
- sample page should be a single html file. pack css into <style> instead of <link>ing to an external file
- focus should only be seen when navigating via keyboard: `:focus-visible`, `:-moz-focusring`
- add a range input for new priorities??
- set an upper limit to the max-width on labels

#### code quality
- rename `setContent` to `replaceContent` and use .append() when adding content to a newly created element
- add pre commit hook that runs `npm run build`
- add tool that increments package.json version on each commit or create a git commit hook that checks if it was changed
- add prettier
    - format document on save??
    - add ESLint
        - auto format on save
            - formatting .ts should place a space between 'constructor('
        - no unused exports
- setContent should only be called if there's a chance that the element already has some content, otherwise use textContent/innerText
- instead of calling handleCancel directly from rendering, call requestSubmit on cancelButton
- @types/node & @types/puppeteer don't seem to provide intellisense
- add SASS
    - minify css output, remove comments
    - get rid of "generics" in css
- create custom `htmlContent()` instead of manually generating HTML content e.g. `document.createElement()`
- remove HTML comments from `sample-page.html`
- replace element removal in `sample-page-generator.ts` with regex substring
- remove duplicate type on 'as', use optional chaining instead
- use typescript generics for deep clone: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkt
- optimize `tsconfig.json`
    - minify js