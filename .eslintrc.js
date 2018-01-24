module.exports = {
    "extends": "airbnb-base",
    "env": { "mocha": true },
    "rules":{
        "linebreak-style": 0,
        "no-param-reassign": ["error", { "props": false }],
        "no-console": 0,
        "prefer-destructuring": ["error", {"object": true, "array": false}],
        semi: ["error", "never"],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
    }
        
};
