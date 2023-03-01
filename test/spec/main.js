var allTestFiles = [];
var TEST_REGEXP = /.*Spec\.js$/;

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file);
    }
});

var dojoConfig = {
    packages: [
        {name: "src", location: "/base/src"},
        {name: "dojo", location: "/base/src/dojo"},
        {name: "jpl", location: "/base/src/jpl"}
    ],
    async: true
};

/**
 * This function must be defined and is called back by the dojo adapter
 * @returns {string} a list of dojo spec/test modules to register with your testing framework
 */
window.__karma__.dojoStart = function(){
    return allTestFiles;
}


