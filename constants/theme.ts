export const Colors = {
  bg: '#0A0A0F',
  surface: '#14141C',
  card: '#1C1C28',
  border: '#2C2C3E',
  primary: '#FF3B30',
  primaryDim: '#7A1A14',
  warning: '#FF9F0A',
  success: '#30D158',
  text: '#FFFFFF',
  textSub: '#8E8E9E',
  textMuted: '#babaca',
};

export const S = {
  h1: { fontSize: 32, fontWeight: '800' as const, color: Colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, color: Colors.text },
  h3: { fontSize: 17, fontWeight: '600' as const, color: Colors.text },
  body: { fontSize: 16, fontWeight: '400' as const, color: Colors.text, lineHeight: 24 },
  small: { fontSize: 13, fontWeight: '500' as const, color: Colors.textSub },
  mono: { fontSize: 28, fontWeight: '800' as const, color: Colors.text, fontVariant: ['tabular-nums'] as any },
};
