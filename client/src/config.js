const ep = 'api.low-cal-calzone.zone/';    // The endpoint

const config = {
    websocket: {
        server: `http://${ep}`,
        path: '/websocket/socket.io'
    },
    calzones: `http://${ep}/calzones`,
    beverages: `http://${ep}/beverages`,
    checkout: `http://${ep}/checkout/checkout`
};

export default config;