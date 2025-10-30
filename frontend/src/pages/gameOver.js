import {useState, useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import '../styles/menu.css';

export default function GameOver({level, setLevel, setLeaders, playSound}) {
    const navigate = useNavigate();

    const [displayOn, setDisplayOn] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        setTimeout(() => setDisplayOn(true));
    }, [])

    const displayClass = displayOn ? 'display-on' : '';
    const submittedClass = submitted ? 'submitted' : '';

    const changePage = (path, resetLevel = false) => {
        setDisplayOn(false);
        
        // Reset level nếu cần (New Game hoặc Main Menu)
        if (resetLevel) {
            setLevel(1);
        }
        
        setTimeout(() => navigate(path), 600);

        if (path === '/game') {
            playSound('start');
        }
        else {
            playSound('beep');
        }
    }

    const submitScore = e => {
        if (e.type === 'click' || e.code === 'Enter') {
            if (!submitted && inputRef.current.value.trim()) {
                setSubmitted(true);
    
                const entry = {
                    name: inputRef.current.value.trim(),
                    level
                }

                setLeaders(prevLeaders => [...prevLeaders, entry]);

                // Try to submit to API, but don't crash if it fails
                fetch("/api/scoreboard", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(entry)
                })
                .then(res => {
                    if (!res.ok) throw new Error('API not available');
                    return res.json();
                })
                .then(data => console.log('Score submitted to server:', data))
                .catch(err => {
                    console.log('Score saved locally only:', err);
                    // Score is still saved in local state
                });
                
                playSound('beep'); 
            }
            else if (!submitted) {
                inputRef.current.style.outline = '3px solid red';
                inputRef.current.focus();
                playSound('game-over'); 
            }
        }

    }

    return (
        <div className='menu game-over'>
            <div className={`menu-content ${displayClass}`}>
                <div className='menu-title-wrapper'>
                    <div className='logo'>🤖</div>
                    <h1>You got to Level {level}!</h1>
                </div>
                <input className={`name-entry ${submittedClass}`} ref={inputRef} maxLength='12' placeholder='Enter your name' onKeyDown={submitScore}/>
                
                <div className="game-over-buttons">
                    <button className={`submit-button ${submittedClass}`} onClick={submitScore}>Submit Score</button>
                    <button className='retry-button' onClick={() => changePage('/game', false)}>
                        Retry Level {level}
                    </button>
                    <button className='new-game-button' onClick={() => changePage('/game', true)}>
                        New Game
                    </button>
                    <button className='menu-button' onClick={() => changePage('/menu', true)}>Main Menu</button>
                </div>
            </div>
            <div className={`menu-flash ${displayClass}`}></div>

        </div>
    )
}