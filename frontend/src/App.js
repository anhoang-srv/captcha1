import {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Start from './pages/start';
import Menu from './pages/menu';
import Game from './pages/game';
import GameOver from './pages/gameOver';
import Certificate from './pages/certificate';
import Leaderboard from './pages/leaderboard';
import Motivation from './pages/motivation';
import About from './pages/about';

function App() {
  const [level, setLevel] = useState(1);
  const [muted, setMuted] = useState(false);
  const [startSound, setStartSound] = useState();
  const [beepSound, setBeepSound] = useState();
  const [gameOverSound, setGameOverSound] = useState();
  const [musicSound, setMusicSound] = useState();
  const [leaders, setLeaders] = useState([]);

  if (startSound) {
    startSound.volume = .1;
    beepSound.volume = .5;
    gameOverSound.volume = .005;
    musicSound.volume = .03;
    musicSound.loop = true;  
  }

  useEffect(() => {
    try {
      const start = new Audio("/sounds/start-game.mp3");
      const beep = new Audio("/sounds/beep.mp3");
      const gameOver = new Audio("/sounds/game-over.mp3");
      const music = new Audio("/sounds/music.mp3");
      
      // Preload audio files
      start.preload = "auto";
      beep.preload = "auto";
      gameOver.preload = "auto";
      music.preload = "auto";
      
      setStartSound(start);
      setBeepSound(beep);
      setGameOverSound(gameOver);
      setMusicSound(music);
    } catch (error) {
      console.log('Audio initialization error (this is normal):', error);
    }
  }, []);

  useEffect(() => {
    // Mock data for local development
    const mockLeaders = [
      { name: "Player1", level: 15 },
      { name: "Player2", level: 12 },
      { name: "Player3", level: 10 }
    ];
    
    setLeaders(mockLeaders);
    
    // Try to fetch from API, fallback to mock data
    fetch("/api/scoreboard")
    .then(res => {
      if (!res.ok) throw new Error('API not available');
      return res.json();
    })
    .then(data => setLeaders(data))
    .catch(err => {
      console.log('Using mock data for leaderboard:', err);
      setLeaders(mockLeaders);
    }); 
  }, [])

  
  useEffect(() => {
    if (window.location.href !== window.location.origin + '/' && musicSound && !muted) {
      const startMusic = () => {
        playSound('music');
        // Remove listener after first click to avoid multiple calls
        document.body.removeEventListener('click', startMusic);
      };

      document.body.addEventListener('click', startMusic, { once: true });
    
      return () => document.body.removeEventListener('click', startMusic);
    }
  }, [musicSound, muted]);

  useEffect(() => {
    if (muted && musicSound) {
      try {
        musicSound.pause();
        musicSound.currentTime = 0;
      } catch (error) {
        console.log('Error pausing music:', error);
      }
    }
  }, [muted])

  const playSound = type => {
    if (!muted) {
      try {
        switch (type) {
          case'start':
            startSound?.play().catch(e => console.log('Start sound blocked:', e.message));
            break;
          case'beep':
            beepSound?.play().catch(e => console.log('Beep sound blocked:', e.message));
            break;
          case'game-over':
            gameOverSound?.play().catch(e => console.log('Game over sound blocked:', e.message));
            break;
          case'music':
            musicSound?.play().catch(e => console.log('Music blocked:', e.message));
            break;
          case'click':
            beepSound?.play().catch(e => console.log('Click sound blocked:', e.message));
            break;
          case'success':
            startSound?.play().catch(e => console.log('Success sound blocked:', e.message));
            break;
          case'error':
            gameOverSound?.play().catch(e => console.log('Error sound blocked:', e.message));
            break;
          default:
            break;
        }
      } catch (error) {
        console.log('Sound play error:', error);
      }
    }
  } 

  const toggleSound = () => {
    setMuted(prevMuted => !prevMuted);
  }

  return (
    <BrowserRouter>
    <main>
      <div className='bg bg-1'/>
      <div className='bg bg-2'/>
      <div className='bg bg-3'/>
      <div className='bg bg-4'/>
      <div className='mute-button' onClick={toggleSound}>
        {
          muted
          ? <span>🔇</span>
          : <span>🔊</span>
        }
      </div>
      <Routes>
        <Route path="/" element={<Start {...{musicSound, playSound}}/>}/>
        <Route path="/menu" element={<Menu {...{setLevel, playSound}}/>}/>
        <Route path="/game" element={<Game {...{level, setLevel, playSound}}/>}/>
        <Route path="/gameOver" element={<GameOver  {...{level, setLevel, setLeaders, playSound}}/>}/>
        <Route path="/certificate" element={<Certificate {...{level, playSound}}/>}/>
        <Route path="/leaderboard" element={<Leaderboard {...{leaders, playSound}}/>}/>
        <Route path="/motivation" element={<Motivation {...{playSound}}/>}/>
        <Route path="/about" element={<About {...{playSound}}/>}/>
      </Routes>
    </main>
    </BrowserRouter>
  );
}

export default App;