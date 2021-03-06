module.exports = {
    //publicPath: "/MedVoc/",
    outputDir: "./docs",
    pwa: {
        workboxOptions: {
            clientsClaim: true,
            skipWaiting: true,
            navigateFallback: "index.html",
            runtimeCaching: [
                {
                    urlPattern: /\.*/,
                    handler: "networkFirst"
                    /*options: {
                        // Use a custom cache name for this route.
                        cacheName: "fonts",
                        // Configure custom cache expiration.
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                            // Automatically cleanup if quota is exceeded.
                            purgeOnQuotaError: true
                        }
                    }*/
                }
            ]
        }
    }
};
