import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://notes.endlessus.in',
  integrations: [
    starlight({
      title: 'CALION Library',
      description: 'Searchable cybersecurity notes, command cheat sheets, and technical reference manuals.',
      customCss: ['./src/styles/custom.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/mihrajmashoor8301-collab/calion-library'
        }
      ],
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'Library Introduction', link: '/' },
            { label: 'Ecosystem Architecture', link: '/overview/ecosystem/' },
            { label: 'Pentest Methodology & CVSS', link: '/overview/methodology/' }
          ]
        },
        {
          label: 'Reconnaissance & OSINT',
          items: [{ autogenerate: { directory: 'recon' } }]
        },
        {
          label: 'Linux Security & PrivEsc',
          items: [{ autogenerate: { directory: 'linux' } }]
        },
        {
          label: 'Windows & Active Directory',
          items: [{ autogenerate: { directory: 'windows' } }]
        },
        {
          label: 'Network Security & Traffic',
          items: [{ autogenerate: { directory: 'network' } }]
        },
        {
          label: 'Web Application Security',
          items: [{ autogenerate: { directory: 'web' } }]
        },
        {
          label: 'Credential Security',
          items: [{ autogenerate: { directory: 'credentials' } }]
        },
        {
          label: 'Exploitation & Post-Exploitation',
          items: [{ autogenerate: { directory: 'exploitation' } }]
        },
        {
          label: 'Binary Exploitation & Memory Safety',
          items: [{ autogenerate: { directory: 'binary' } }]
        },
        {
          label: 'Security Automation',
          items: [{ autogenerate: { directory: 'automation' } }]
        },
        {
          label: 'AI & LLM Security',
          items: [{ autogenerate: { directory: 'ai-security' } }]
        },
        {
          label: 'Tools & Command Cheatsheets',
          items: [{ autogenerate: { directory: 'tools' } }]
        },
        {
          label: 'PDF Reference Center',
          items: [
            { label: 'Curated PDF Handbooks', link: '/pdf-center/handbooks/' }
          ]
        }
      ]
    })
  ]
});
