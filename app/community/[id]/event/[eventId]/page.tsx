"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, Share2, Heart } from 'lucide-react';

// Sample event data
const sampleEvent = {
  id: 'event-123',
  title: 'Community Hackathon 2023',
  description: 'Join us for a weekend of coding, collaboration, and creativity. This hackathon brings together developers, designers, and innovators to build solutions for local community challenges.',
  date: 'October 15, 2023',
  time: '9:00 AM - 6:00 PM',
  location: 'Community Center, 123 Main Street',
  organizer: 'Tech Community Group',
  attendees: 42,
  imageUrl: '',
  tags: ['Technology', 'Networking', 'Innovation'],
  isFree: true,
};

export default function EventPage() {
  const params = useParams();
  const { id, eventId } = params;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link href={`/community/${id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
          <span>←</span> Back to Community
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Event Header */}
        <div className="relative h-64 w-full">
          <Image 
            src={sampleEvent.imageUrl}
            alt={sampleEvent.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <div className="flex items-center gap-2 text-white mb-2">
              {sampleEvent.isFree ? (
                <span className="bg-green-600 px-2 py-1 rounded text-xs font-medium">Free</span>
              ) : (
                <span className="bg-blue-600 px-2 py-1 rounded text-xs font-medium">Paid</span>
              )}
              {sampleEvent.tags.map((tag) => (
                <span key={tag} className="bg-gray-700 bg-opacity-50 px-2 py-1 rounded text-xs">{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-white">{sampleEvent.title}</h1>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Event Info */}
            <div className="flex-1">
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">About this event</h2>
                <p className="text-gray-700">{sampleEvent.description}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-500" size={20} />
                    <span>{sampleEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-gray-500" size={20} />
                    <span>{sampleEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-500" size={20} />
                    <span>{sampleEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="text-gray-500" size={20} />
                    <span>{sampleEvent.attendees} people attending</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Actions */}
            <div className="w-full md:w-80">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Organized by</h3>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <span className="font-medium">{sampleEvent.organizer}</span>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                    RSVP to Event
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 flex justify-center items-center gap-2 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-100 transition">
                      <Heart size={18} />
                      Save
                    </button>
                    <button className="flex-1 flex justify-center items-center gap-2 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-100 transition">
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
