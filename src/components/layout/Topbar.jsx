import { useTheme } from '../../context/ThemeContext';
import { IconMenu, IconSun, IconMoon } from '../common/icons';

export default function Topbar({ title, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <button
        type="button"
        className="btn btn-ghost btn-icon hamburger"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <IconMenu />
      </button>
      <div className="topbar-title">{title}</div>
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
      >
        {theme === 'light' ? <IconMoon /> : <IconSun />}
      </button>
    </header>
  );
}
