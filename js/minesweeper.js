class Tile {
  constructor(color,isBomb) {
    this.color=color;     //color hex string
    this.isBomb=isBomb;   //true = tile is a bomb, false = safe
    this.visited=false;   //whether tile has been used
    this.nBorderBombs=0;  //number of bombs touching this tile
    this.safeMarked=false;
  }
}
///////////////////////
////END TILE CLASS////


class Board {
  constructor(size, difficulty){
    this.size = size;
    this.difficulty=difficulty;
    this.unUsedColor="#CCCCCF";
    this.usedColor="#888888";
    this.board=this.makeBoard();
    this.placeBombs();
    this.countBorderBombs();
  }

  //create new empty board
  makeBoard(){
    console.log("In makeBoard");
    var board = Array();
    for (var i=0; i<this.size; i++){
      var row = Array();
      for(var j=0; j<this.size; j++){
        row.push(new Tile(this.unUsedColor, false));
      }
      board.push(row);
    }
    return board;
  }

  //Place this.difficulty bombs randomly around the board
  placeBombs()
  {
    //Place bombs according to difficulty
    var placed = 0;
    while (placed < this.difficulty){
      var r = Math.floor(Math.random()*this.size);
      var c = Math.floor(Math.random()*this.size);
      //alert(r+", "+c);
      if (this.board[r][c].isBomb==false){
        this.board[r][c].isBomb=true;
        placed+=1;
      }
    }
  }

  //This feels bad.
  countBorderBombs() {
    for (var i=0; i < this.board.length; i++){
      for (var j=0; j<this.board[i].length; j++){
        for (var k=i-1; k<=i+1; k++){
          for (var l=j-1; l<=j+1; l++){
            if (k>=0 && k<this.board.length && l>=0 && l<this.board[i].length){
              if (this.board[k][l].isBomb){
                this.board[i][j].nBorderBombs+=1;
              }
            }
          }
        }
        if (this.board[i][j].isBomb){
          this.board[i][j].nBorderBombs-=1;
        }
      }
    }
  }

  redrawBoard(boardID){
    var boardDiv = $(boardID);
    boardDiv.empty();
    for (var i = 0; i < this.size; i++){
      for (var j = 0; j < this.size; j++){
        var newTile = document.createElement("div");
        newTile.id = "tile"+i+"-"+j;
        newTile.classList.add('tile');
        if (this.board[i][j].safeMarked) {
          newTile.classList.add('glyphicon');
          newTile.classList.add('glyphicon-flag');
          newTile.style.backgroundColor = this.unUsedColor;
        }
        else if (this.board[i][j].isBomb){ //Color all bombs red for testing
          newTile.style.backgroundColor = "#CCCCCF"; //"#CC3333";
        }
        else if (this.board[i][j].visited) {
          if (this.board[i][j].nBorderBombs==0){ //If visited and adjacent to no bombs
            newTile.style.backgroundColor=this.usedColor;
            newTile.style.border="none";
          } else { //If visited and adjacent to 1+ bombs
            newTile.innerHTML=this.board[i][j].nBorderBombs;
            newTile.style.backgroundColor = this.unUsedColor;
          }
        }
        else { //Tile not yet visited
          newTile.style.backgroundColor = this.unUsedColor;
        }
        boardDiv.append(newTile);
      }
    }
    this.attachClickListeners(boardID);
  }

  //Attach mousedown listener to game board tiles to respond to clicks
  attachClickListeners(boardID) {
    var board = this;
    $(".tile").mousedown(function(event){
      var id = $(this).attr('id');//.slice(id.length-3,id.length);
      id = id.substr(4).split("-"); //assume id has format 'tile[row]-[col]'
      var coords = [parseInt(id[0]), parseInt(id[1])];
      var currentTile=board.board[coords[0]][coords[1]];
      switch (event.which){
        case 1:
          if (board.board[coords[0]][coords[1]].safeMarked){
            board.board[coords[0]][coords[1]].safeMarked=false;
          }
          if (currentTile.isBomb){
            alert("BOOM!");
          } else if (currentTile.nBorderBombs==0){ //Open tile, borders 0 bombs
            board.revealOpen(coords[0],coords[1]);
          }
          else { //Non-bomb that borders bombs
            board.board[coords[0]][coords[1]].visited=true;
            board.redrawBoard(boardID);
          }
          break;
        case 3: //right mouse button
          if (!board.board[coords[0]][coords[1]].visited) {
            board.board[coords[0]][coords[1]].safeMarked = !board.board[coords[0]][coords[1]].safeMarked;
            board.redrawBoard(boardID);
          }
      }
    });
  }



  //Reveal all open (0 border bomb) tiles connected to tile with
  //coordinates (r, c)
  revealOpen(r, c) {
    var revealCoords = [];
    this.revealHelper(r, c, revealCoords);
    this.redrawBoard("#game-board");
  }

  //dfs search for all connected to safe clicked tile
  revealHelper(r, c, revealCoords)
  {
    if (r<0 || r>=this.board.length || c<0 || c>=this.board[0].length){
      return;
    } else if (this.board[r][c].nBorderBombs!=0 || this.board[r][c].visited) {
      this.board[r][c].visited=true;
      return;
    }
    revealCoords.push([r, c]);
    this.board[r][c].visited=true; //So we don't revisit this tile.
    for (var i = r-1; i <= r+1; i++){
      for (var j=c-1; j<=c+1; j++){
        if (i!=r || j!=c){
          var diff = Math.abs(r-i) + Math.abs(c-j);
          if (diff!=2){
            this.revealHelper(i, j, revealCoords);
          }
        }
      }
    }
  }

}
///////////////////////
////END BOARD CLASS////


var board = new Board(20, 35);
$(document).ready(function(){
  //Create and draw board.
  board.redrawBoard("#game-board");
});
