import React from 'react'
import request from 'request'
import cheerio from 'cheerio'

import './othello.css';

export default class Othello extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      a : [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1, 1, 0,-1,-1,-1],
        [-1,-1,-1, 0, 1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]

        // [-1,-1,-1,-1,-1,-1,-1,-1],
        // [-1,-1,-1,-1,-1,-1,-1,-1],
        // [-1,-1,-1,-1,-1,-1,-1,-1],
        // [-1,-1,-1,-1,-1,-1,-1,-1],
        // [1,-1,-1,-1,-1,-1,-1,-1],
        // [1,1,-1,-1,-1,-1,-1,-1],
        // [1,1,1,-1,-1,-1,-1,-1],
        // [0,1,-1,1,-1,-1,-1,-1]

        // [-1,-1,-1,-1,-1,-1,-1,1],
        // [-1,-1,-1,-1,-1,-1,-1,-1],
        // [-1,-1,-1,-1,-1,-1,-1,-1],
        // [-1,-1,-1,-1,-1,-1,-1,-1],
        // [-1,-1,-1,-1,-1,-1,-1,-1],
        // [-1,-1,-1,-1,-1,-1,-1,-1],
        // [1,-1,-1,-1,-1,-1,-1,-1],
        // [0,-1,-1,-1,-1,-1,-1,-1]
      ],
      turn : 0,
      demo: 0,
      winner: -1,
      black: 2,
      white: 2,
      player: 0,
      passes: 0
    }
  }

  reset(){
    this.setState({
      a : [
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1, 1, 0,-1,-1,-1],
        [-1,-1,-1, 0, 1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1]
      ],
      turn : 0,
      demo: 0,
      winner: -1,
      black: 2,
      white: 2,
      passes: 0
    }, ()=>{
      this.validMoves()
    })
  }

  gameResult(comp = 0){
    var a = this.state.a

    var neg = 0,
        one = 0,
        zero = 0

    for (var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        if(a[i][j]<0){
          neg+=1
        }else if (a[i][j]==1) {
          one+=1
        }else{
          zero+=1
        }
      }
    }

    if(neg==0 || comp){
      var winner = 2;
      if(one>zero){
        winner = 1
      }
      if(zero>one){
        winner = 0
      }
      this.setState({black: zero, white: one,winner: winner, demo: this.state.demo^1})
    }else{
      this.setState({black: zero, white: one, demo: this.state.demo^1})
    }
  }

  isValid(i,j){
    return i>=0 && i<8 && j>=0 && j<8
  }

  isAllowed(i,j){
    // console.log("Al");
    var a = this.state.a
    var t = this.state.turn

    // console.log("Al",t);

    if(a[i][j]>=0){
      return 0
    }

    for (var x = -1; x < 2; x++) {
      for (var y = -1; y < 2; y++) {
        if(x!=0 || y!=0){
          var tot = 0
          var m = i, n = j;

          while(this.isValid(m+x,n+y)){
            if(a[m+x][n+y]!=(t^1)){
              if(a[m+x][n+y]<0){
                tot = 0
              }
              // console.log("Un");
              if(tot){
                return 1
              }
              break
            }
            tot+=1
            m+=x
            n+=y
          }
        }
      }
    }

    // console.log("Log");
    return 0
  }

  updateBoard(i,j){
    var a = this.state.a
    var t = this.state.turn^1

    // console.log("Update",t,i,j);

    for (var x = -1; x < 2; x++) {
      for (var y = -1; y < 2; y++) {
        if(x!=0 || y!=0){
          var tot = 0
          var f = 0
          var m = i, n = j;
          while(this.isValid(m+x,n+y)){
            if(a[m+x][n+y]!=(t^1)){
              if(a[m+x][n+y]<0){
                tot = 0
              }else{
                f = 1
              }
              break
            }
            tot+=1
            m+=x
            n+=y
          }


          if(tot && f){
            // console.log("Lol");
            m = i
            n = j

            while(this.isValid(m+x,n+y)){
              if(a[m+x][n+y]!=(t^1)){
                break
              }
              a[m+x][n+y]^=1
              m+=x
              n+=y
            }

          }
        }
      }
    }

    this.setState({a:a, demo: this.state.demo^1},()=>{
      this.validMoves();
      this.gameResult();
    })
  }

  validMoves(){
    if(this.state.winner>=0) return

    if(this.state.passes>1){
      this.gameResult(1)
    }

    var a = this.state.a
    // var t = this.state.turn
    var count = 0
    // console.log("valid",t);

    for (var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        if(a[i][j]<0){
          if(this.isAllowed(i,j)){
            a[i][j] = -2
            count+=1
            // console.log(i,j,-2)
          }else{
            a[i][j] = -1
          }
        }
      }
    }

    if(count==0){
      if(this.state.passes<2){
        setTimeout(()=>{
          this.setState({a:a, passes: this.state.passes+1, turn: this.state.turn^1},()=>{
            this.validMoves()
          })
        },300);
      }
    }else{
      this.setState({a:a,passes: 0,demo: this.state.demo^1})
    }
  }

  opponent(){
    console.log("Opponent");
    if(this.state.winner>=0) return

    var a = this.state.a,
      t = this.state.turn,
      b = []

    for (var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        if(a[i][j]==-2){
          b.push([i,j])
        }
      }
    }

    if(b.length){
      var x = b[Math.floor(Math.random()*b.length)]
      a[x[0]][x[1]] = t
      this.setState({a:a,turn:this.state.turn^1},()=>{
        this.updateBoard(x[0],x[1])
      })
    }
  }

  move(i,j){
    // console.log("Move");
    if(this.state.winner>=0) return

    var a = this.state.a
    var t = this.state.turn

    if(a[i][j]<0 && this.isAllowed(i,j)){
      // console.log("isAllowed");
      a[i][j] = t
      this.setState({a:a,turn:this.state.turn^1},()=>{
        this.updateBoard(i,j)
        // setTimeout(()=>{
        //   this.opponent()
        // },400)
      })
    }

  }

  togglePiece(ele){
    console.log(ele.target);
    var piece = ele.target.parentElement;
    piece.classList.toggle("back");
  }

  componentWillMount(){
    this.validMoves()
  }

  render() {
    return (
      <div className="othello-game">
        <div className="score">
          <div className={this.state.turn==0?"points outlined":"points"}><div className="demopiece"></div><span>{this.state.black}</span></div>
          <div className={this.state.turn==1?"points outlined":"points"}><div className="demopiece white"></div><span>{this.state.white}</span></div>
        </div>
        <div className="board">
          {this.state.a.map((row,i)=>{
            return row.map((box,j)=>{
              return(
                <div className="box" onClick={()=>{
                  this.move(i,j)
                }}>
                  {box>=0?(
                    <div className={box==1 ? "piece":"piece back" }>
                      <div className="white"></div>
                      <div className="black"></div>
                    </div>
                  ):null}
                  {box==-2? (
                    <div className={this.state.turn==1 ? "avail":"avail avail-black"}></div>
                  ):null}
                </div>
              )
            })
          })}
        </div>
        {this.state.winner>=0?(
          <div className="winnercontainer">
            <div className="winnercard">
              <span className="result">
                {this.state.winner==0?"Black":null}
                {this.state.winner==1?"White":null}
                {this.state.winner<2?" won":null}
                {this.state.winner==2?"Draw":null}
              </span>
              <span className="again" onClick={this.reset.bind(this)}>Play again</span>
            </div>
          </div>
        ):null}
      </div>
    )
  }
}


// [0, 0, 0, 0, 0, 0, 1, -1],
// [0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, 0, 0, 0],
// [0, 0, 0, 1, 0, 0, 0, 0],
// [1, 1, 1, 0, 1, 1, 1, 1],
// [1, 1, 1, 1, 1, 1, 1, 1],
// [1, 1, 1, 1, 1, 1, 1, 1],
// [1, 1, 1, 1, 1, 1, 1, 1]
