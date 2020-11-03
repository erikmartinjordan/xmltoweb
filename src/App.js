import { useState }                   from 'react';
import { ReactComponent as Chipmunk } from './chipmunk.svg';
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
            <div className = 'Title'>
                <Chipmunk/>
            </div>
            <div className = 'Search'>
                <h1>Get your xml!</h1>
                <p>A tool to scan your website and generate an xml automatically.</p>
                <form>
                    <input  onChange = {(e) => setUrl(e.target.value)} placeholder = 'Enter your website...'/>
                    <button onClick = {(e) => scanUrl(e)} >Generate xml</button>
                </form>
            </div>
            <div className = 'Footer'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill = "#0088cc" fill-opacity = "1" d="M0,192L20,165.3C40,139,80,85,120,90.7C160,96,200,160,240,165.3C280,171,320,117,360,96C400,75,440,85,480,117.3C520,149,560,203,600,213.3C640,224,680,192,720,202.7C760,213,800,267,840,240C880,213,920,107,960,85.3C1000,64,1040,128,1080,138.7C1120,149,1160,107,1200,85.3C1240,64,1280,64,1320,69.3C1360,75,1400,85,1420,90.7L1440,96L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z"></path>
                </svg>
                <div className = 'Text'>© 2020 by Erik Martín Jordán</div>
            </div>
        </div>
    );
    
}

export default App;