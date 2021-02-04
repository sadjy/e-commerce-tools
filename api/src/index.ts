import express from 'express';
import { loggerMiddleware } from './middlewares/logger';
import userContextRouter from './routes/user-context-routes';
import identityContextrouter from './routes/identity-routes';
require('dotenv').config();

const app = express();
const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;

function userRouter(app: express.Express, path: string, router: express.Router) {
  console.log(router.stack.map((r) => ({ basePath: path, path: r.route.path, methods: r.route.methods })));
  app.use(path, router);
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(loggerMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome!');
});

userRouter(app, '/user-service', userContextRouter);
userRouter(app, '/identity-service', identityContextrouter);
app.use('test', userContextRouter);

app.listen(port, () => {
  console.log(`Started API Server on port ${port}`);
});
