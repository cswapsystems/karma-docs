// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BTC Karma Docs',
  tagline: 'Stake Bitcoin. Earn KARMA. Level Up.',
  favicon: 'img/karma-logo.svg',

  future: {
    v4: true,
  },

  url: 'https://docs.btckarma.io',
  baseUrl: '/',

  organizationName: 'cswapsystems',
  projectName: 'karma-docs',

  onBrokenLinks: 'warn',

  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../btc-karma-gitbook',
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          exclude: ['summary.md', 'readme.md', 'SUMMARY.md'],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'BTC Karma',
          src: 'img/btc-karma-wordmark.svg',
          href: '/',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://btckarma.io',
            label: 'Website',
            position: 'right',
          },
          {
            href: 'https://staking.btckarma.io',
            label: 'Bitcoin Staking',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {label: 'Start Here', to: '/start-here/what-is-btc-karma'},
              {label: 'Rewards', to: '/rewards/what-is-usdkarma'},
              {label: 'Security', to: '/security/security-overview'},
            ],
          },
          {
            title: 'BTC Karma',
            items: [
              {label: 'Website', href: 'https://btckarma.io'},
              {label: 'Bitcoin Staking', href: 'https://staking.btckarma.io'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} BTC Karma.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
