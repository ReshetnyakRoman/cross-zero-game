import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square(props) {
	return (
		<button 
			className={props.class} 
			onClick={props.onClick}>
			{props.value}
		</button>
		);
}


class Board extends React.Component {

	renderSquare(i) {
		return (
			<Square 
				key = {i}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
				class={this.props.class[i]}
			 />
		 );
	}	

	createBoard(board){
		let rows = [];
		
		for (let i=0; i<3; i++) {
			
			let cells = []; 

			for (let j=i*3; j<i*3+3; j++) {
				cells.push( board.renderSquare(j) );
			}

			rows.push(<div key={i} className="board-row">{cells}</div>);
		}
	return rows
	}
	

	render(){		
		return (
			<div>{this.createBoard(this)}</div>
			);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			history:[{
				squares: Array(9).fill(null)
			}],
			stepNumber:0,
			xIsNext: true,
			location:[{
				row:'',
				cal:'',
			}],
			class:Array(9).fill('square'),
			isAsc:true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length-1]
		const squares = current.squares.slice();
		const location =  this.state.location.slice(0, this.state.stepNumber + 1);
		const squareClass =  this.state.class.slice();

		if(calculateWinner(squares)[0] || squares[i]){
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		
		if(calculateWinner(squares)[0]){
			const winningCells = calculateWinner(squares)[1]

			for (let wCell of winningCells) {
				squareClass[wCell] = 'square win';
			}

			this.setState({
				class:squareClass,
			})
		}

		this.setState({
			history: history.concat([{
				squares:squares
			}]),
			stepNumber:history.length,
			xIsNext:!this.state.xIsNext,
			location: location.concat([{
				row:Math.ceil((i+1)/3),
				cal:i+1-(Math.ceil((i+1)/3)-1)*3
			}]),
		});

	}

	changeSorting() {
		const isAsc = this.state.isAsc;


		this.setState({
			isAsc:!isAsc,
		});
	}

	jumpTo(move) {
		const location = this.state.location;
		this.setState({
			stepNumber:move,
			xIsNext:(move % 2) === 0,
			location:location,
			class:Array(9).fill('square')
		})
	}

	render(){
		const history = this.state.history;
		const squareClass = this.state.class;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const location = this.state.location;
		const isAsc = this.state.isAsc;
		let moves = history.slice(0,this.state.stepNumber+1).map((step,moveNumber) => {
			const decription = moveNumber ? 
				`Go to move #${moveNumber} (${location[moveNumber].row},${location[moveNumber].cal})`: 
				'Go to game Start';
			
			return (
				<li key={moveNumber}>
					<button onClick={()=>{this.jumpTo(moveNumber)}}>
					{
						moveNumber === history.length-1 && moveNumber!==0 ? <b>{decription}</b> : decription
					}
					</button>
				</li>
				)
		});

		if (!isAsc) {
			moves = moves.reverse()
		}


		let status;
		
		if(winner[0]){
			status = `Winner is:  ${winner[0]}`;
		}else if( isDraw(current.squares) ){
			status = 'Ничья';
			alert('Ничья');
		}else {
			status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
		}

		let sortType = this.state.isAsc ? 'Sort desc.' : 'Sort asc.'
		

		return (
			<div className="game">
				<div className="game-board">
				<div>{status}</div>
					<br/>
					<Board 
						key = {1}
						class={squareClass}
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					 />
				</div>

				<div className="game-info">
					<button onClick={() => this.changeSorting() }>
						{sortType}
					</button>
					<ol reversed={ isAsc ? '' : 'reversed'}>{moves}</ol>
				</div>
			</div>	
			)
	}
}

ReactDOM.render(
	<Game />,
	document.getElementById('root')
	)


function calculateWinner(squares) {
	const lines = [
	    [0, 1, 2],
	    [3, 4, 5],
	    [6, 7, 8],
	    [0, 3, 6],
	    [1, 4, 7],
	    [2, 5, 8],
	    [0, 4, 8],
	    [2, 4, 6],
	  ];
	 for (let i=0; i<lines.length; i++){
	 	const [a,b,c] = lines[i];
	 	if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
	 		return [squares[a],[a,b,c]];
	 	}
	 }
	 return [null,null];

}

function isDraw(squares) {
	if ( squares.indexOf(null) === -1 &&  !calculateWinner(squares)[0] ) return true;
	return false;
}