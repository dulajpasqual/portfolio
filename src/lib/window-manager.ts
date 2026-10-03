export const appIds = ['about', 'projects', 'experience', 'resume', 'contact', 'code'] as const;
export type AppId = (typeof appIds)[number];
export type DesktopWindow = {
  id: AppId;
  x: number;
  y: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};
export type WindowAction =
  | { type: 'open' | 'focus' | 'close' | 'minimize' | 'maximize'; id: AppId }
  | { type: 'move'; id: AppId; x: number; y: number; width: number; height: number; windowWidth: number }
  | { type: 'reset'; id: AppId; width: number; height: number };

export const appNames: Record<AppId, string> = {
  about: 'About me',
  projects: 'Selected work',
  experience: 'Experience',
  resume: 'Resume',
  contact: 'Contact',
  code: 'GitHub',
};

export function initialWindows(id: AppId = 'about'): DesktopWindow[] {
  return [{ id, x: 200, y: 38, z: 1, minimized: false, maximized: false }];
}

export function windowReducer(windows: DesktopWindow[], action: WindowAction): DesktopWindow[] {
  const nextZ = Math.max(0, ...windows.map(w => w.z)) + 1;
  if (action.type === 'reset') {
    return [{
      id: action.id,
      x: Math.max(112, (action.width - 850) / 2 - 30),
      y: Math.max(12, Math.min(42, (action.height - 570) / 3)),
      z: nextZ,
      minimized: false,
      maximized: false,
    }];
  }
  if (action.type === 'close') return windows.filter(w => w.id !== action.id);
  if (action.type === 'open' && !windows.some(w => w.id === action.id)) {
    return [...windows, {
      id: action.id,
      x: 170 + (windows.length % 4) * 35,
      y: 28 + (windows.length % 4) * 30,
      z: nextZ,
      minimized: false,
      maximized: false,
    }];
  }
  return windows.map(w => {
    if (w.id !== action.id) return w;
    switch (action.type) {
      case 'open':
      case 'focus':
        return { ...w, z: nextZ, minimized: false };
      case 'minimize':
        return { ...w, minimized: true };
      case 'maximize':
        return { ...w, maximized: !w.maximized, minimized: false, z: nextZ };
      case 'move':
        return {
          ...w,
          x: Math.max(0, Math.min(action.x, Math.max(0, action.width - action.windowWidth))),
          y: Math.max(0, Math.min(action.y, Math.max(0, action.height - 64))),
        };
      default:
        return w;
    }
  });
}
