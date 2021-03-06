const THREE = require('three')

// A class used to encapsulate the state of a turtle at a given moment.
// The Turtle class contains one TurtleState member variable.
// You are free to add features to this state class,
// such as color or whimiscality
var TurtleState = function(pos, dir) {
    return {
        pos: new THREE.Vector3(pos.x, pos.y, pos.z),
        dir: new THREE.Vector3(dir.x, dir.y, dir.z)
    }
}
  
export default class Turtle {
    
    constructor(scene, grammar) {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
        this.scene = scene;
        this.stack = [];
        this.angle = Math.floor(Math.random() * 10) * 5;
        this.scale = 0.1;
        
        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, this.angle, 0, 0),
                '-' : this.rotateTurtle.bind(this, -this.angle, 0, 0),
                'F' : this.makeCylinder.bind(this, 2, this.scale),
                '[' : this.storeTurtlePosition.bind(this),
                ']' : this.restoreTurtlePosition.bind(this),
                'X' : this.XrotateTurtle.bind(this, 0, 90, 0),
                'A' : this.Adostuff.bind(this)
            };
        } else {
            this.renderGrammar = grammar;
        }
    }

    //turtle set angle
    setAngle(angle_in)
    {
//        if (typeof this.angle !== "undefined") {
//			this.angle = angle_in;
//		}   
//        var a = angle_in;
//        this.angle = angle_in;
//        console.log(this.angle);
    }
    
    Adostuff()
    {
//        var i = new TurtleState(this.state.pos, this.state.dir);
//        console.log(i.pos);
        // load a simple obj mesh
        //console.log("Adostuff");
//        var fruit = this.scene.getObjectByName("fruit");
//        if(typeof fruit !== 'undefined')
//            {
//                //console.log()
//                fruit.position.set(this.state.pos.x, this.state.pos.y-0.4, this.state.pos.z);
//                //fruit.rotate(5,0,0);
//                console.log(fruit.position)
//            }
    
        var geometry = new THREE.SphereGeometry( 0.2, 10, 10 );
        var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        var sphere = new THREE.Mesh( geometry, material );
        this.scene.add( sphere );
        
        sphere.position.set(this.state.pos.x, this.state.pos.y, this.state.pos.z);
        
    }
                   
    XrotateTurtle(x, y, z) {
        
        //console.log(this.angle);
        
        var e = new THREE.Euler(
                x * 3.14/180,
				y * 3.14/180,
				z * 3.14/180);
        this.state.dir.applyEuler(e);
    }

    
    
    //stores the position of the turtle in a stack
    storeTurtlePosition()
    {
        var i = new TurtleState(this.state.pos, this.state.dir);
        this.stack.push(i);
    }
    
    restoreTurtlePosition()
    {
        this.state = this.stack.pop();
    }
    
    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear() {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));        
    }

    // A function to help you debug your turtle functions
    // by printing out the turtle's current state.
    printState() {
        console.log(this.state.pos)
        console.log(this.state.dir)
    }

    // Rotate the turtle's _dir_ vector by each of the 
    // Euler angles indicated by the input.
    rotateTurtle(x, y, z) {
        
        //console.log("Rotating");
        
        var e = new THREE.Euler(
                x * 3.14/180,
				(y + (Math.floor(Math.random() * 10) * (Math.floor(Math.random() * 10) - 5))) * 3.14/180,
				(z + (Math.floor(Math.random() * 10) * (Math.floor(Math.random() * 10) - 5))) * 3.14/180);
        this.state.dir.applyEuler(e);
    }

    // Translate the turtle along the input vector.
    // Does NOT change the turtle's _dir_ vector
    moveTurtle(x, y, z) {
	    var new_vec = THREE.Vector3(x, y, z);
	    this.state.pos.add(new_vec);
    };

    // Translate the turtle along its _dir_ vector by the distance indicated
    moveForward(dist) {
        var newVec = this.state.dir.multiplyScalar(dist);
        this.state.pos.add(newVec);
    };
    
    // Make a cylinder of given length and width starting at turtle pos
    // Moves turtle pos ahead to end of the new cylinder
    makeCylinder(len, width) {
        //console.log("Moving forward");
        //console.log(width);
        
        var geometry = new THREE.CylinderGeometry(width, width, len);
        var material = new THREE.MeshBasicMaterial( {color: 0x7D4900} );
        var cylinder = new THREE.Mesh( geometry, material );
        this.scene.add( cylinder );
        
        
        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        cylinder.applyMatrix(mat4);


        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * len));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        cylinder.applyMatrix(mat5);
        
        
        //Scoot the turtle forward by len units
        this.moveForward(len/2);
    };
    
    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
        //this.scale = symbolNode.it/10;
        //console.log("scale " + this.scale);
        var func = this.renderGrammar[symbolNode.value];
        if (func) {
            func();
        }
    };

    // Invoke renderSymbol for every node in a linked list of grammar symbols.
    renderSymbols(linkedList) {
        var currentNode;
        for(currentNode = linkedList.head; currentNode != null; currentNode = currentNode.next) {
            this.renderSymbol(currentNode);
        }
    }
}