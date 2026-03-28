import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section>
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar ao início</Link>
    </section>
  );
}
