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

## Todo
### bugs
- focus should only be seen when navigating via keyboard: `:focus-visible`, `:-moz-focusring`
- remove spellcheck for h1 when not in focus
- add a range input for new priorities??
- set an upper limit to the max-width on labels
- return caret when renaming priority
- buttons for each priority don't work in browsers other than firefox
- on new priority input blur, reset the form in order to remove :invalid styling
- add support for CTRL + Z on Windows/Linux for undo

### typescript
- use typescript generics for deep clone: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkt

### styling
- add SASS
    - minify css output, remove comments
    - get rid of "generics" in css

### code quality
- setContent should only be called if there's a chance that the element already has some content, otherwise use textContent/innerText
- add prettier
- add pre commit hook that runs `npm run build`
- replace console.error with `throw Error`
- replace element removal in sample-page-generator.ts with regex substring
- @types/node & @types/puppeteer don't seem to provide intellisense
- split between TPriorityWeb, TPriorityDatabase/TPriorityStorage??
- instead of calling handleCancel directly from rendering call requestSubmit on cancelButton
- remove duplicate type on 'as', use optional chaining instead
- format document on save
- add ESLint
    - auto format on save
        - formatting .ts should place a space between 'constructor('
    - no unused exports
- optimize tsconfig.json
    - minify js, remove comments
- add tool that increments package.json version on each commit or create a git commit hook that checks if it was changed

### features
- input for adding new priority should be transform: scale(1.2); when :focus
- disable crement buttons if they can't complete
- higher priority has greater font size for print
- 2 seconds after last change, check if sort order would be different and if so offer to re-order
- 2 seconds after reducing to 0 offer to remove the priority item
- support keyboard shortcut for undo
- holding - or + pressed should decrease/increase multiple times
- Export, import priority list
    - store project name as well (and page title)
- persistance in localStorage or whatever devdocs.io does
- ability to store and view priorities for multiple projects, optionally simultaneously
- slider size should indicate how much weight a priority has, or should it be indicated by some (colored) bars next to each priority??
- generate priority weight graph for print
- print preview button??
- export to .txt file
- export to .csv file
- save as .html file
- command palete: extract into a separate library

### backlog
- replace sample data with real project priorities for prioritizer
- make it shareable. shorten url project
    - client-side interpretation of shortened URL params. extract the url shortener into a separate project
    - server-side interpretation of shortened URL params: node.js??
- group by categories??  or use tags instead??
    Accessibility
    Performance
    UX
    Privacy
    Security
    Developer comfort
    - some more categories: https://frontendchecklist.io/#section-accessibility
    - if categories, allow for drag n drop ordering
- once you rank projects, then order them in the chronological order from most urgent to least urgent
- if error during fetch, try again in a couple of seconds. if fails for the second time, show a notice that the page will be redirected to sample-page.html and after a couple of seconds redirect to sample-page.html
- it need not only be priorities, it can be tasks as well. up to the user
- create my own baseline.css