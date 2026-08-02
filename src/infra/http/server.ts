import { createApp } from "./app";

const PORT= process.env.PORT;

export function startServer(): void {
  const app = createApp();

  app.listen(PORT, ()=> {
    console.log(`Servidor correndo na porta ${PORT}`);
  });
}