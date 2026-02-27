import { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, GraduationCap, BriefcaseBusiness, LayoutDashboard, Map, LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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

const navItems = [
  { to: '/', label: 'Home', icon: BookOpen },
  { to: '/trilha', label: 'Trilha', icon: Map },
  { to: '/entrevistas', label: 'Entrevistas', icon: BriefcaseBusiness },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const LOGOUT_DELAY_MS = 2000;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [logoutExiting, setLogoutExiting] = useState(false);
  const location = useLocation();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

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
          </nav>

          <div className="hidden md:flex items-center gap-2">
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
