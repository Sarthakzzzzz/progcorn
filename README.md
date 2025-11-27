# ProgCorn - Programming Resources Hub

**Architecture**: Next.js 14 static site with component-based architecture using React 18. The application follows a modular structure with three core components: Layout (navigation wrapper), ResourceCard (individual resource display), and Section (category grouping). Static generation is configured for optimal performance with `output: 'export'` enabling deployment to any static hosting platform.

**Tech Stack**: Tailwind CSS 3.x for responsive styling, PostCSS for CSS processing, and a centralized data structure in `/src/data/resources.js` containing categorized programming resources. The routing system uses Next.js file-based routing with four main pages: index (home), resources (learning platforms), contests (competitive programming), and tools (development utilities).

**Development**: Run `npm install && npm run dev` to start the development server on localhost:3000. The project uses ESLint-compatible code structure with modular imports, external link handling with `target="_blank"`, and mobile-first responsive grid layouts. Build with `npm run build` for production deployment.