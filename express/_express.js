import express from 'express';
const PORT = process.env.PORT || 3050;
export default function _express(callback) {
    const app = express();
    app.use(express.raw({ type: '*/*' }));
    app.use(express.json());
    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    callback(app);
    return [app.listen(PORT, () => { 
        console.log(`http://localhost:${PORT}`) 
    }), app];
}