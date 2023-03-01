const fs = require("fs-extra");
let pjson = require('../package.json');

fs.copy("./src/hitideConfig.js", "./dist/hitideConfig.js", function(err){
    if(err){
        console.log("\n\n\nError copying files:  ", err);
    }
    else{
        console.log("\n\n\nSuccessfully copied files");
    }
});

fs.writeJson('./dist/version.json', {version: pjson.version}, err => {
  if(err) return console.error("\n\n\nError creating version.json: ", err);
  console.log("\n\n\nSuccessfully create version.json");
})
