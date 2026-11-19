import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://notes.endlessus.in',
  integrations: [
    starlight({
      title: 'CALION Library',
      description: 'A polished, searchable field library for cybersecurity concepts, tools, practical workflows, and offline reference.',
      logo: {
        dark: './src/assets/calion-mark-dark.svg',
        light: './src/assets/calion-mark-light.svg',
        alt: 'CALION logo'
      },
      customCss: ['./src/styles/custom.css'],
      components: {
        Header: './src/components/LibraryHeader.astro',
        ThemeProvider: './src/components/CalionThemeProvider.astro',
        ThemeSelect: './src/components/CalionThemeSelect.astro'
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/mihrajmashoor8301-collab/calion-library'
        }
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Library Home', link: '/' },
            { label: 'Ecosystem Architecture', link: '/overview/ecosystem/' },
            { label: 'Pentest Methodology & CVSS', link: '/overview/methodology/' }
          ]
        },
        {
          label: 'Core systems',
          collapsed: true,
          items: [
            { autogenerate: { directory: 'linux' } },
            { autogenerate: { directory: 'windows' } },
            { autogenerate: { directory: 'network' } },
            { autogenerate: { directory: 'credentials' } }
          ]
        },
        {
          label: 'Discovery & assessment',
          collapsed: true,
          items: [
            { autogenerate: { directory: 'recon' } },
            { autogenerate: { directory: 'web' } },
            { autogenerate: { directory: 'exploitation' } },
            { autogenerate: { directory: 'binary' } }
          ]
        },
        {
          label: 'Automation & emerging tech',
          collapsed: true,
          items: [
            { autogenerate: { directory: 'automation' } },
            { autogenerate: { directory: 'ai-security' } }
          ]
        },
        {
          label: 'Tools & reference',
          collapsed: true,
          items: [
            { autogenerate: { directory: 'tools' } },
            { label: 'Curated PDF Handbooks', link: '/pdf-center/handbooks/' }
          ]
        }
      ]
    })
  ]
});
