import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      gridTemplateColumns: '220px 1fr',
      minHeight: '100vh',
      gap: 0,
    }}>
      <header style={{ gridColumn: '1 / -1' }}>
        <Navbar />
      </header>
      <aside style={{
        borderRight: '2px solid var(--color-border)',
        padding: '16px',
        background: 'var(--color-surface)',
      }}>
        <Sidebar />
      </aside>
      <main style={{ padding: '24px', maxWidth: '900px' }}>
        <Outlet />
      </main>
    </div>
  );
}
