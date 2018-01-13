function Calculator(inputString) {
  this.tokenStream = this.lexer(inputString);
}

Calculator.prototype.lexer = function(inputString) {
  var tokenTypes = [
    ["NUMBER",    /^\d+/ ],
    ["ADD",       /^\+/  ],
    ["SUB",       /^\-/  ],
    ["MUL",       /^\*/  ],
    ["DIV",       /^\//  ],
    ["LPAREN",    /^\(/  ],
    ["RPAREN",    /^\)/  ]
  ];

  var tokens = [];
  var matched = true;

  while(inputString.length > 0 && matched) {
    matched = false;

    tokenTypes.forEach(tokenRegex => {
      var token = tokenRegex[0];
      var regex = tokenRegex[1];

      var result = regex.exec(inputString);

      if(result !== null) {
        matched = true;
        tokens.push({name: token, value: result[0]});
        inputString = inputString.slice(result[0].length)
      }
    })

    if(!matched) {
      throw new Error("Found unparseable token: " + inputString);
    }

  }

  return tokens;
};

Calculator.prototype.peek = function() {
  return this.tokenStream[0] || null;
}

Calculator.prototype.get = function() {
  return this.tokenStream.shift();
}

Calculator.prototype.parseA = function () {
  var nextToken = this.peek();
  if(nextToken && nextToken.name === "ADD") {
    this.get();
    return new TreeNode("A", "+", this.parseTerm(), this.parseA());
  } else if(nextToken && nextToken.name == "SUB") {
    this.get();
    return new TreeNode("A", "-", this.parseTerm(), this.parseA());
  } else {
    return new TreeNode("A")
  }
};

Calculator.prototype.parseB = function() {
  var nextToken = this.peek();
  if(nextToken && nextToken.name === "MUL") {
    this.get();
    return new TreeNode("B", "-", this.parseFactor(), this.parseB());
  } else if(nextToken && nextToken.name === "DIV") {
    this.get();
    return new TreeNode("B", "-", this.parseAFactor(), this.parseB());
  } else {
    return new TreeNode("B");
  }
}

Calculator.prototype.parseFactor = function() {
  if(this.peek().name === "LPAREN") {
   this.get(); // we need this to remove the LPAREN
   var expr = this.parseExpression();
   this.get();
   return new TreeNode("Factor", "(", expr, ")");
 } else if (this.peek().name === "NUMBER") {
   return new TreeNode('Factor', this.get().value);
 } else if (this.peek().name === 'SUB') {
   return new TreeNode('Factor', '-', this.parseFactor());
 } else {
   throw new Error('No Factor found')
 }

};

Calculator.prototype.parseTerm = function() {
  var factor = this.parseFactor();
  var b = this.parseB();

  return new TreeNode('Term', factor, b);
}

Calculator.prototype.parseExpression = function() {
  var term = this.parseTerm();
  var a = this.parseA();

  return new TreeNode('Expression', term, a);
}

function TreeNode(name, ...children) {
  this.name = name;
  this.children = children;
}




TreeNode.prototype.accept = function(visitor) {
  return visitor.visit(this);
}

function PrintOriginalVisitor() {
  this.visit = function(node) {
    switch(node.name) {
      case "Expression":
        break;
      case "Term":
        break;
    }
    // etc
  }
}


var calc = new Calculator("3+4*5");
var tree = calc.parseExpression()
var printOriginalVisitor = new PrintOriginalVisitor()
console.log(tree.accept(printOriginalVisitor));




// var calculator = new Calculator("(3)");

// make a fake version of parseExpression
// var fakeExpressionTreeNode = new TreeNode("Expression", "3");
// calculator.parseExpression = function() {
//   this.get(); // remove the 3 when parseFactor runs
//   return fakeExpressionTreeNode;
// }
//
// var output = calculator.parseFactor();
// // console.log(output)
// check that
// output.name == "Factor"
// output.children = ["(", fakeExpressionTreeNode,
