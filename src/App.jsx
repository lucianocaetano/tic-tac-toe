import { useState } from 'react'

const TURNS = {
  X: "x",
  O: "o"
}

const Square = ({children, isSelected, update, index}) => {
  const className = `square ${isSelected ? "is-selected" : ""}`

  const handleClick = () => {
    update(index)
  }

  return (
    <div onClick={handleClick} className={className} key={index}>
      {children}
    </div>
  )
}

const WIN_COMBOS = [
  //horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  //diagonal
  [0, 4, 8],
  [2, 4, 6],
]

function App() {

  const [board, setBoard] = useState(
    () => (
      localStorage.getItem("board")?
      JSON.parse(localStorage.getItem("board")) :
      Array(9).fill(null)
    )
  )
  const [turn, setTurn] = useState(
    ()=>(
      localStorage.getItem("turn") ?
      localStorage.getItem("turn") :
      TURNS.X
    )
  )

  //null = no ganador, false = empate, true = ganador
  const [ win, setWin] = useState(null)

  const checkWin = (boardToCheck) => {
    for (const combo of WIN_COMBOS){
      const [a, b, c] = combo
      if(
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ){

        return boardToCheck[a]
      }
    }
    //no hay ganador
    return null
  }


  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {
    //que no se rescriba la tabla y que si se gano se para el juego
    if (board[index] || win)
      return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    setTurn(turn === TURNS.X ? TURNS.O : TURNS.X)

    //guardar
    localStorage.setItem("board", JSON.stringify(newBoard))
    localStorage.setItem("turn", turn === TURNS.X ? TURNS.O : TURNS.X)

    const newWin = checkWin(newBoard)
    if(newWin){
      setWin(newWin)
    }else if (checkEndGame(newBoard)) {
      setWin(false)
    }
  }

  const restGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWin(null)
    localStorage.removeItem("board")
    localStorage.removeItem("turn")
  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>

      <section className="game">
        {
          board.map((data, index) => {
            return (
              <Square key={index} index={index} update={updateBoard}>
                {board[index]}
              </Square>
            )
          })
        }
      </section>

      {
        win !== null && (
          <section className="winner">
            <div className="text">
              <h2>
                {
                  win == false ? "Empate" : "Gano: "
                }
              </h2>
              <header className="win">
                {win && <Square>{win}</Square>}
              </header>
              <footer>
                <button onClick={restGame}>Empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )
      }

      <section className="turn" style={{display: (win !== null? "none": "")}}>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
    </main>
  )
}

export default App
