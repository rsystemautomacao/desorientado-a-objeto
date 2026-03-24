import { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, GraduationCap, BriefcaseBusiness, LayoutDashboard, Map, LogIn, LogOut, User, Loader2, Sun, Moon, Code2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import GlobalSearch from '@/components/GlobalSearch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const HOME_NAV: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [];

const JAVA_NAV = [
  { to: '/trilha', label: 'Trilha', icon: Map },
  { to: '/exercicios', label: 'Exercícios', icon: Code2 },
];

const PYTHON_NAV = [
  { to: '/python/trilha', label: 'Trilha', icon: Map },
  { to: '/python/exercicios', label: 'Exercícios', icon: Code2 },
];

const C_NAV = [
  { to: '/c/trilha', label: 'Trilha', icon: Map },
  { to: '/c/exercicios', label: 'Exercícios', icon: Code2 },
];

const ALL_LANG_ITEMS = [
  { to: '/java',   label: 'Java',   color: 'text-orange-400', activeBg: 'bg-orange-400/10', hoverBg: 'hover:bg-orange-400/10 hover:text-orange-400' },
  { to: '/python', label: 'Python', color: 'text-blue-400',   activeBg: 'bg-blue-400/10',   hoverBg: 'hover:bg-blue-400/10 hover:text-blue-400' },
  { to: '/c',      label: 'Lang C', color: 'text-cyan-400',   activeBg: 'bg-cyan-400/10',   hoverBg: 'hover:bg-cyan-400/10 hover:text-cyan-400' },
];

const LOGOUT_DELAY_MS = 2000;

// Since current language is filtered out of langItems, this only runs for OTHER languages
function isLangActive(to: string, pathname: string): boolean {
  if (to === '/java') return !pathname.startsWith('/python') && !pathname.startsWith('/c') && pathname !== '/';
  return pathname.startsWith(to);
}

function useThemeToggle() {
  const [isLight, setIsLight] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isLight) {
      root.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  const toggle = useCallback(() => setIsLight((v) => !v), []);
  return { isLight, toggle };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [logoutExiting, setLogoutExiting] = useState(false);
  const location = useLocation();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { isLight, toggle: toggleTheme } = useThemeToggle();

  const isOnPython = location.pathname.startsWith('/python');
  const isOnC      = location.pathname.startsWith('/c/') || location.pathname === '/c';
  const isOnHome   = location.pathname === '/';
  const isOnJava   = !isOnPython && !isOnC && !isOnHome;

  const navItems = isOnPython ? PYTHON_NAV
    : isOnC    ? C_NAV
    : isOnHome ? HOME_NAV
    : JAVA_NAV;

  // Hide the current language from the switcher so it doesn't show a link to where you already are
  const langItems = ALL_LANG_ITEMS.filter((item) => {
    if (isOnJava   && item.to === '/java')   return false;
    if (isOnPython && item.to === '/python') return false;
    if (isOnC      && item.to === '/c')      return false;
    return true;
  });

  const handleConfirmLogout = useCallback(() => {
    setLogoutConfirmOpen(false);
    setMenuOpen(false);
    setLogoutExiting(true);
    setTimeout(() => {
      signOut();
      setLogoutExiting(false);
    }, LOGOUT_DELAY_MS);
  }, [signOut]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-gradient-primary">DESorientado a Objetos</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-border mx-1" />
            {langItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isLangActive(item.to, location.pathname)
                    ? `${item.activeBg} ${item.color}`
                    : `text-muted-foreground ${item.hoverBg}`
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user && (
              <Link
                to="/dashboard"
                title="Dashboard"
                className={`p-2 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            )}
            <GlobalSearch />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title={isLight ? 'Modo escuro' : 'Modo claro'}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {user.displayName?.slice(0, 2).toUpperCase() ?? user.email?.slice(0, 2).toUpperCase() ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium truncate">
                      {user.displayName || user.email}
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLogoutConfirmOpen(true)} className="text-muted-foreground cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" onClick={() => signInWithGoogle()} className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar com Google
                </Button>
              )
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className="pt-1 pb-1"><div className="border-t border-border" /></div>
            {langItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  isLangActive(item.to, location.pathname)
                    ? `${item.activeBg} ${item.color}`
                    : `text-muted-foreground ${item.hoverBg}`
                }`}
              >
                <Code2 className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              {isLight ? 'Modo Escuro' : 'Modo Claro'}
            </button>
            {!loading && (
              <div className="pt-2 border-t border-border mt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {user.displayName?.slice(0, 2).toUpperCase() ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                    <span className="text-sm truncate">{user.displayName || user.email}</span>
                  </div>
                  <Link
                    to="/perfil"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                  >
                    <User className="h-5 w-5" />
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setLogoutConfirmOpen(true);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                  >
                    <LogOut className="h-5 w-5" />
                    Sair
                  </button>
                </>
                ) : (
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                  >
                    <LogIn className="h-5 w-5" />
                    Entrar com Google
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Confirmação de logout */}
      <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Você precisará entrar novamente com Google para acessar a trilha e seu progresso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Overlay "Saindo..." por 2 segundos */}
      {logoutExiting && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Saindo...</p>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="container">DESorientado a Objetos © 2025–2026 — Aprenda Java do zero ao avançado</div>
      </footer>
    </div>
  );
}
