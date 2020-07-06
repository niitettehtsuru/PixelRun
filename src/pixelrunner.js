/*
 * The pixelrunner(made up of connected adjacent vertices on the grid)
 * ------------------------------------------------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      6th July, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/PixelRun
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoZQvaV
 * @license:   GNU General Public License v3.0 
 */ 
class PixelRunner
{ 
    constructor(data)
    {        
        this.color = data.color; 
        this.radius = data.radius; 
        this.xCoord = data.vertex.x;
        this.yCoord = data.vertex.y;   
        this.size   = data.vertex.size;//length and breadth of the square in the grid
        this.horizontalOffset = data.horizontalOffset; 
        this.verticalOffset = data.verticalOffset;
        this.screenWidth = data.screenWidth; 
        this.screenHeight = data.screenHeight;    
        this.unitDistance = 8;//distance moved per animation frame   
        this.currentVertex = {x:this.xCoord,y:this.yCoord}; 
        this.body = [this.currentVertex];
        this.speed   = this.setInitialSpeed();
        this.nextVertex = this.getNextVertex();//the next point to move towards
        this.pixelRunnerLength = 14;  
    }  
    getNextVertex()//get the next point to move towards
    {
        let nextVertex = {x:0,y:0}; 
        if(this.speed.x > 0)//if pixelrunner is moving right
        {
            nextVertex = {x:this.xCoord + this.size,y:this.yCoord}; 
        }
        else if(this.speed.x < 0)//if pixelrunner is moving left
        {
            nextVertex = {x:this.xCoord - this.size,y:this.yCoord}; 
        } 
        if(this.speed.y > 0)//if pixelrunner is moving down
        {
            nextVertex = {x:this.xCoord,y:this.yCoord + this.size}; 
        }
        else if(this.speed.y < 0)//if pixelrunner is moving up
        {
            nextVertex = {x:this.xCoord,y:this.yCoord - this.size}; 
        }  
        return nextVertex; 
    }
    //Sets the speed at start. Pixelrunner is set to only move perpendicular to the x-axis or the y-axis. 
    setInitialSpeed()
    {
        let x = 0;
        let y = 0;
        //flip a coin to decide if pixelrunner moves horizontally or vertically 
        if(Math.random() > 0.5)//for horizontal movement    
        {   //flip a coin to decide if pixelrunner moves left or right 
            x = Math.random() > 0.5? -this.unitDistance: this.unitDistance;
        }
        else//for vertical movement
        {   //flip a coin to decide if pixelrunner moves upwards or downwards
            y = Math.random() > 0.5? -this.unitDistance: this.unitDistance;
        } 
        return {x:x,y:y};  
    } 
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    * @param  {number} min The lesser of the two numbers. 
    * @param  {number} max The greater of the two numbers.  
    * @return {number} A random number between min (inclusive) and max (exclusive)
    */
    getRandomNumber(min, max) 
    {
        return Math.random() * (max - min) + min;
    }
    //randomly set the pixelrunner to move up,down,right or left
    setRandomNewDirection() 
    {
        let directions = ['up','down','left','right'];
        let direction = ~~this.getRandomNumber(0, directions.length);; 
        switch(directions[direction])
        {
            case 'up':
                this.speed.x = 0; 
                this.speed.y = -this.unitDistance; 
                break; 
            case 'down': 
                this.speed.x = 0; 
                this.speed.y = this.unitDistance; 
                break; 
            case 'left': 
                this.speed.x = -this.unitDistance; 
                this.speed.y = 0; 
                break; 
            case 'right':
                this.speed.x = +this.unitDistance; 
                this.speed.y = 0;
                break;  
        }
    } 
    nextVertexIsOnTheGrid(nextVertex)
    {   
        if
        (
            nextVertex.x < this.horizontalOffset ||//vertex is beyond the left wall 
            nextVertex.x + this.size > this.screenWidth - this.horizontalOffset ||//vertex is beyond the right wall 
            nextVertex.y < this.verticalOffset ||//vertex is beyond the top wall 
            nextVertex.y + this.size > this.screenHeight - this.verticalOffset//vertex is beyond the bottom wall
        )
        { 
            return false;//vertex is outside the grid
        }   
        return true;  
    } 
    checkIfNextVertexIsReached() 
    { 
        //get the distance between the head of the pixelrunner and the next vertex
        let dx = this.nextVertex.x - this.xCoord; 
        let dy = this.nextVertex.y - this.yCoord;
        let distance = Math.sqrt(dx * dx + dy * dy);  
        //if the distance is not more than a step away, the next vertex is reached
        if(distance <= this.unitDistance)
        { 
            //push the head of the pixelrunner to the next vertex
            this.xCoord = this.nextVertex.x; 
            this.yCoord = this.nextVertex.y;     
            //once the destination is reached, the current vertex becomes the next vertex
            this.currentVertex = this.nextVertex;
            this.setRandomNewDirection();//set to go either up, down, left or right 
            //get a new next vertex based on the current heading
            this.nextVertex = this.getNextVertex();
            while(!this.nextVertexIsOnTheGrid(this.nextVertex))//make sure the next vertex is on the grid
            {
                this.setRandomNewDirection();
                this.nextVertex = this.getNextVertex();
            }
            this.body.push(this.currentVertex);//add the new vertex to the body  
            if(this.body.length > this.pixelRunnerLength)//if body is too long
            {
                this.body.shift();//strip the tail 
            }
            return true; 
        }
        return false;  
    } 
    update()
    {       
        //keep the head of the pixelrunner moving in its current direction 
        this.xCoord += this.speed.x;//if head of the pixelrunner is going left or right, keep it going
        this.yCoord += this.speed.y;//if head of the pixelrunner is going up or down, keep it going    
        this.checkIfNextVertexIsReached();
    } 
    draw()//draw the pixelrunner
    {     
        let radius = this.radius; 
        let size = this.size;
        let color = this.color; 
        //draw the head of the pixelrunner
        fill('white');   
        ellipse(this.xCoord,this.yCoord,radius*2,radius*2);
        fill('black');   
        ellipse(this.xCoord,this.yCoord,radius,radius); 
        //draw squares at each vertex that make up the body
        this.body.forEach(function(body)
        { 
            fill(color); 
            rect(body.x,body.y,size,size);
        }); 
        //draw the lines connecting the vertices that make up the body
        stroke('white'); 
        let xCoord = this.xCoord; 
        let yCoord = this.yCoord; 
        if(this.body.length > 2)
        {
            //draw the rest of the body 
            for(let i = 0; i < this.body.length;i++)
            {
                if(i === this.body.length-1)//draw lines from the most recent vertex to the head
                {
                    let prev = this.body[i];
                    let next = {x:xCoord,y:yCoord}; 
                    this.drawLinesBetweenVertices(prev,next);
                }
                else//draw lines to connect adjacent vertices in the body
                {
                    let prev = this.body[i];
                    let next = this.body[i+1]; 
                    this.drawLinesBetweenVertices(prev,next);
                } 
            } 
        }  
        noStroke();  
    }  
    //draws 3 lines to link one adjacent vertex in the body to the next
    drawLinesBetweenVertices(prevPoint,nextPoint) 
    {  
        if(prevPoint.x < nextPoint.x || //if previous point is to the left of next point
                prevPoint.x > nextPoint.x)//or previous point is to the right of next point
        {
            //draw top line
            line(prevPoint.x, prevPoint.y - this.radius,nextPoint.x,nextPoint.y-this.radius); 
            //draw bottom line
            line(prevPoint.x, prevPoint.y + this.radius,nextPoint.x,nextPoint.y+this.radius); 
            //draw middle line
            line(prevPoint.x, prevPoint.y,nextPoint.x,nextPoint.y); 
        } 
        else if(prevPoint.y < nextPoint.y || //if previous point is above next point
                prevPoint.y > nextPoint.y)//if previous point is below next point
        {
            //draw left line
            line(prevPoint.x - this.radius, prevPoint.y,nextPoint.x - this.radius,nextPoint.y); 
            //draw right line
            line(prevPoint.x + this.radius, prevPoint.y,nextPoint.x + this.radius,nextPoint.y);
            //draw middle line
            line(prevPoint.x, prevPoint.y,nextPoint.x,nextPoint.y); 
        } 
    }
} 
 