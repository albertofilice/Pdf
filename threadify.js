////////////////////////////////////////////////////////////////////////////////
// Variable
////////////////////////////////////////////////////////////////////////////////

var hummus      = require('hummus'),

    fs          = require('fs'),

    cp          = require('child_process'),

    path        = require('path'),
    
    outputFiles = [],

    ranges = [];



////////////////////////////////////////////////////////////////////////////////
// Function
////////////////////////////////////////////////////////////////////////////////

create_outputFiles = function( outputFiles, dir, threads ){
 
   for( var i = 0; i < threads; i++ ){

      outputFiles.push( dir + `${i}.pdf` );
   }
}



create_ranges = function( threads, pages ){
   
   half_range = Math.floor( pages / threads );  

   for( var i = 0; i < threads; i++ ){
      
      ranges.push( i * half_range );
   }

   for( var i = 1; i < threads; i++ ){
      
      ranges.push( ranges[i]-1 );
   }

   ranges.push( pages -1 );     
}



launcher = function( outputFolder, inputFile, threads, callback ){
   
  var exit = 0;

  for( var i = 0; i < threads; i++ ){ 

      var parent = cp.fork("split_pdf_thread.js", 
         [inputFile, outputFiles[i], ranges[i], ranges[i+threads], outputFolder]);


      parent.on('message', message => {

         console.log( 'child says: ' + message );
         
         callback( ++exit ); 
      });
   }

   
}



////////////////////////////////////////////////////////////////////////////////
// module
////////////////////////////////////////////////////////////////////////////////

module.exports = function( inputFile, outputFolder, threads, callback ){ 

   var pages = hummus.createReader( inputFile ).getPagesCount();
   
   create_outputFiles( outputFiles, outputFolder, threads );

   console.log( outputFiles );

   create_ranges( threads, pages );
 
   console.log(ranges);

   launcher( outputFolder, inputFile, threads, function(exit){

      console.log('maybe we could be done' );

      if(exit == 4 ) callback();
   }); 
   
   
}









