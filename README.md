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

## Roadmap
### 1.0: explain how to use the app
- "what is this" button
- "how does this work" button

### 1.1: add shareability to attract users
- make it shareable. shorten url project
    - client-side interpretation of shortened URL params. extract the url shortener into a separate project
    - server-side interpretation of shortened URL params: node.js??

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
#### features
- Export, import priority list
- export to .txt file
- save as .html file
- export to .csv file
- command palete: extract into a separate library
- create my own baseline.css

#### ux
- it need not only be priorities, it can be tasks as well. up to the user
    - replace sample data with real project priorities for prioritizer (optionally provide different sets of sample data)
- on new priority input blur, reset the form in order to remove :invalid styling
- 3 seconds after last change, check if sort order would be different and if so unobtrusively offer to re-order (but only if sort has been pressed at least once)
- 3 seconds after reducing to 0 unobtrusively offer to remove the priority item
- input for adding new priority should be transform: scale(1.2); when :focus
- remove spellcheck for h1 when not in focus
- focus should only be seen when navigating via keyboard: `:focus-visible`, `:-moz-focusring`
- add a range input for new priorities??
- set an upper limit to the max-width on labels

#### code quality
- if error during fetch, try again in a couple of seconds. if fails for the second time, show a notice that the page will be redirected to sample-page.html and after a couple of seconds redirect to sample-page.html
- replace console.error with `throw Error`
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
- replace element removal in sample-page-generator.ts with regex substring
- remove duplicate type on 'as', use optional chaining instead
- use typescript generics for deep clone: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkt
- optimize tsconfig.json
    - minify js