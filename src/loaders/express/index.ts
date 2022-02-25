import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
const App = () => {
  const app: Application = express();
  // set log request
  app.use(morgan('tiny'));
  // parse json request body
  app.use(cookieParser());
  app.use(express.json());
  // parse urlencoded request body
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(cors({
    credentials: true,
    origin: true,
  }));
  app.use(
    '/public/images/',
    express.static(path.join(__dirname, '../../public/images'))
  );
  return app;
};
export default App;
