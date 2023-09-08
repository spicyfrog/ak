import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './style.css'; // Import the CSS file

export const App = () => {
  const emojis = [
    '🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁',
//    '🐮', '🐷', '🐵', '🐔', '🐧', '🐦', '🦆', '🦉', '🦅', '🦇'
  ];

  const placeholderTexts = [
    "1. I considered being an EM on business banking back in the summer of 2019. Actually met with Gian, Meghan, Amar and the team. Ended up deciding to stay on Capital. And as luck would have it, I’m basically working with those folks anyway! So the world really wanted to bring us together. 🙂",
    "2. The decision to leave SF and move to LA and actually executing it all happened in under 3 weeks.",
    "3. One of my less well-known accomplishments at Square was getting the culinary team to offer berries at breakfast time.",
    "4. I got my monitor for at home before the company ever really knew how to do this thing en masse because I got to know one of the leads for IT procurement in the Square locker room every morning at 7:15 am for over a year.",
    "5. A good burger is one of my all-time favorite foods.",
    "6. Andrew Berls and I got each other’s packages from a kitchen cutlery company recently. We likely ordered at the same time and our names were easy enough to mix up. It’s unbelievable to me…we got wrong packages for people we know who don’t live anywhere near us!",
    "7. Meghan and I used to get breakfast once a week and debrief on the bachelor / bachelorette / bachelor in paradise.",
    "8. Square made me a coffee snob.",
    "9. I competed in a Square Capital talent show and made omelets. It did NOT go well.",
    "10. One of my best celebrity sightings is seeing Wayne Brady at a Chili’s near my parents with friends from out of town. They didn’t believe it was Wayne Brady so I yelled to him, “Hey…Wayne Brady eats at Chili’s?” To which he replied “Wayne Brady’s gotta eat!”"
  ];

  const initialCards = shuffle([...emojis, ...emojis]);

  const [cards, setCards] = useState(initialCards);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [foundPairs, setFoundPairs] = useState([]);
  const [revealedTexts, setRevealedTexts] = useState(placeholderTexts);
  const [displayTextIndex, setDisplayTextIndex] = useState(0);

  const handleRestart = () => {
    setCards(shuffle([...emojis, ...emojis]));
    setFlippedIndices([]);
    setFoundPairs([]);
    setRevealedTexts(placeholderTexts);
    setDisplayTextIndex(0);
  };

  const handleSolveGame = () => {
    setFlippedIndices(Array.from({ length: cards.length }, (_, index) => index));
    setFoundPairs([...emojis]);
    setDisplayTextIndex(placeholderTexts.length);
  };

  const handleSolveNext = () => {
    const hiddenPairs = cards
      .map((emoji, index) => ({ emoji, index }))
      .filter(({ emoji, index }) => !flippedIndices.includes(index) && !foundPairs.includes(emoji));

    if (hiddenPairs.length === 0) return;

    const randomHiddenPair = hiddenPairs[Math.floor(Math.random() * hiddenPairs.length)];
    setFlippedIndices([...flippedIndices, randomHiddenPair.index]);
    setDisplayTextIndex(displayTextIndex + 1);
  };

  useEffect(() => {
    if (foundPairs.length === 10) return;

    if (flippedIndices.length === 2) {
      const [index1, index2] = flippedIndices;
      if (cards[index1] === cards[index2]) {
        setFoundPairs([...foundPairs, cards[index1]]);
        setFlippedIndices([]);
        setDisplayTextIndex(displayTextIndex + 1);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards, foundPairs, displayTextIndex]);

  const handleCardClick = (index) => {
    if (flippedIndices.length < 2 && !flippedIndices.includes(index) && !foundPairs.includes(cards[index])) {
      setFlippedIndices([...flippedIndices, index]);
    }
  };

  const renderCards = () => {
    return cards.map((emoji, index) => (
      <div
        key={index}
        className={`card ${flippedIndices.includes(index) ? 'flipped' : ''}`}
        onClick={() => handleCardClick(index)}
      >
        {flippedIndices.includes(index) || foundPairs.includes(emoji) ? emoji : '❓'}
      </div>
    ));
  };

  const renderTextItems = () => {
    const displayedTexts = revealedTexts.slice(0, displayTextIndex);
    return displayedTexts.map((text, index) => (
      <div key={index} className="text-item">
        {text}
      </div>
    ));
  };

  return (
    <div className="container">
      <h2>Match two cards to learn a new AK fact!</h2>
      <div className="top-buttons">
        <button className="button" onClick={handleRestart}>Restart</button>
        <button className="button" onClick={handleSolveGame}>Give up? Solve Game</button>        
      </div>
      <div className="game-container">
        <div className="game-board">{renderCards()}</div>
        <div className="text-list">
          <div className="text-list-title">AK facts from AK:</div>
          {renderTextItems()}
        </div>
      </div>
    </div>
  );
};

function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

ReactDOM.render(<App />, document.getElementById('root'));