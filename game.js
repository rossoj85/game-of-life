

var gameOfLife = {
  setAlive: [],
  setDead: [],
  width: 12, 
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  createAndShowBoard: function () {
    
    // create <table> element
    var goltable = document.createElement("tbody");
    
    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    
    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);
    
    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
    
  },

  forEachCell: function (iteratorFunc) {
    /* 
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
    
    for(var x=0;x<this.height;x++){
      for(var y=0;y<this.width;y++)

      iteratorFunc(x,y)
    }
    
  },
  
  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y" 
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "click" events that allow a user to click on 
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"
    
    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white
    
    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board
    
    var onCellClick = function (e) {
      
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?
      
      // how to set the style of the cell when it's clicked
      if (this.dataset.status == 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
      
    };
    //*create vars
    var addListeners = function (x,y){
      // console.log(`${x}-${y}`)
      // console.log(document.getElementById(`${x}-${y}`))
      document.getElementById(`${x}-${y}`).addEventListener('click',onCellClick)
      // console.log('THIS ===',this)
    }
    var clearAllCells = function(x,y){
     let element= document.getElementById(`${x}-${y}`)
      element.className='dead'
      element.dataset.status='dead'
      console.log('FUCKING CLEARED')
    }
    var randomize=function(x,y){
      let num = Math.floor(Math.random()*2)
      console.log(num)
      // console.log(`${x}-${y}`)
      let element =  document.getElementById(`${x}-${y}`)
      if(num){
        element.className='alive'
        element.dataset.status='alive'
      }
    } 

    // var cell00 = document.getElementById('0-0');
    // cell00.addEventListener('click', onCellClick);

    //BINDINGS

    this.forEachCell(addListeners)
    this.step=this.step.bind(this)
    this.getNeighborhood=this.getNeighborhood.bind(this)
    //add functionality to buttons 
    document.getElementById('clear_btn').addEventListener('click',()=>this.forEachCell(clearAllCells))
    document.getElementById('reset_btn').addEventListener('click',()=>{
      this.forEachCell(clearAllCells)
      this.forEachCell(randomize)
    })
    document.getElementById('step_btn').addEventListener('click',()=>{
      this.forEachCell(this.step)
      this.applyStep()
    })
    document.getElementById('play_btn').addEventListener('click',()=>this.enableAutoPlay())

  },

  
  getNeighborhood: function(element,x,y){
    // console.log('NEIGHTBORS THIS', this)
    // console.log(x,y)
    let neighborhood=[]
    
      // console.log(element)
      for(var col = x-1;col<=x+1;col++){
        for(var row=y-1;row<=y+1;row++){
          // console.log(col, row)
          if(document.getElementById(`${col}-${row}`)){
              let neighbor=document.getElementById(`${col}-${row}`)
              if(neighbor!==element)neighborhood.push(neighbor)
          }
        }
      }
       
        console.log(neighborhood)
        return neighborhood
    
  },
  getLiveNeighbors(neighborhood){
    console.log('InsideNextStep',this)
    let liveNeighbors=neighborhood.filter(neighbor=>neighbor.dataset.status==='alive')
    
    if(liveNeighbors.length>0) console.log('Live Neighbors---',liveNeighbors)
    return liveNeighbors
  },
  setUpNextStep(element,liveNeighbors){
    // console.log(element.dataset.status==='alive',liveNeighbors.length)
    // console.log(element.dataset.status==='alive'&& (liveNeighbors.length===2||liveNeighbors.length===3))
    if(element.dataset.status==='alive'&& (liveNeighbors.length===2||liveNeighbors.length===3)){
      this.setAlive.push(element)
    }
    if(element.dataset.status==='alive'&&liveNeighbors.length<2){
      this.setDead.push(element)
    }
    if(element.dataset.status==='alive'&& liveNeighbors.length>3){
      this.setDead.push(element)
    }
    if(element.dataset.status==='dead'&&liveNeighbors.length===3){
      this.setAlive.push(element)
    }
    
  },
  applyStep(){
    this.setAlive.forEach(element=>{
      element.dataset.status='alive';
      element.className='alive';
    })
    this.setDead.forEach(element=>{
      element.dataset.status='dead';
      element.className='dead';
    })
    this.setDead=[]
    this.setAlive=[]
  },
  step: function (x,y) {
   
    let element= document.getElementById(`${x}-${y}`)
    let neighborhood=this.getNeighborhood(element,x,y)
    let liveNeighbors = this.getLiveNeighbors(neighborhood)
    this.setUpNextStep(element,liveNeighbors)
    console.log('setAlive',this.setAlive)
    console.log('setDead',this.setDead)
    
    return [this.setAlive, this.setDead]
  },

  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval 
    setInterval(()=>{
      this.forEachCell(this.step)
      this.applyStep()
    }, .3)

  }
  
};

gameOfLife.createAndShowBoard();
