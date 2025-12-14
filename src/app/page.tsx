'use client'

import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/auth/actions/auth";
import { User } from "@/lib/model/user";

import React, { useEffect, useState } from "react";

export default function HomePage() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    loadUser();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <h1> Dashboard Page</h1>
      {/* <div className="bg-white p-4 rounded-md">
        <div>
          <h3>Development of Thesis Document Advising and Critique Review System</h3>
          <p>Primary Adviser: {user?.firstName} {user?.lastName}</p>
        </div>

        <div className="grid grid-cols-3 gap-10">
          <div>
            <h3>Program:</h3>
            <p>Bachelor of Science in Computer Science</p>
          </div>

          <div>
            <h3>Start Date:</h3>
            <p>August 2025</p>
          </div>

          <div>
            <h3>Expected Finish Date:</h3>
            <p>May 2026</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 space-x-4">
        <div className="bg-white p-3 rounded-md">
          <h2>Documents Submitted</h2>
          <h1>15</h1>
        </div>


        <div className="bg-white p-3 rounded-md">
          <h2>Pending Reviews</h2>
          <h1>3</h1>
        </div>

        <div className="bg-white p-3 rounded-md">
          <h2>Feedback Items</h2>
          <h1>8</h1>
        </div>

        <div className="bg-white p-3 rounded-md">
          <h2>Completed Milestones</h2>
          <h1>4/7</h1>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1>Thesis Progress</h1>
          <h2>Overall Progress</h2>
          <Progress value={66}/>
        </div>

        <div className="justify-self-end">
          <Calendar
            className="rounded-md border shadow-sm"
            mode="single"
            // captionLayout="dropdown"
            selected={new Date()}
            // onSelect={setDate}
          />
        </div>
      </div> */}
    </div>
  );
}
