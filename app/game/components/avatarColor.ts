export const AVATAR_COLORS = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22'];

export function avatarColor(id: string): string {
  let h = 0;
  for (const c of id) h = (h << 5) - h + c.charCodeAt(0);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
