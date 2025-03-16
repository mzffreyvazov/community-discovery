import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

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
            <a
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 py-3 font-medium"
              href={userId ? "/discover" : "/sign-up"}
            >
              Get Started
            </a>
            <a
              className="rounded-full border border-foreground/10 hover:bg-secondary px-8 py-3 font-medium"
              href="/discover"
            >
              Explore Communities
            </a>
          </div>
        </div>
      </section>

      {/* Featured Communities Section */}
      <section className="w-full py-20 px-8 sm:px-20">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Communities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Community Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-xl mb-2">Tech Enthusiasts</h3>
                <p className="text-muted-foreground mb-4">Connect with fellow tech lovers, share knowledge, and collaborate on projects.</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>1.2k members</span>
                  <span>•</span>
                  <span>Very Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 px-8 sm:px-20 bg-secondary/20">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Members Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Testimonials */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg bg-background p-6">
                <p className="mb-4 italic">"Community Finder helped me connect with amazing people who share my interests. I've made real friendships that go beyond the screen."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary" />
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Music Community Member</p>
                  </div>
                </div>
              </div>
            ))}
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
          <a
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 py-3 font-medium inline-block"
            href="/sign-up"
          >
            Sign Up Now
          </a>
        </div>
      </section>
    </div>
  );
}
