/** Links do header; alinhar paths com `routes/index.tsx`. */
export type MainNavItem = { to: string; label: string; end?: boolean };

export const mainNavItems: MainNavItem[] = [
    { to: '/', label: 'Home', end: true },
    { to: '/candidatos', label: 'Candidatos' },
    { to: '/sobre', label: 'Sobre' }
];
