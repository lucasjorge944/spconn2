import { NavLink, Route, Routes } from 'react-router-dom';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="min-h-svh bg-background font-sans text-foreground">
      <header className="border-b border-border bg-card">
        <nav className="mx-auto flex max-w-4xl gap-6 px-4 py-3 text-sm font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/sobre"
            className={({ isActive }) =>
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }
          >
            About
          </NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
