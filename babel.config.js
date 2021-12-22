module.exports = {
    presets: [
        "@babel/preset-react",
        "@babel/preset-env",
        [
            "@babel/preset-typescript",
            {
                "allExtensions": true,
                "allowNamespaces": true,
                "allowDeclareFields": true
            }
        ]
    ]
}