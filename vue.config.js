module.exports = {
    publicPath: "/MedVoc/",
    outputDir: "./docs",
    pwa: {
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "src/service-worker.js"
        }
    }
};
