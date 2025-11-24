import { createApp } from './app';

const app = createApp();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`Server ready on port ${port}`);
});
