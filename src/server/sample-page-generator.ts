const fs = require('fs');
const puppeteer = require('puppeteer');

puppeteer.launch({ product: 'firefox' }).then(async (browser: any) => {
    const samplePage: any = await browser.newPage();
    await samplePage.goto('localhost:5500');
    await samplePage.waitFor('.done-fetching');
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
            const notification = document.createDocumentFragment();
            const br: HTMLBRElement = document.createElement('br');
            br.style.marginBottom = '1rem';
            const a: HTMLAnchorElement = document.createElement('a');
            a.append('home page');
            a.href = './';
            notification.append('This is a static sample page for users who have JavaScript disabled. Buttons are disabled because they require JavaScript to work, but you can change the heading.', br , 'If you have JavaScript enabled, go to the ', a, ' for the interactive version on the app.');
            document.querySelector('p[aria-live="polite"][role="status"]')?.append(notification);
        };

        const disableButtons = (): void =>
            document.querySelectorAll('button').forEach((button: HTMLButtonElement) => button.disabled = true);

        const removeLiveServerScript = (): void =>
            document.querySelector('script[type="text/javascript"]')?.remove();

        replaceNoscriptCss();
        setNotification();
        disableButtons();
        removeLiveServerScript();
    });
    fs.writeFileSync('./sample-page.html', await samplePage.content(), (error: any): void => console.error(error));
    await browser.close();
});