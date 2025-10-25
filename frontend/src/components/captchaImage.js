import '../styles/captchaBlock.css';

export default function CaptchaImage({imageIndex, blockIndex, imageList, challengeTypes, setBlockData, verified}) {
    
    const imageClick = () => {
        if (verified !== null) {
            return;
        }

        setBlockData(prevBlockData => {
            const arr = [...prevBlockData];
            const block = {...prevBlockData[blockIndex]};
            
            // Deep copy imageList to ensure React detects change
            block.imageList = [...block.imageList];
            block.imageList[imageIndex] = {...block.imageList[imageIndex]};
            block.imageList[imageIndex].clicked = !block.imageList[imageIndex].clicked; 
            
            arr.splice(blockIndex, 1, block);

            return arr;
        })
    }


    const challengeClasses = challengeTypes.length ? challengeTypes.join(' ') : '';
    const blurNegativeClass = challengeTypes.includes('blur') && challengeTypes.includes('negative') ? 'blur-negative' : ''
    const clickedClass = imageList[imageIndex].clicked ? 'clicked' : '';

    const skewStyle = challengeTypes.includes('skew') && verified === null ? {transform: imageList[imageIndex].skew} : {};
    const rotationStyle = challengeTypes.includes('rotate') && verified === null ? {transform: imageList[imageIndex].rotation} : {};
    const skewRotationStyle = challengeTypes.includes('skew') && challengeTypes.includes('rotate') && verified === null ? {transform: `${imageList[imageIndex].skew} ${imageList[imageIndex].rotation}`} : {};
    const offsetStyle = challengeTypes.includes('movement') && verified === null ? imageList[imageIndex].offset : {};

    const finalClassName = `captcha-image ${challengeClasses} ${blurNegativeClass} ${clickedClass}`;

    return (
        <div
            className={finalClassName}
            style={{...skewStyle, ...rotationStyle, ...skewRotationStyle, ...offsetStyle, backgroundImage: `url(${imageList[imageIndex].url})`}}
            onClick={imageClick}
        >
        </div>
        )
}