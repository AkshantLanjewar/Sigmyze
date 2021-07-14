import express, {Request, Response, Router, Express} from 'express';

const app: Express = express();
const port: number = Number(process.env.PORT) || 8050;

app.use(express.static('dist')); 

app.get(`/**`, (req: Request, res: Response) => {
    res.sendFile('/dist/index.html')
})

app.listen(port, () => {
    console.log('app listening on port ' + port)
})