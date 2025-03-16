# Database tables and their columns
The following tables are already created in supabase

1. **users**
CREATE TABLE users (
  useri_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location_latitude DECIMAL(9,6),
  location_longitude DECIMAL(9,6),
  city VARCHAR(100),
  country VARCHAR(100),
  bio TEXT,
  profile_image_url TEXT,
  last_active_at TIMESTAMP WITH TIME ZONE
);


2. **interests**
CREATE TABLE interests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  description TEXT
);

3. **user_interests** (junction table)
CREATE TABLE user_interests (
  user_id INTEGER NOT NULL,
  interest_id INTEGER NOT NULL,
  interest_level VARCHAR(50),
  PRIMARY KEY (user_id, interest_id),
  FOREIGN KEY (user_id) REFERENCES users(useri_id) ON DELETE CASCADE,
  FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);

4. **communities**
CREATE TABLE communities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id INTEGER NOT NULL,
  location_latitude DECIMAL(9,6),
  location_longitude DECIMAL(9,6),
  city VARCHAR(100),
  country VARCHAR(100),
  is_online BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 0,
  cover_image_url TEXT,
  activity_level VARCHAR(50),
  FOREIGN KEY (owner_id) REFERENCES users(useri_id) ON DELETE CASCADE
);


5. **community_interests** (junction table)
CREATE TABLE community_interests (
  community_id INTEGER NOT NULL,
  interest_id INTEGER NOT NULL,
  PRIMARY KEY (community_id, interest_id),
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
  FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);



6. **memberships** *NOT YET IMPLEMENTED*
   - user_id (FK)
   - community_id (FK)
   - joined_at
   - role (e.g., member, moderator, admin)
   - status (e.g., active, pending, banned)

7. **events**
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  community_id INTEGER NOT NULL,
  created_by INTEGER NOT NULL,
  location_latitude DECIMAL(9,6),
  location_longitude DECIMAL(9,6),
  address TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  max_attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(useri_id) ON DELETE CASCADE
);


8. **event_attendees**
CREATE TABLE event_attendees (
  event_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rsvp_status VARCHAR(50),
  rsvp_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(useri_id) ON DELETE CASCADE
);


9. **notifications** *NOT YET IMPLEMENTED*
   - id (PK)
   - user_id (FK)
   - type (e.g., community_invite, event_reminder)
   - content
   - related_id (e.g., community_id or event_id)
   - created_at
   - read_at


#  Tech stack 
- We will use Next.js, Supabase, Clerk


# Requirements

# Requirements
1. Create user to user table
    1. After a user signin via clerk, we should get the userId from clerk, and check if this userId exist in 'profiles' table, matching "useri_id"
    2. If the user doesnt exist, then create a user in 'users' table
    3. If the user exist already, then proceed, and pass on useri_id to the other functionalities

2. Discovery page workflow;

    1. After user signed uped and redirected to the discovery page, he should see the already created communities
    2. The user also can create a community.
    3. Other signed in users can see this created community on their discovery page. They can also join in