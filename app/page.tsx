import { auth } from "@clerk/nextjs/server";
import Link from "next/link"; // Add Link import
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 sm:px-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Mustafa Sen Petuxsan<br />
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join vibrant communities and meet people who share your interests.
            Explore local groups and events tailored to your unique passions.
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

      {/* Testimonials section */}
      <section className="w-full py-20 px-4 sm:px-20 bg-secondary/20">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Members Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Community Finder helped me connect with amazing people who share my interests. I've made real friendships that go beyond the screen.",
                name: "Sarah Johnson",
                role: "Music Community Member"
              },
              {
                quote: "I found a local photography group that meets weekly. It's incredible how much I've learned and grown as a photographer through this community.",
                name: "David Chen",
                role: "Photography Enthusiast"
              },
              {
                quote: "As a book lover, finding others who enjoy discussing literature has been fantastic. Our monthly book club meetups are the highlight of my month.",
                name: "Emily Martinez",
                role: "Book Club Organizer"
              },
              {
                quote: "The hiking community here is amazing! I've discovered so many beautiful trails and made great friends who share my love for outdoor adventures.",
                name: "Michael Thompson",
                role: "Hiking Enthusiast"
              },
              {
                quote: "This platform connected me with fellow tech enthusiasts. We now co-work regularly and collaborate on exciting projects together.",
                name: "Lisa Wong",
                role: "Tech Community Lead"
              },
              {
                quote: "Finding a local cooking club changed my life! We share recipes, cook together, and have amazing potluck gatherings every month.",
                name: "James Rodriguez",
                role: "Culinary Community Member"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="w-full sm:w-[380px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <CardHeader className="flex-1">
                  <CardDescription className="h-[80px] overflow-y-auto text-sm">
                    {testimonial.quote}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary" />
                    <div>
                      <CardTitle className="text-base">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 sm:px-20">
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
