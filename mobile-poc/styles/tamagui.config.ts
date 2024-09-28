import { createTamagui } from 'tamagui';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';

const config = createTamagui({
  shorthands,
  themes,
  tokens,
  // Add more configuration as needed
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;