
////////////////////////////////////////////////////////////////////////////////
// Variable
////////////////////////////////////////////////////////////////////////////////
var hummus     = require('hummus'),

    fs         = require('fs'),

    splitter   = require('./split_pdf'),

    inputFile  = process.argv[2],

    outputFile = process.argv[3],

    startPage  = parseInt( process.argv[4], 10 ),

    endPage    = parseInt( process.argv[5], 10 ),

    outputFolder = process.argv[6],

    pdfWriter  = hummus.createWriter( outputFile );

console.log('inputFile: '  +inputFile);
console.log('outputFile: ' +outputFile);
console.log('startPage: '  +startPage);
console.log('endPage: '     +endPage);



////////////////////////////////////////////////////////////////////////////////
// Function
////////////////////////////////////////////////////////////////////////////////
thread_page = function(callback){

   pdfWriter.appendPDFPagesFromPDF( 

      inputFile,
      
      {
          type:hummus.eRangeTypeSpecific, 
        
          specificRanges: [ [ startPage, endPage ] ]
      }
   );
           
   pdfWriter.end();

   callback();

}


message_end = function (){
   
   process.send( 'I\'m done' );

   process.exit();
}



////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////

thread_page( function(){
   
   splitter( outputFile, outputFolder, function(){

      fs.unlinkSync( outputFile );

      message_end();
   });

});








