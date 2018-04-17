module.exports = function (page){
  
   var res;

  //error messages
  var err1 = "CF not found";

  
  //fast cf
  var fast_cf = /[a-zA-Z]{6}[a-zA-Z0-9]{2}[a-zA-Z][a-zA-Z0-9]{2}[a-zA-Z][a-zA-Z0-9]{3}[a-zA-Z]/g;

//RegExp based on official CF format
   var cff =  /^(?:[B-DF-HJ-NP-TV-Z](?:[AEIOU]{2}|[AEIOU]X)|[AEIOU]{2}X|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[\dLMNP-V][1-9MNP-V]|[1-9MNP-V][0L]))[A-Z]$/g;

  
  //first scan with fast_cf pattern
  var found = page.match(fast_cf);
  
  if (found == null){
    
    console.log(err1);
    
    return null;
  } 

   for( let i = 0; i < found.length; i++ ){
      
           res = found[i].match(cff); 
      
      if( res != null ) return found[i];
}
      



   console.log( 'cf found: ' + found + '\n' ); 
    
   
}