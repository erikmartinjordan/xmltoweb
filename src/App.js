import { useState } from 'react';
import './App.css';

const App = () => {
    
    const [url, setUrl] = useState('');
    
    const scanUrl = async (e) => {
        
        e.preventDefault();
        
        const response = await fetch('https://us-central1-xml-generator-pre.cloudfunctions.net/exploreLinks', {
           
            method: 'POST',
            headers:{'Content-type': 'application/json'},
            body: JSON.stringify({url: url})
            
        });
        
        if(response.ok){
            
            const urlsVisited = await response.json();
            
            console.log(urlsVisited);
            
        }
        
    }
    
    return (
        <div className = 'App'>
            <div className = 'Wrap'>
                <h1>Generate an xml automatically</h1>
                <p>A tool to scan your website and generate an xml automatically (ready to download). 🦀</p>
                <form>
                    <input  onChange = {(e) => setUrl(e.target.value)} placeholder = 'Enter your website...'/>
                    <button onClick = {(e) => scanUrl(e)} >Generate xml</button>
                </form>
            </div>
        </div>
    );
    
}

export default App;