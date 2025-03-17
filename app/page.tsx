// Remove the Image import if not using it
// import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link"; // Add Link import

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 px-8 sm:px-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Find Your Community, <br />
            Build Real Connections
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with like-minded individuals through shared interests and hobbies. 
            Discover local communities and events that match your passions.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            {/* Use Link instead of a, but keep the styling */}
            <Link
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 py-3 font-medium"
              href={userId ? "/discover" : "/sign-up"}
            >
              Get Started
            </Link>
            <Link
              className="rounded-full border border-foreground/10 hover:bg-secondary px-8 py-3 font-medium"
              href="/discover"
            >
              Explore Communities
            </Link>
          </div>
        </div>
      </section>

      {/* Fix the unescaped quotes in this section */}
      <section className="w-full py-20 px-8 sm:px-20 bg-secondary/20">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Members Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-lg bg-background p-6">
              <p className="mb-4 italic">&ldquo;Community Finder helped me connect with amazing people who share my interests. I&apos;ve made real friendships that go beyond the screen.&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary" />
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Music Community Member</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-background p-6">
              <p className="mb-4 italic">&ldquo;I found a local photography group that meets weekly. It&apos;s incredible how much I&apos;ve learned and grown as a photographer through this community.&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary" />
                <div>
                  <p className="font-semibold">David Chen</p>
                  <p className="text-sm text-muted-foreground">Photography Enthusiast</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-background p-6">
              <p className="mb-4 italic">&ldquo;As a book lover, finding others who enjoy discussing literature has been fantastic. Our monthly book club meetups are the highlight of my month.&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary" />
                <div>
                  <p className="font-semibold">Emily Martinez</p>
                  <p className="text-sm text-muted-foreground">Book Club Organizer</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-background p-6">
              <p className="mb-4 italic">&ldquo;The hiking community here is amazing! I&apos;ve discovered so many beautiful trails and made great friends who share my love for outdoor adventures.&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary" />
                <div>
                  <p className="font-semibold">Michael Thompson</p>
                  <p className="text-sm text-muted-foreground">Hiking Enthusiast</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-background p-6">
              <p className="mb-4 italic">&ldquo;This platform connected me with fellow tech enthusiasts. We now co-work regularly and collaborate on exciting projects together.&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary" />
                <div>
                  <p className="font-semibold">Lisa Wong</p>
                  <p className="text-sm text-muted-foreground">Tech Community Lead</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-background p-6">
              <p className="mb-4 italic">&ldquo;Finding a local cooking club changed my life! We share recipes, cook together, and have amazing potluck gatherings every month.&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary" />
                <div>
                  <p className="font-semibold">James Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Culinary Community Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-8 sm:px-20">
        <div className="container max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Community?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of others who have found their place in our growing network of communities.
          </p>
          {/* Use Link instead of a */}
          <Link
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 py-3 font-medium inline-block"
            href="/sign-up"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}