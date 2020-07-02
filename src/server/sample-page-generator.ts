const fs = require('fs');
const puppeteer = require('puppeteer');

puppeteer.launch({ product: 'firefox' }).then(async (browser: any) => {
    const samplePage: any = await browser.newPage();
    await samplePage.goto('localhost:5500');
    await samplePage.waitFor('.done-loading');
    await samplePage.evaluate((): void => {
        const replaceNoscriptCss = (): void => {
            const head: HTMLHeadElement | null = document.querySelector('head');
            head?.querySelector('noscript')?.remove();
            const noscript: HTMLElement = document.createElement('noscript');
            const link: HTMLLinkElement = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './public/styles/sample-page-noscript.css';
            noscript.append(link);
            head?.append(noscript);
        };

        const setNotification = (): void => {
            const a: HTMLAnchorElement = document.createElement('a');
            a.append('home page');
            a.href = './';
            document.querySelector('p[aria-live="polite"][role="status"]')?.append('This is a static sample page for users who have JavaScript disabled. Buttons are disabled because they require JavaScript to work, but you can change the heading.\n\nIf you have JavaScript enabled, go to the ', a, ' for the interactive version on the app.');
        };

        const disableButtons = (): void =>
            document.querySelectorAll('button').forEach((button: HTMLButtonElement): true => button.disabled = true);

        const removeScripts = (): void =>
            document.querySelectorAll('script').forEach((script: HTMLScriptElement): void => script.remove());

        replaceNoscriptCss();
        setNotification();
        disableButtons();
        removeScripts();
    });
    fs.writeFileSync('./sample-page.html', await samplePage.content(), (error: any): void => console.error(error));
    await browser.close();
});