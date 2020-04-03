# Prioritizer
Tool that helps you get your priorities straight!

Live at https://frontendlane.github.io/prioritizer/

# Todo

## bugs
- remove invalid characters from CSS classes: https://stackoverflow.com/questions/448981

## typescript
- use typescript generics for deep clone: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkt
- remove extraneous explicit types when implicit types would work

## styling
- add SASS

## code quality
- remove duplicate type on 'as', use optional chaining instead
- format document on save
- add ESLint
    - auto format on save
        - formatting .ts should place a space between 'constructor('
    - no unused exports
- optimize tsconfig.json
- add tool that increments package.json version on each commit or create a git commit hook that checks if it was changed

## features
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

## backlog
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
- create my own css selector generating library that doesn't use id or classes but rather only child selectors
    - the library should always include element name in the selector. that solves the issue of clicking rename button and having save button get focused
    - that way i get rid of `|| 'body'`
- once you rank projects, then order them in the chronological order from most urgent to least urgent
- better fetch error handling