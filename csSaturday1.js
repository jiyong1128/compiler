  //
	// * compiler
	// * Just-In-Time Compiler
	// * Interpreter

// read the text
// and do the action
// using the currently running program

   const JSstring = fs.readFileSync('./someJSfile', 'UTF-8')

JSstring.split('\n')
.forEach(function(line) {
    if (line.slice(0, 2) === 'var') {
      var varName = line.slice(4, 5) // x
      // get the value name,
      // figure out if the value is true or false;
      // if its the string true, select val to true
    } else if (line.slice(0, 7) === 'function') {
        // make a function
   }
})

## arithmedic expression

1 * (3 + 2) / 2 // expression
T   ---T-- ---T---  // terms
F   F   F    F    // factors
