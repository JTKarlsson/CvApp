import express, {Response, Request} from 'express';
import fetch from 'node-fetch';
import path from 'path';
import serverConf from './config.js';

const app = express();
const port = '5173';

app.set('trust proxy', true);

const proxy = async (req: Request, res: Response) => {
if(req.get("Content-Type") !== "applicaton/json"){
    res.status(415).send("Invalid content type: expected application/json")
    return;
}

    try {
        const path = req.path.replace(/^(\/api)/, '');

        const queryIndex = req.originalUrl.indexOf('?');
        const queryString = queryIndex >= 0 ? req.originalUrl.slice(queryIndex) : '';

        const fetchUrl = `${serverConf.API_URL}${path}${queryString}`;

        const response = await fetch(fetchUrl,{
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'X-correlation-ID': req.get('X-correlation-ID'),
            },
            body: req.body !== undefined && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : undefined,
        });

        if(!response.ok){
            res.send("Response is not ok..");
        }
        else{
            for(let pair of response.headers.entries()){
                res.setHeader(pair[0], pair[1]);
            }
        }
        res.setHeader('Content-Type', 'application/json');
        
        response.body?.pipe(res);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

app.get('/api/', [], proxy);
app.post('/api/', [], proxy);
app.put('/api/', [], proxy);
app.delete('/api/', [], proxy);

app.get('/', (req, res) => {
    res.sendFile(path.resolve('build', 'index.html'),{
        setHeaders: (res, path) => {
            if(!path.endsWith('.html')) {
                res.setHeader('Cache-control', 'public, max-age=60400, immutable')
            }
        }
    })
});
app.use(express.static('build'));

app.listen(port, ()=> {
console.log(`Listening port: ${port}`, {
    details: {
        serverConf: serverConf,
    },
})

});