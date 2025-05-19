import { useEffect, useState } from 'react';
import json from '../public/placas.json';
import right from '../public/right.mp3';
import wrong from '../public/wrong.mp3';

type Placa = {
  name: string;
  image: string;
  alt1: string;
  alt2: string;
  alt3: string;
};

function App() {
  const placas: Placa[] = json.placas;
  const [actualSign, setActualSign] = useState<Placa | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [actualScore, setActualScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem('bestScore')) || 0
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [correctAudio] = useState(new Audio(right));
  const [wrongAudio] = useState(new Audio(wrong));

  useEffect(() => {
    generateNewRound();

    correctAudio.volume = 0.3;
    wrongAudio.volume = 0.3;
    return () => {
      correctAudio.pause();
      wrongAudio.pause();
    };
  }, []);

  function getRandomSign<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  function generateNewRound() {
    const correct = getRandomSign(placas);
    const incorrects = [correct.alt1, correct.alt2, correct.alt3];
    const allOptions = [correct.name, ...incorrects].sort(() => 0.5 - Math.random());

    setActualSign(correct);
    setOptions(allOptions);
    setSelected(null);
    setImageLoaded(false);
  }

  function handleOptionClick(option: string) {
    if (selected !== null) return;
    setSelected(option);
    if (option === actualSign?.name) {
      correctAudio.currentTime = 0;
      correctAudio.play();

      const newScore = actualScore + 1;
      setActualScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('bestScore', String(newScore));
      }
    } else {
      wrongAudio.currentTime = 0;
      wrongAudio.play();
      setActualScore(0);
    }
  }

  return (
    <div className="container">
      <div className="game">
        <h1>Adivinhe a Placa</h1>
        <div className="scores">
          <div className="bestScore">
            <i className="fa-solid fa-crown"></i> Recorde: {bestScore}
          </div>
          <div className="actualScore">Pontos: {actualScore}</div>
        </div>

        <div className="sign">
          {actualSign && (
            <>
              {!imageLoaded && (
                <div className="loading">
                  <i className="fa-solid fa-spinner fa-spin"></i> Carregando imagem...
                </div>
              )}
              <img
                src={actualSign.image}
                alt="Placa"
                style={{ display: imageLoaded ? 'block' : 'none' }}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          )}

          {options.map(option => (
            <button
              key={option}
              className={
                selected === null
                  ? 'option'
                  : option === actualSign?.name
                  ? 'right'
                  : selected === option
                  ? 'wrong'
                  : 'option'
              }
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}

          {selected !== null && (
            <button className="next" onClick={generateNewRound}>
              Próxima <i className="fa-solid fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
