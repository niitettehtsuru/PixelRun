/*
 * Sets everything up
 * ------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      6th July, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/PixelRun
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoZQvaV
 * @license:   GNU General Public License v3.0 
 */
let  
pixelRunners = [],
radius = 10,//radius of the connected nodes that form the pixelrunner 
blockSize = 50,//length and breadth of a square in the grid 
horizontalOffset = 0, 
verticalOffset = 0,
backgroundColor = 'rgba(0,0,0,1)';//black 
//get the width and height of the browser window 
function getBrowserWindowSize() 
{
    let 
    win = window,
    doc = document,
    offset = 20,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    browserWindowWidth = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight;  
    return {width:browserWindowWidth-offset,height:browserWindowHeight-offset}; 
} 
/**
* Returns a random number between min (inclusive) and max (exclusive)
* @param  {number} min The lesser of the two numbers. 
* @param  {number} max The greater of the two numbers.  
* @return {number} A random number between min (inclusive) and max (exclusive)
*/
function getRandomNumber(min, max) 
{
    return Math.random() * (max - min) + min;
}
function getRandomColor() 
{
    let colors = 
    [
        'rgba(128,128,0,0.2)',//olive
        'rgba(0,128,128,0.2)',//teal
        'rgba(128,0,0,0.2)',//maroon
        'rgba(128,0,128,0.2)',//purple
        'rgba(0,128,0,0.2)',//green
        'rgba(128,128,128,0.2)',//gray
        'rgba(0,0,255,0.2)',//blue
        'rgba(255,255,0,0.2)',//yellow
        'rgba(255,215,0,0.2)',//gold
        'rgba(255,69,0,0.2)',//orange red
        'rgba(189,183,107,0.2)',//dark khaki
        'rgba(139,69,19,0.2)',//saddle brown
        'rgba(188,143,143,0.2)',//rosy brown
        'rgba(240,255,240,0.2)',//honey dew
        'rgba(255,20,147,0.2)',//deep pink
        'rgba(0,191,255,0.2)',//deep sky blue
        'rgba(220,20,60,0.2)',//crimson
        'rgba(46,139,87,0.2)'//sea green
    ]; 
    return colors[~~getRandomNumber(0,colors.length)];  
}
/*Prepare the grid
 *----------------
 *Divide the canvas into square blocks  and get the upper left vertex of each square 
*/
function getGridVertices(blockSize,windowSize) 
{
    let gridVertices = [];  
    //How many squares can be set on the canvas horizontally?
    let numHorizontal = ~~(windowSize.width/blockSize);//num of squares that can be packed horizontally
    let horizontalRemainder = windowSize.width - blockSize * numHorizontal;//the space left when all squares are packed
    horizontalOffset = horizontalRemainder/2;//so an equal space is at the left and right ends of the grid
    //How many squares can be set on the canvas vertically? 
    let numVertical = ~~(windowSize.height/blockSize);//num of squares that can be packed vertically
    let verticalRemainder = windowSize.height - blockSize * numVertical;//the space left when all squares are packed  
    verticalOffset = verticalRemainder/2;//so an equal space is at the top and bottom ends of the grid  
    //get all points in the grid, starting from the top to the bottom
    for(let y = verticalOffset; y < windowSize.height; y+=blockSize)
    {  
        if(y+ blockSize > windowSize.height)//if the next point is beyond the bottom edge of the canvas
        {
            continue; //ignore it
        } 
        //all the while, getting all the horizontal points at each level
        for(let x = horizontalOffset; x < windowSize.width; x+=blockSize) 
        {  
            if(x+blockSize > windowSize.width)//if the next point is beyond the right edge of the canvas
            { 
                continue; //ignore it 
            }  
            gridVertices.push({x:x,y:y,size:blockSize}); 
        }   
    } 
    return gridVertices; 
} 
function createPixelRunners(numOfPixelRunners,vertices,width,height)
{
    let pixelRunners = [];
    for(let i = 0; i < numOfPixelRunners;i++)
    { 
        let index =  ~~((Math.random() * (vertices.length-1)) + 1);
        let vertex = vertices[index];//pick a random vertex for the pixelrunner's initial position  
        let data = 
        {
            vertex:vertex, 
            color:getRandomColor(), 
            horizontalOffset:horizontalOffset,
            verticalOffset:verticalOffset,
            screenWidth:width,
            screenHeight:height,
            radius:radius
        };  
        pixelRunners.push(new PixelRunner(data));
    }
    return pixelRunners; 
} 
function setNewGrid()//reset the grid
{ 
    pixelRunners = [];//get rid of all the pixelrunners
    let browserWindowSize = getBrowserWindowSize();   
    let vertices = getGridVertices(blockSize,browserWindowSize);  
    //create new pixelrunners
    let numOfPixelRunners = 10;  
    pixelRunners = createPixelRunners(numOfPixelRunners,vertices,width,height); 
    background(backgroundColor);
} 
function setup() 
{
    let browserWindowSize = getBrowserWindowSize();  
    createCanvas(browserWindowSize.width,browserWindowSize.height); 
    let vertices = getGridVertices(blockSize,browserWindowSize);  
    let numOfPixelRunners = 10; 
    pixelRunners = createPixelRunners(numOfPixelRunners,vertices,width,height);  
    document.addEventListener('click',(event)=>//when canvas is clicked,
    {    
        setNewGrid();
    });
    window.addEventListener('resize',function()//when browser window is resized
    { 
        let browserWindowSize = getBrowserWindowSize(); 
        resizeCanvas(browserWindowSize.width,browserWindowSize.height); 
        setNewGrid(); 
    }); 
}  
function draw() 
{  
    background(backgroundColor);      
    pixelRunners.forEach(function(pixelRunner) 
    {  
        pixelRunner.update();
        pixelRunner.draw(); 
    }); 
}