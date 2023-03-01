/*
*   Note: ecmaVersion set to 3 because dojo builder will fail when using
*         features from more recent versions.
*/

module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 3
    },
    "rules": {
        "comma-dangle": ["error", "never"]
    },
    "globals": {
        "define": true,
        "require": true
    }
};