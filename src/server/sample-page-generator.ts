const fs = require('fs');
const puppeteer = require('puppeteer');

puppeteer.launch({ product: 'firefox' }).then(async (browser: any) => {
    const samplePage: any = await browser.newPage();
    await samplePage.goto('localhost:5500');
    await samplePage.waitFor('.load-success');
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
            const homePage: HTMLAnchorElement = document.createElement('a');
            homePage.append('home page');
            homePage.href = './';
            const em: HTMLElement = document.createElement('em');
            em.append('can');
            document.querySelector('p[aria-live="polite"][role="status"]')?.append('This is a static version of the ', homePage, '. Buttons are disabled because they require JavaScript to work, but you ', em,' change the heading.');
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