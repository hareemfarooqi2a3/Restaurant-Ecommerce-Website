// src/app/OurChef/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import ForAllHeroSections from "../../../components/ForAllHeroSections";
import Image from "next/image";
import { client } from "../../sanity/lib/client"; // Import Sanity client

// Define the Chef interface
interface Chef {
  id: string; // Map Sanity's _id
  name: string;
  position: string;
  experience: number;
  specialty: string;
  image: string; // Extracted URL for image
  description: string;
  available: boolean;
}

export default function OurChef() {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch chefs' data from Sanity
  useEffect(() => {
    async function fetchChefs() {
      try {
        // Define GROQ query to fetch chef data
        const query = `*[_type == "chef"]{
          _id,
          name,
          position,
          experience,
          specialty,
          "image": image.asset->url,
          description,
          available
        }`;

        const sanityChefs = await client.fetch(query); // Fetch from Sanity

        // Map _id to id
        const mappedChefs = sanityChefs.map((chef: any) => ({
          id: chef._id,
          name: chef.name,
          position: chef.position,
          experience: chef.experience,
          specialty: chef.specialty,
          image: chef.image || "",
          description: chef.description || "",
          available: chef.available || false,
        }));

        setChefs(mappedChefs); // Set fetched chefs data
        setIsLoading(false); // Update loading state
      } catch (error) {
        console.error("Error fetching chefs:", error);
      }
    }

    fetchChefs();
  }, []);

  return (
    <div className="main-content">
      <ForAllHeroSections />
      <div className="px-40 py-20">
        {isLoading ? (
          <div>Loading chefs...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {chefs.map((chef) => (
              <div
                key={chef.id} // Use id from Sanity
                className="group relative bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Chef Image */}
                <div className="relative h-56">
                  <Image
                    src={chef.image}
                    alt={chef.name}
                    fill
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Chef Info */}
                <div className="text-center py-4">
                  <h3 className="text-black font-semibold text-lg">
                    {chef.name}
                  </h3>
                  <p className="text-gray-800 font-semibold">{chef.position}</p>
                  <p className="text-gray-700 text-sm">
                    {chef.specialty} ({chef.experience} years experience)
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
