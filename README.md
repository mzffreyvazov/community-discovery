# Community Discovery

A platform that helps people connect with like-minded individuals through shared interests and hobbies. This app focuses on creating natural, low-pressure pathways to meaningful social connections through interest-based matching and location-aware community discovery.

## Features

- User authentication with email/password and social login options
- Interest-based community matching
- Location-aware community discovery
- Event organization and RSVP system
- Community management tools
- User profiles with interest tracking

## Tech Stack

- **Frontend:** Next.js 14, Shadcn UI
- **Authentication:** Clerk
- **Database:** Supabase
- **Icons:** Lucid Icons

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

```
COMMUNITY-DISCOVERY/
├── app/           # Next.js pages and routing
├── components/    # Reusable UI components
│   └── ui/       # Shadcn UI components
├── lib/          # Utility functions and helpers
└── public/       # Static assets
```

## Contributing

1. Clone the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
