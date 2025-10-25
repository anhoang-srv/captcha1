import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import CaptchaBlock from '../components/captchaBlock';
import PuzzleBlock from '../components/puzzleBlock';
import CircleDrawingBlock from '../components/circleDrawingBlock';
import QuizBlock from '../components/quizBlock';
import TicTacToeBlock from '../components/ticTacToeBlock';
import WordSearchBlock from '../components/wordSearchBlock';
import MathProBlock from '../components/MathProBlock';
import CatchDucksBlock from '../components/catchDucksBlock';
import '../styles/game.css';

// Define the order and types of games
const GAME_TYPES = ['catchducks', 'captcha', 'puzzle', 'tictactoe', 'quiz', 'wordsearch', 'circle', 'mathpro'];
const MAX_LEVEL = GAME_TYPES.length;

// Get the game type for the current level
const getGameTypeForLevel = (currentLevel) => {
    // Levels are 1-based, arrays are 0-based
    return GAME_TYPES[currentLevel - 1] || 'captcha'; // Default to captcha if out of bounds
};

export default function Game({level, setLevel, playSound}) {
    const navigate = useNavigate();

    const [timer, setTimer] = useState(-1);
    const [blockData, setBlockData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false); // Prevent double-processing

    // Component mount - không tự động reset level nữa
    // Level sẽ được reset từ GameOver hoặc Menu khi cần
    useEffect(() => {

    }, [])

    // Debug: Log level changes
    useEffect(() => {

        // CRITICAL: Reset blockData khi level thay đổi để tránh infinite loop
        setBlockData([]);
        setIsProcessing(false); // Reset processing flag
    }, [level]);

    const gameType = getGameTypeForLevel(level);

    useEffect(() => {
        setTimer(-1);

        // Only run timer for 'captcha' levels
        if (gameType !== 'captcha') {
            return;
        }

        const timerInterval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [level, gameType]);

    // setLevel when you either win or lose a round
    useEffect(() => {
        // Không làm gì nếu blockData rỗng (đang reset hoặc chưa khởi tạo)
        if (blockData.length === 0) {
            return;
        }

        // Tránh xử lý trùng lặp
        if (isProcessing) {
            return;
        }



        if (blockData.some(e => e.verified === false)) {
            console.log('Game Over - verified false detected');
            setIsProcessing(true);
            setTimeout(() => navigate('/gameOver'), 600);
            playSound('game-over');
        }
        // IMPORTANT: Check that blockData is not empty to prevent a race condition on level change
        else if (blockData.length > 0 && blockData.every(e => e.verified === true)) {

            setIsProcessing(true);

            // Wait for completion animation before navigating or changing level
            setTimeout(() => {
                if (level === MAX_LEVEL) {

                    playSound('success');
                    navigate('/certificate');
                } else {

                    setLevel(prevLevel => prevLevel + 1);
                }
            }, 1000); // Delay to allow animations to finish
        }
    }, [blockData, level, navigate, playSound, setLevel, isProcessing]);

    useEffect(() => {
        // Only check timer for 'captcha' levels
        if (gameType !== 'captcha') {
            return;
        }

        if (timer > 10) {
            setTimeout(() => navigate('/gameOver'), 600);
            playSound('game-over');
        }
    }, [timer, gameType, navigate, playSound])



    // setBlockData when level changes
    useEffect(() => {
        setTimeout(() => {

            let newBlockData = [];

            switch (gameType) {
                case 'tictactoe':
                    newBlockData = [{
                        type: 'tictactoe',
                        difficulty: Math.floor(Math.random() * 3) + 1, // Random difficulty 1-3
                        verified: null
                    }];
                    break;
                case 'wordsearch':
                    newBlockData = [{
                        type: 'wordsearch',
                        difficulty: Math.floor(Math.random() * 3) + 1, // Random difficulty 1-3
                        verified: null
                    }];
                    break;
                case 'quiz':
                    newBlockData = [{
                        type: 'quiz',
                        difficulty: Math.floor(Math.random() * 3) + 1, // Random difficulty 1-3
                        verified: null
                    }];
                    break;
                case 'puzzle':
                    const puzzleImages = ['/puzzle/puzzle1.jpg'];
                    const selectedPuzzle = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
                    newBlockData = [{
                        type: 'puzzle',
                        imageUrl: selectedPuzzle,
                        difficulty: Math.floor(Math.random() * 2) + 3, // Random difficulty 3-4
                        verified: null
                    }];
                    break;
                case 'circle':
                    newBlockData = [{
                        type: 'circle',
                        difficulty: Math.floor(Math.random() * 5) + 1, // Random difficulty 1-5
                        verified: null
                    }];
                    break;
                case 'mathpro':
                    newBlockData = [{
                        type: 'mathpro',
                        verified: null
                    }];
                    break;
                case 'catchducks':
                    newBlockData = [{
                        type: 'catchducks',
                        verified: null
                    }];
                    break;
                default: // 'captcha'
                    const challengeTypes = ['skew', 'negative', 'rotate', 'movement', 'four'];
                    let challengeArr = [];

                    const numBlocks = Math.floor(Math.random() * 3) + 1; // 1 to 3 blocks
                    for (let i = 0; i < numBlocks; i++) {
                        const shortest = [...challengeArr].sort((a,b) => a.length - b.length)[0];
                        const lowest = [...challengeArr]
                            .filter(e => e.length === shortest?.length || challengeArr.length === 0)
                            .sort((a,b) => a[a.length - 1] - b[b.length - 1])[0];

                        let innerArr = challengeArr[challengeArr.findIndex(e => e.every(f => lowest?.includes(f)))];

                        if (!innerArr || innerArr.length === challengeTypes.length) {
                            challengeArr.push([0]);
                            challengeArr = challengeArr.map(() => [0]);
                        } else {
                            if (innerArr[innerArr.length - 1] === challengeTypes.length) {
                                innerArr.push(0);
                                                    challengeArr[challengeArr.findIndex(e => e.every(f => lowest.includes(f)))] = innerArr.map((_,i) => i + 1);
                            } else {
                                innerArr[innerArr.length - 1]++;
                            }
                        }
                    }

                    const imageTypes = ['bicycles', 'bridges', 'cars', 'crosswalks', 'streetlights', 'trains'];

                    newBlockData = challengeArr.map(innerArr => {
                        const innerChallenges = innerArr.map(e => challengeTypes[e - 1]);
                        const randomType = Math.floor(Math.random()*imageTypes.length);
                        const imageCount = innerChallenges.includes('four') ? 16 : 9;

                        const imageArrays = {
                            bicycles: Array(16).fill().map((_,i) => `/captcha-images/bicycles/${i}.jpg`),
                            bridges: Array(16).fill().map((_,i) => `/captcha-images/bridges/${i}.jpg`),
                            cars: Array(16).fill().map((_,i) => `/captcha-images/cars/${i}.jpg`),
                            crosswalks: Array(16).fill().map((_,i) => `/captcha-images/crosswalks/${i}.jpg`),
                            streetlights: Array(16).fill().map((_,i) => `/captcha-images/streetlights/${i}.jpg`),
                            trains: Array(16).fill().map((_,i) => `/captcha-images/trains/${i}.jpg`)
                        };

                        return {
                            imageList: Array(imageCount).fill().map((_, idx) => {
                                const shouldBeTargetType = idx < Math.max(2, Math.floor(imageCount / 3));
                                const randomTypeIdx = shouldBeTargetType ? randomType : Math.floor(Math.random()*imageTypes.length);
                                const imageArr = [...imageArrays[imageTypes[randomTypeIdx]]];
                                const randomImage = imageArr.splice(Math.floor(Math.random()*imageArr.length), 1)[0];
                                const skewX = 10 - Math.round(Math.random()*20) + 'deg';
                                const skewY = 10 - Math.round(Math.random()*20) + 'deg';
                                const skew = `skew(${skewX}, ${skewY})`;
                                const rotation = innerChallenges.includes('rotate') ? `rotate(${Math.floor(Math.random()*4)*90 + 'deg'})` : '';
                                const offsetX = 30 - Math.round(Math.random()*60) + 'px';
                                const offsetY = 30 - Math.round(Math.random()*60) + 'px';
                                const offset = innerChallenges.includes('movement') ? { left: offsetX, top: offsetY } : {};
                                return {url: randomImage, clicked: false, type: imageTypes[randomTypeIdx], skew, rotation, offset};
                            }).sort(() => Math.random() - 0.5),
                            imageType: imageTypes[randomType],
                            challengeTypes: innerChallenges,
                            verified: null
                        };
                    });
                    break;
            }
            setBlockData(newBlockData);
        }, 600);
    }, [level]);


    const timerWidth = {width: 100 - timer*10 < 100 ? `${100 - timer*10}%` : `${100}%`};

    return (
        <div className='game-content'>
            <div className='level-tracker'>Level: {level}</div>
            <div className='captcha-blocks'>
                {blockData.map((block, i) => {
                    if (block.type === 'puzzle') {
                        return (
                            <PuzzleBlock
                                key={`puzzle-${i}`}
                                imageUrl={block.imageUrl}
                                difficulty={block.difficulty}
                                onSuccess={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = true;
                                    setBlockData(newData);
                                }}
                                playSound={playSound}
                                timer={timer}
                            />
                        );
                    }
                    else if (block.type === 'circle') {
                        return (
                            <CircleDrawingBlock
                                key={`circle-${i}`}
                                difficulty={block.difficulty}
                                onSuccess={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = true;
                                    setBlockData(newData);
                                }}
                                onFailure={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = false;
                                    setBlockData(newData);
                                }}
                                playSound={playSound}
                            />
                        );
                    }
                    else if (block.type === 'quiz') {
                        return (
                            <QuizBlock
                                key={`quiz-${i}`}
                                difficulty={block.difficulty}
                                onSuccess={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = true;
                                    setBlockData(newData);
                                }}
                                onFailure={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = false;
                                    setBlockData(newData);
                                }}
                                playSound={playSound}
                            />
                        );
                    }
                    else if (block.type === 'tictactoe') {
                        return (
                            <TicTacToeBlock
                                key={`tictactoe-${i}`}
                                difficulty={block.difficulty}
                                onSuccess={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = true;
                                    setBlockData(newData);
                                }}
                                onFailure={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = false;
                                    setBlockData(newData);
                                }}
                                playSound={playSound}
                            />
                        );
                    }
                    else if (block.type === 'wordsearch') {
                        return (
                            <WordSearchBlock
                                key={`wordsearch-${i}`}
                                difficulty={block.difficulty}
                                onSuccess={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = true;
                                    setBlockData(newData);
                                }}

                                playSound={playSound}
                            />
                        );
                    }
                    else if (block.type === 'mathpro') {
                        return (
                            <MathProBlock
                                key={`mathpro-${i}`}
                                onSuccess={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = true;
                                    setBlockData(newData);
                                }}
                                onFailure={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = false;
                                    setBlockData(newData);
                                }}
                                playSound={playSound}
                            />
                        );
                    }
                    else if (block.type === 'catchducks') {
                        return (
                            <CatchDucksBlock
                                key={`catchducks-${i}`}
                                onComplete={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = true;
                                    setBlockData(newData);
                                }}
                                onFailure={() => {
                                    const newData = [...blockData];
                                    newData[i].verified = false;
                                    setBlockData(newData);
                                }}
                                playSound={playSound}
                            />
                        );
                    }
                    else {
                        return (
                            <CaptchaBlock
                                blockIndex={i}
                                {...{level, timer, blockData, setBlockData, playSound}}
                                key={`block-${i}`}
                            />
                        );
                    }
                })}
            </div>
            {/* Only show timer bar for captcha levels */}
            {gameType === 'captcha' &&
                <div className='timer-bar' style={timerWidth}></div>}
        </div>
    )
}