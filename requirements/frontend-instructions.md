# Project overview
The Community Finder app aims to help people who feel socially isolated or "stuck" easily connect with like-minded individuals through shared interests and hobbies. It addresses the unique challenges faced by people in smaller cities or regions with limited social opportunities by providing both online and offline community options, graduated engagement features to reduce social anxiety, and specialized tools for interest groups like music enthusiasts or tech students. The app differentiates itself from existing platforms by focusing specifically on creating natural, low-pressure pathways to meaningful social connections, with features like interest-based matching, location-aware community discovery, and tools that help users transition comfortably from online interactions to in-person meetups. For users struggling with financial limitations or geographical constraints, it offers ways to find accessible local events and connect with others in similar situations, ultimately helping them add more joy and social connection to their daily lives.

# Feature requirements
For a minimal working version (MVP) of the Community Finder app, here are the essential features and pages you'll need:

### Essential Pages:

1. **Landing Page**
   - Value proposition and app description
   - Featured communities
   - User testimonials (can be placeholders initially)
   - Sign up/login buttons

2. **Sign Up & Login Pages**
   - Email/password registration
   - Social login options (Google, Facebook)

3. **Discovery Page**
   - Search bar for finding communities
   - Filters for interests, location range, and activity level
   - Browse by categories (Music, Tech, Sports, etc.)
   - Community cards with basic info and join button

4. **Community Details Page**
   - Community description and rules
   - Member count and activity level
   - Upcoming events
   - Join/leave button
   - Discussion board preview

5. **User Profile Page**
   - Basic info and bio
   - Interests list
   - Communities joined
   - Activity history
   - Settings/preferences

6. **Event Page**
   - Basic event details
   - Attendee list
   - RSVP functionality
   - Location information

### Core Features for MVP:

1. **User Authentication**
   - Sign up/login
   - Password reset
   - Basic profile management

2. **Community Management**
   - Create/join communities
   - Leave communities
   - Basic community settings

3. **Interest-Based Matching**
   - Match users to communities based on interests
   - Suggest relevant communities

4. **Location Services**
   - Find nearby communities
   - Show community locations on map

5. **Simple Search & Discovery**
   - Search by keywords
   - Filter by location and interests
   - Browse by categories

# Tech stack & dev process
- We will use Next.js, Shadcn, Lucid, Supabease, Clerk
Essential Pages:

Landing Page

Value proposition and app description
Featured communities
User testimonials (can be placeholders initially)
Sign up/login buttons


Sign Up & Login Pages

Email/password registration
Social login options (Google, Facebook)
Basic onboarding to collect interests and location


Discovery Page

Search bar for finding communities
Filters for interests, location range, and activity level
Browse by categories (Music, Tech, Sports, etc.)
Community cards with basic info and join button


Community Details Page

Community description and rules
Member count and activity level
Upcoming events
Join/leave button
Discussion board preview


User Profile Page

Basic info and bio
Interests list
Communities joined
Activity history
Settings/preferences


Event Page

Basic event details
Attendee list
RSVP functionality
Location information


# Relevant docs

# Current file structure
COMMUNITY-DISCOVERY/
├── .next/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── form.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/
├── node_modules/
├── public/
├── requirements/
│   └── frontend-instructions.md
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json

# Rules
- All new components should go in /components and be named like example-component.tsx unless otherwise specified
- All new pages go in /app