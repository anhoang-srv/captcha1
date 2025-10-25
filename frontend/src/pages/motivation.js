import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import '../styles/menu.css';

export default function Motivation({playSound}) {
    const navigate = useNavigate();

    const [displayOn, setDisplayOn] = useState(false);
    const [quote, setQuote] = useState({content: '', author: '', index: null});

    const humanityQuotes = [
        {content: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi"},
        {content: "We are all human beings, and we all have insecurities, but it's about being healthy and happy with yourself.", author: "Smokey Robinson"},
        {content: "The greatness of humanity is not in being human, but in being humane.", author: "Mahatma Gandhi"},
        {content: "No human race is superior; no religious faith is inferior. All collective judgments are wrong. Only racists make them.", author: "Elie Wiesel"},
        {content: "The ultimate measure of a man is not where he stands in moments of comfort and convenience, but where he stands at times of challenge and controversy.", author: "Martin Luther King Jr."},
        {content: "We must learn to live together as brothers or perish together as fools.", author: "Martin Luther King Jr."},
        {content: "The human capacity for burden is like bamboo – far more flexible than you'd ever believe at first glance.", author: "Jodi Picoult"},
        {content: "What makes you human is not one thing – it's a million things.", author: "Unknown"},
    ];

    const generateQuote = () => {
        let index = Math.floor(Math.random() * humanityQuotes.length);
        
        setQuote(prevQuote => {
            if (index === prevQuote.index) {
                index = (index + 1) % humanityQuotes.length;
            }
            
            const {content, author} = humanityQuotes[index];
            return {content, author, index}
        });
    }

    useEffect(() => {
        setTimeout(() => setDisplayOn(true));
        generateQuote();
    }, [])

    const displayClass = displayOn ? 'display-on' : '';

    const changePage = path => {
        setDisplayOn(false);
        setTimeout(() => navigate(path), 600);
        playSound('beep');
    }

    return (
        <div className='motivation menu'>
            <div className={`menu-content ${displayClass}`}>
                <div className='menu-title-wrapper'>
                    <div className='logo'>💭</div>
                    <h1>Quotes About Being Human</h1>
                </div>
                <div className='text-block'>
                    {quote.content ? <>
                            <p style={{fontSize: '18px', fontStyle: 'italic', color: 'white', textAlign: 'center', marginBottom: '20px'}}>"{quote.content}"</p>
                            <p className='author-name' style={{color: '#ccc', textAlign: 'center'}}>- {quote.author}</p>
                        </>                        
                        : <>
                            <div className='loading-caption'>Loading...</div>
                            <div className='loading'></div>
                        </>
                    }
                </div>
                <button className='new-quote-button' onClick={() => {generateQuote(); playSound('beep');}}>New Quote</button>
                <button className='menu-button' onClick={() => changePage('/menu')}>Main Menu</button>
            </div>
            <div className={`menu-flash ${displayClass}`}></div>
        </div>
    )
}