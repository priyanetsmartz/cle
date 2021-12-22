import Generator from 'react-router-sitemap-generator';
import PublicRoutes from './router.tsx';

const generator = new Generator(
  'https://localhost:3000/',
  PublicRoutes(),
  {
    lastmod: new Date().toISOString().slice(0, 10),
    changefreq: 'monthly',
    priority: 0.8,
  }
);
generator.save('public/sitemap.xml');