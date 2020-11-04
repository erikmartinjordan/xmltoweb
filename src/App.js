import React, { useState }            from 'react';
import moment                         from 'moment';
import { ReactComponent as Chipmunk } from './chipmunk.svg';
import { ReactComponent as Wave }     from './wave.svg';
import './App.css';

const App = () => {
    
    const [error, setError]       = useState('');
    const [protocol, setProtocol] = useState('https://');
    const [status, setStatus]     = useState('idle');
    const [url, setUrl]           = useState('');
    
    const scanUrl = async (url) => {
        
        setStatus('processing');
        
        let response = await fetch('https://us-central1-xmlator-pre.cloudfunctions.net/exploreLinks', {
           
            method: 'POST',
            headers:{'Content-type': 'application/json'},
            body: JSON.stringify({url: url})
            
        });
        
        if(response.ok){
            
            let urlsVisited = await response.json();
            let date = moment().format('YYYY'-'MM'-'DD');
            
            let xmlHeader = `<?xml version = '1.0' encoding = 'UTF-8'?><urlset xmlns = 'http://www.sitemaps.org/schemas/sitemap/0.9'>`;
            let xmlBody = Object.keys(urlsVisited).reduce((acc, url) => acc += `<url><loc>${url}</loc><lastmod>${date}</lastmod></url>`);
            let xmlFooter = `</urlset>`;
            
            let xmlStr = xmlHeader + xmlBody + xmlFooter;
            
            let blob = new Blob([xmlStr], {type: 'text/xml'});
            let downloadUrl = URL.createObjectURL(blob);
            
            var fileLink = document.createElement('a');
            
            fileLink.href = downloadUrl;
            fileLink.download = 'test.xml';
            fileLink.click();
            
            setStatus('processed');
            
        }
        
    }
    
    const handleUrl = (e) => {
        
        setUrl(e.target.value);
        setError(null);
        
    }
    
    const validateUrl = (e) => {
        
        e.preventDefault();
        
        let valid = (protocol + url).match(/^(http(s)?\:\/\/)?[a-zA-Z0-9-]+\.[a-z]{2,}$/);
        
        if(!valid) setError('Invalid URL. Example of valid URL: google.com');
        else       scanUrl(protocol + url);
        
    }
    
    return (
        <div className = 'App'>
            <div className = 'Title'>
                <Chipmunk/>
            </div>
            <div className = 'Search'>
                <h1>Get your xml!</h1>
                <p>A tool to scan your website and generate an xml automatically.</p>
                <form>
                    <span className = 'Protocol'>
                        <span className = {protocol === 'https://' ? 'Selected' : null} onClick = {() => setProtocol('https://')}>https://</span>
                        <span className = {protocol === 'http://'  ? 'Selected' : null} onClick = {() => setProtocol('http://')}>http://</span>
                    </span>
                    <input  onChange = {handleUrl}   placeholder = 'Enter your website...' autoFocus/>
                    <button onClick  = {validateUrl} disabled = {status === 'processing' || status === 'processed'}>
                        {
                            {
                                'idle': 'Generate xml',
                                'processing': 'Scanning...',
                                'processed': 'Ready!'
                                
                            }[status]
                        }
                    </button>
                    <div className = 'Error'>{error}</div>
                </form>
            </div>
            <div className = 'Footer'>
                <Wave/>
                <div className = 'Text'>
                    <p>© {moment().format('YYYY')} xmlchipmunk.com, by <a href = 'erikmartinjordan.com'>Erik Martín Jordán</a></p>
                </div>
            </div>
        </div>
    );
    
}

export default App;