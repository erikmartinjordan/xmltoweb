const functions = require('firebase-functions');
const puppeteer = require('puppeteer');
const cors      = require('cors')({origin: true});

exports.exploreLinks = functions.https.onRequest(async (request, response) => {
    
    return cors(request, response, async () => {
        
        const root = request.body.url;
        
        const buttonTextsToClick = ['Show', 'More', 'View', 'Mostrar', 'Ver', 'Más'];
        
        const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
        
        const page = await browser.newPage();
        
        await page.goto(root, {waitUntil: 'networkidle0'});
        
        let urlsToVisit = await page.$$eval('a', (links, root) => links.map(link => link.href).filter(link => link.startsWith(root)), root);  
        
        console.log(urlsToVisit);
        
        let urlsVisited = {[root]: true};
        
        /* eslint-disable no-await-in-loop */
        for(let i = 0; i < urlsToVisit.length; i ++){
            
            let url = urlsToVisit[i];
            
            if(!urlsVisited[url]){
                
                await page.goto(url, {waitUntil: 'networkidle0'});
                
                await page.$$eval('button', (buttons, buttonTextsToClick) => buttons.forEach(button => {
                    
                    if(buttonTextsToClick.some(text => button.innerText.includes(text))){
                        
                        button.click();
                        
                        console.log('Waiting here...');
                        
                        page.waitForTimeout(2000);
                        
                    }
                    
                }), buttonTextsToClick);
                
                let _urlsToVisit = await page.$$eval('a', (links, root) => links.map(link => link.href).filter(link => link.startsWith(root)), root);
                
                urlsToVisit = [...new Set([...urlsToVisit, ..._urlsToVisit])];
                
                urlsVisited[url] = true;
                
            }
            
        }
        /* eslint-enable no-await-in-loop */
        
        await browser.close();
        
        response.json(urlsVisited);  
        
    });
    
});