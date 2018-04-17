var
express        = require('express'),
db = require('../db');
router         = express.Router(),
path           = require('path'),
multer         = require('multer'),
split_pdf      = require('../split_pdf'),
date           = require('node-datetime'),
fs             = require('fs'),


///////////////////////////////////////////////////////////////////
// 0. FORM HOME PAGE
///////////////////////////////////////////////////////////////////
router.get('/', function(req, res, next) {

  res.sendFile(

    path.resolve('./views/upload-form.html')
  )

})



////////////////////////////////////////////////////////////////////////////////
// 1. UPLOADED PAGE
////////////////////////////////////////////////////////////////////////////////


// STORAGE SETTING:

var storage = multer.diskStorage({

    destination: function(req, file, callback) {

      callback(null, './uploads')
    },

    filename: function(req, file, callback) {

      callback(null, file.fieldname + path.extname(file.originalname))

    }
})



// UPLOADING SETTING:

var uploading = multer({

  storage: storage,

  fileFilter: function(req, file, callback){

    var ext = path.extname(file.originalname)

    if (ext !== '.pdf') {

      return callback(res.end('Only PDF are allowed'), null)
    }

    callback(null, true)
  }
}).single('userFile');




// ROUTING UPLOAD FILE REQUEST:

router.post('/upload', uploading, function (req, res) {


   res.sendFile( path.resolve('./views/split.html')  );

});





////////////////////////////////////////////////////////////////////////////////
// 2. SPLITTED PAGE
////////////////////////////////////////////////////////////////////////////////

router.get('/split', function (req, res) {

   var now = date.create();

   global.formatted = now.format('d-m-Y_H:M:S');
   
   //Path Splitted

   new_dir = path.join('./public/splitted', formatted);
   
   //Path Splitted DB
   
   url = path.join('./splitted', formatted);
   
   //Path Encrypted
   
   encrypted_dir = path.join('./public/encrypted', formatted);
   
   //Path Encrypted DB
   
   url_encrypted = path.join('./encrypted', formatted);
   
   //Creazione Directory
   
   encrypted_dir = encrypted_dir + '/';

   fs.mkdirSync(encrypted_dir);

   new_dir = new_dir + '/';

   fs.mkdirSync(new_dir);

   console.log('new dir: ', new_dir);

   split_pdf('./uploads/userFile.pdf', new_dir, function(cf_list){


     console.log('well done Alby');

     var arr = cf_list.split(',') ;

     arr.pop();

     global.cf_list = arr;

     console.log(global.cf_list);
     
  // Inserimento dei valori nel DB e creazione Del Report      
      
    console.log('prima: ' + arr + url);

                  for(var i=0;i<arr.length;i++) {
                     
                        console.log('dopo: '+ arr[i]);
                  
                   var values = [ [ [ arr[i]],[url + arr[i] + '.pdf'] ]  ];
                   var sql = "INSERT INTO cedolini (codicefiscale,url) VALUES ?";
                    
                        console.log('Ho inserito nel DB in seguenti Valori: ' + '  ' + arr[i] + '  ' + [url + arr[i] + '.pdf']);         
            
                              db.query(sql, [values], function(err, rows, fields) {
                                
                                if (err) throw err;
                        
                              });
                    }
                    
// Criptazione del File PDF (Come Password il Codice Fiscale)                    

//        for(var i=0;i<arr.length;i++) {
     
//       sourcepath = new_dir + '/' + arr[i] + '.pdf';
              
//       pdfdestinationpath = encrypted_dir + '/'  + arr[i] + '.pdf';

       
//       var exec = require('child_process').exec,

//       command = 'qpdf --encrypt ' + arr[i] + ' ' + arr[i] + ' 40 -- '+sourcepath +' '+ pdfdestinationpath;
       

       
//        exec(command, function (err){
//       if (err){
//          console.error('Error occured: ' + err);
//       }else{
//          console.log('PDF encrypted ');
//       }
//  });
//}
 
                 
       res.end('\n Set Invio Creato  con i seguenti codici fiscali: \n' + arr );


   });
});   

module.exports = router
