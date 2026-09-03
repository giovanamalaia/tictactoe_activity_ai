'use strict';

// WINNING_COMBOS, checkWinner, getNextPlayer, applyMove, createInitialState
// are provided by game.js, loaded before this script.

const cells    = document.querySelectorAll('.cell');
const status   = document.getElementById('status');
const restartBtn     = document.getElementById('restart');
const resetScoreBtn  = document.getElementById('reset-score');
const scoreX   = document.getElementById('score-x');
const scoreO   = document.getElementById('score-o');

let state = createInitialState();

// Placar do jogo: começa com 0 vitórias para cada jogador
const score = { X: 0, O: 0 };

// Mapeamento de identificadores internos para emojis na interface
const SYMBOL = { X: '\u{1F431}', O: '\u{1F436}' };

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = SYMBOL[state.board[i]] ?? '';
    cell.className   = 'cell' + (state.board[i] ? ` ${state.board[i].toLowerCase()}` : '');
    cell.disabled    = state.board[i] !== '' || state.gameOver;
  });
}

function setStatus(msg, cls = '') {
  status.textContent = msg;
  status.className   = 'status' + (cls ? ` ${cls}` : '');
}

/** Atualiza os valores exibidos no placar. */
function updateScoreDisplay() {
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
}

function handleClick(e) {
  const idx = Number(e.currentTarget.dataset.index);
  if (state.board[idx] || state.gameOver) return;

  const nextBoard = applyMove(state.board, idx, state.current);
  if (!nextBoard) return;
  state.board = nextBoard;
  render();

  // Animate the placed cell
  cells[idx].classList.add('placed');

  const result = checkWinner(state.board);

  if (result) {
    state.gameOver = true;
    if (result.winner) {
      score[result.winner]++;                // incrementa a pontuação do vencedor
      updateScoreDisplay();                  // atualiza o placar na tela
      result.combo.forEach(i => cells[i].classList.add('winning'));
      setStatus(`Player ${SYMBOL[result.winner]} wins!`, 'win');
    } else {
      setStatus("It's a draw!", 'draw');
    }
    // Disable all cells
    cells.forEach(c => (c.disabled = true));
    return;
  }

  state.current = getNextPlayer(state.current);
  setStatus(`Player ${SYMBOL[state.current]}'s turn`);
}

function restartGame() {
  state = createInitialState();
  render();
  setStatus(`Player ${SYMBOL.X}'s turn`);
}

/** Zera o placar e reinicia a partida. */
function resetScore() {
  score.X = 0;
  score.O = 0;
  updateScoreDisplay();
  restartGame();
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
resetScoreBtn.addEventListener('click', resetScore);

// Initial render
render();
updateScoreDisplay();
setStatus(`Player ${SYMBOL.X}'s turn`);
