import { createTamagui, createTokens } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'

const darkTheme = {
  background: '#121212',
  backgroundHover: '#1E1E1E',
  backgroundPress: '#252525',
  backgroundFocus: '#1E1E1E',
  color: '#FFFFFF',
  colorHover: '#F0F0F0',
  colorPress: '#E0E0E0',
  colorFocus: '#F0F0F0',
  borderColor: '#333333',
  borderColorHover: '#444444',
  borderColorFocus: '#555555',
  borderColorPress: '#666666',
}

const config = createTamagui({
  fonts: {
    body: createInterFont(),
    heading: createInterFont({
      face: 'Inter-Bold',
    }),
  },
  tokens,
  themes: {
    ...themes,
    dark: darkTheme,
  },
  shorthands,
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config