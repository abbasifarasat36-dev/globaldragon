
export interface Theme {
    name: string;
    colors: {
        '--bg-dark': string;
        '--gradient-start': string;
        '--gradient-mid': string;
        '--gradient-accent1': string;
        '--gradient-accent2': string;
        '--primary': string;
        '--secondary': string;
        '--accent': string;
        '--success': string;
        '--glow-1': string;
        '--glow-2': string;
    }
}

export const themes: Theme[] = [
    {
        name: 'DefaultDragon',
        colors: {
            '--bg-dark': '#0D0D0D',
            '--gradient-start': '#0d0d0d',
            '--gradient-mid': '#1a1a1a',
            '--gradient-accent1': '#8A2BE2',
            '--gradient-accent2': '#1E90FF',
            '--primary': '#1E90FF',
            '--secondary': '#8A2BE2',
            '--accent': '#FFD700',
            '--success': '#28a745',
            '--glow-1': 'rgba(30, 144, 255, 0.7)',
            '--glow-2': 'rgba(138, 43, 226, 0.7)',
        }
    },
    {
        name: 'OceanicBlue',
        colors: {
            '--bg-dark': '#02101d',
            '--gradient-start': '#02101d',
            '--gradient-mid': '#041d33',
            '--gradient-accent1': '#0077b6',
            '--gradient-accent2': '#00b4d8',
            '--primary': '#00b4d8',
            '--secondary': '#0077b6',
            '--accent': '#90e0ef',
            '--success': '#48cae4',
            '--glow-1': 'rgba(0, 180, 216, 0.7)',
            '--glow-2': 'rgba(0, 119, 182, 0.7)',
        }
    },
    {
        name: 'RoyalPurple',
        colors: {
            '--bg-dark': '#191029',
            '--gradient-start': '#191029',
            '--gradient-mid': '#2d1b4d',
            '--gradient-accent1': '#7209b7',
            '--gradient-accent2': '#560bad',
            '--primary': '#7209b7',
            '--secondary': '#f72585',
            '--accent': '#b5179e',
            '--success': '#4cc9f0',
            '--glow-1': 'rgba(114, 9, 183, 0.7)',
            '--glow-2': 'rgba(247, 37, 133, 0.7)',
        }
    },
    {
        name: 'CyberPunk',
        colors: {
            '--bg-dark': '#0c0c0c',
            '--gradient-start': '#0c0c0c',
            '--gradient-mid': '#1a001a',
            '--gradient-accent1': '#ff00ff',
            '--gradient-accent2': '#00ffff',
            '--primary': '#ff00ff',
            '--secondary': '#00ffff',
            '--accent': '#ffff00',
            '--success': '#00ff00',
            '--glow-1': 'rgba(0, 255, 255, 0.7)',
            '--glow-2': 'rgba(255, 0, 255, 0.7)',
        }
    },
    {
        name: 'CosmicVoid',
        colors: {
            '--bg-dark': '#0b0014',
            '--gradient-start': '#0b0014',
            '--gradient-mid': '#190028',
            '--gradient-accent1': '#43006a',
            '--gradient-accent2': '#6f00b1',
            '--primary': '#6f00b1',
            '--secondary': '#9d4edd',
            '--accent': '#c77dff',
            '--success': '#e0aaff',
            '--glow-1': 'rgba(111, 0, 177, 0.7)',
            '--glow-2': 'rgba(157, 78, 221, 0.7)',
        }
    },
    {
        name: 'ArcticAurora',
        colors: {
            '--bg-dark': '#0a1014',
            '--gradient-start': '#0a1014',
            '--gradient-mid': '#101a23',
            '--gradient-accent1': '#4dffaf',
            '--gradient-accent2': '#42a5f5',
            '--primary': '#4dffaf',
            '--secondary': '#42a5f5',
            '--accent': '#f0f4c3',
            '--success': '#69f0ae',
            '--glow-1': 'rgba(77, 255, 175, 0.7)',
            '--glow-2': 'rgba(66, 165, 245, 0.6)',
        }
    },
    {
        name: 'SynthwaveSunset',
        colors: {
            '--bg-dark': '#200a3e',
            '--gradient-start': '#200a3e',
            '--gradient-mid': '#3b125f',
            '--gradient-accent1': '#f92a82',
            '--gradient-accent2': '#ffae42',
            '--primary': '#f92a82',
            '--secondary': '#00d2ff',
            '--accent': '#ffae42',
            '--success': '#7df9ff',
            '--glow-1': 'rgba(249, 42, 130, 0.7)',
            '--glow-2': 'rgba(0, 210, 255, 0.7)',
        }
    },
    {
        name: 'TropicalVibes',
        colors: {
            '--bg-dark': '#00122d',
            '--gradient-start': '#00122d',
            '--gradient-mid': '#00255a',
            '--gradient-accent1': '#ff6b6b',
            '--gradient-accent2': '#fca311',
            '--primary': '#4ecdc4',
            '--secondary': '#ff6b6b',
            '--accent': '#fca311',
            '--success': '#a2d2ff',
            '--glow-1': 'rgba(78, 205, 196, 0.7)',
            '--glow-2': 'rgba(255, 107, 107, 0.7)',
        }
    },
    {
        name: 'MidnightMetal',
        colors: {
            '--bg-dark': '#0e101c',
            '--gradient-start': '#0e101c',
            '--gradient-mid': '#1c1e2d',
            '--gradient-accent1': '#cccccc',
            '--gradient-accent2': '#00aaff',
            '--primary': '#00aaff',
            '--secondary': '#cccccc',
            '--accent': '#42a5f5',
            '--success': '#00ff88',
            '--glow-1': 'rgba(0, 170, 255, 0.7)',
            '--glow-2': 'rgba(204, 204, 204, 0.5)',
        }
    },
    {
        name: 'CandyPop',
        colors: {
            '--bg-dark': '#211522',
            '--gradient-start': '#211522',
            '--gradient-mid': '#3b2a3f',
            '--gradient-accent1': '#ff75a6',
            '--gradient-accent2': '#84d2f6',
            '--primary': '#ff75a6',
            '--secondary': '#84d2f6',
            '--accent': '#f2e86d',
            '--success': '#77dd77',
            '--glow-1': 'rgba(255, 117, 166, 0.7)',
            '--glow-2': 'rgba(132, 210, 246, 0.7)',
        }
    },
    {
        name: 'Nebula',
        colors: {
            '--bg-dark': '#0b021d',
            '--gradient-start': '#0b021d',
            '--gradient-mid': '#1f0a4d',
            '--gradient-accent1': '#b300ff',
            '--gradient-accent2': '#ff00a6',
            '--primary': '#b300ff',
            '--secondary': '#ff00a6',
            '--accent': '#00e5ff',
            '--success': '#00ffc3',
            '--glow-1': 'rgba(179, 0, 255, 0.7)',
            '--glow-2': 'rgba(255, 0, 166, 0.7)',
        }
    },
    {
        name: 'PhoenixFire',
        colors: {
            '--bg-dark': '#2a0000',
            '--gradient-start': '#2a0000',
            '--gradient-mid': '#6b0000',
            '--gradient-accent1': '#ff4d00',
            '--gradient-accent2': '#ffc700',
            '--primary': '#ff4d00',
            '--secondary': '#ffc700',
            '--accent': '#ff8000',
            '--success': '#ff6a00',
            '--glow-1': 'rgba(255, 77, 0, 0.7)',
            '--glow-2': 'rgba(255, 199, 0, 0.7)',
        }
    },
    {
        name: 'CrystalCavern',
        colors: {
            '--bg-dark': '#030f24',
            '--gradient-start': '#030f24',
            '--gradient-mid': '#081f4d',
            '--gradient-accent1': '#00d9ff',
            '--gradient-accent2': '#e600ff',
            '--primary': '#00d9ff',
            '--secondary': '#e600ff',
            '--accent': '#ffffff',
            '--success': '#00ffb3',
            '--glow-1': 'rgba(0, 217, 255, 0.7)',
            '--glow-2': 'rgba(230, 0, 255, 0.7)',
        }
    },
    {
        name: 'JadeEmpire',
        colors: {
            '--bg-dark': '#082116',
            '--gradient-start': '#082116',
            '--gradient-mid': '#114227',
            '--gradient-accent1': '#38b000',
            '--gradient-accent2': '#ffd60a',
            '--primary': '#38b000',
            '--secondary': '#ffd60a',
            '--accent': '#f0ead2',
            '--success': '#70e000',
            '--glow-1': 'rgba(56, 176, 0, 0.7)',
            '--glow-2': 'rgba(255, 214, 10, 0.7)',
        }
    },
    {
        name: 'DesertOasis',
        colors: {
            '--bg-dark': '#2a1a00',
            '--gradient-start': '#2a1a00',
            '--gradient-mid': '#5a3d00',
            '--gradient-accent1': '#ffb703',
            '--gradient-accent2': '#00a6fb',
            '--primary': '#ffb703',
            '--secondary': '#00a6fb',
            '--accent': '#fb8500',
            '--success': '#8ecae6',
            '--glow-1': 'rgba(255, 183, 3, 0.7)',
            '--glow-2': 'rgba(0, 166, 251, 0.7)',
        }
    },
    {
        name: 'Arcane',
        colors: {
            '--bg-dark': '#130024',
            '--gradient-start': '#130024',
            '--gradient-mid': '#2a004d',
            '--gradient-accent1': '#9d4edd',
            '--gradient-accent2': '#ffc300',
            '--primary': '#9d4edd',
            '--secondary': '#ffc300',
            '--accent': '#e0aaff',
            '--success': '#c77dff',
            '--glow-1': 'rgba(157, 78, 221, 0.7)',
            '--glow-2': 'rgba(255, 195, 0, 0.7)',
        }
    },
    {
        name: 'CoralReef',
        colors: {
            '--bg-dark': '#00293d',
            '--gradient-start': '#00293d',
            '--gradient-mid': '#00507a',
            '--gradient-accent1': '#ff595e',
            '--gradient-accent2': '#52b788',
            '--primary': '#ff595e',
            '--secondary': '#52b788',
            '--accent': '#ffca3a',
            '--success': '#8ac926',
            '--glow-1': 'rgba(255, 89, 94, 0.7)',
            '--glow-2': 'rgba(82, 183, 136, 0.7)',
        }
    },
    {
        name: 'GildedNight',
        colors: {
            '--bg-dark': '#0c0c0c',
            '--gradient-start': '#0c0c0c',
            '--gradient-mid': '#1a1a1a',
            '--gradient-accent1': '#d4af37',
            '--gradient-accent2': '#4a4a4a',
            '--primary': '#d4af37',
            '--secondary': '#a8a8a8',
            '--accent': '#f0e68c',
            '--success': '#7cfc00',
            '--glow-1': 'rgba(212, 175, 55, 0.7)',
            '--glow-2': 'rgba(255, 255, 255, 0.3)',
        }
    },
    {
        name: 'PoisonDart',
        colors: {
            '--bg-dark': '#0a0a0a',
            '--gradient-start': '#0a0a0a',
            '--gradient-mid': '#1c1c1c',
            '--gradient-accent1': '#ffdd00',
            '--gradient-accent2': '#0055ff',
            '--primary': '#ffdd00',
            '--secondary': '#0055ff',
            '--accent': '#ffffff',
            '--success': '#00eaff',
            '--glow-1': 'rgba(255, 221, 0, 0.7)',
            '--glow-2': 'rgba(0, 85, 255, 0.7)',
        }
    },
    {
        name: 'DragonScale',
        colors: {
            '--bg-dark': '#021614',
            '--gradient-start': '#021614',
            '--gradient-mid': '#063833',
            '--gradient-accent1': '#00a99d',
            '--gradient-accent2': '#6a00f4',
            '--primary': '#00a99d',
            '--secondary': '#6a00f4',
            '--accent': '#a5dff9',
            '--success': '#00f5d4',
            '--glow-1': 'rgba(0, 169, 157, 0.7)',
            '--glow-2': 'rgba(106, 0, 244, 0.7)',
        }
    },
    {
        name: 'SunsetGlow',
        colors: {
            '--bg-dark': '#2c0e3a',
            '--gradient-start': '#2c0e3a',
            '--gradient-mid': '#5a1a63',
            '--gradient-accent1': '#ff70a6',
            '--gradient-accent2': '#ff9770',
            '--primary': '#ff70a6',
            '--secondary': '#ff9770',
            '--accent': '#ffd670',
            '--success': '#70d6ff',
            '--glow-1': 'rgba(255, 112, 166, 0.7)',
            '--glow-2': 'rgba(255, 151, 112, 0.7)',
        }
    }
];