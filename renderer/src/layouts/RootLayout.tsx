import { NavLink, Outlet } from 'react-router-dom';
import { mainNavItems } from '@/routes/nav';

export function RootLayout() {
    return (
        <div className="min-h-svh bg-background font-sans text-foreground">
            <header className="border-b border-border bg-card">
                <nav className="mx-auto flex max-w-4xl gap-6 px-4 py-3 text-sm font-medium">
                    {mainNavItems.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
