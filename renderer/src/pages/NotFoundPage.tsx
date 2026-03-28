import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">404</h1>
      <p className="mt-2 text-muted-foreground">Page not found.</p>
      <Button className="mt-6" asChild variant="secondary">
        <Link to="/">Back home</Link>
      </Button>
    </div>
  );
}
