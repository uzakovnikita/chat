const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache')

const securityHeaders = [
    {
        key: 'Content-Security-Policy',
        value:
            "default-src 'self'; child-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com http://localhost:3000; font-src https://fonts.gstatic.com; connect-src ws://localhost:1000/ http://localhost:1000/ http://localhost:3000/",
    },
];
module.exports = {
    async headers() {
        return [
            {
                // Apply these headers to all routes in your application.
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
};
module.exports = withPWA({
    pwa: {
        dest: 'public',
        runtimeCaching,
        dynamicStartUrlRedirect : '/auth'
    },
});
