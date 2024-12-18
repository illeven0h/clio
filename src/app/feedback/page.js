"use client"
import { useState } from "react";
import Button from "../components/Button";
import Nav from "../components/Nav";
import Image from "next/image";
import { doc, setDoc} from "firebase/firestore";
import { initializeFirebase } from "/firebase/initFirebase";// Import Firestore methods

export default function Feedback() {
  // States to hold form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { firestore } = initializeFirebase();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!name || !email || !message) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      await setDoc(doc(firestore, "feedback", email), {
        name: name,
        email: email,
        message: message,
        timestamp: new Date(),
        status: "pending", // Set status to pending for initial submission
      });

      setName("");
      setEmail("");
      setMessage("");
      alert("Thank you for your feedback!");

    } catch (firestoreError) {
      console.error("Error writing document: ", firestoreError);
      throw firestoreError; // Propagate error for further handling
    }
    setLoading(false);
  };

  return (
    <>
    <Nav className="mt-4" clioClassName ="text-black mt-2 ml-8" logoutClassName="mt-3 mr-8" />
    <div className="h-screen flex flex-col justify-center items-center relative">
      {/* Background Image */}
      <Image
        src="/images/Union.svg"
        alt="Polygon Background"
        layout="fill"
        objectFit="contain"
        className="absolute z-[-1] p-4"
      />

      {/* Feedback Section */}
      <div className="flex justify-between gap-[100px] min-h-screen py-2">
        <div className="flex flex-col items-start justify-center">
          <div>
            <h4 className="text-black text-[30px]">We Value Your Feedback</h4>
          </div>
          <div>
            <p className="text-black text-[14px] opacity-80">
              We’re always looking to improve your experience. Share your thoughts
              <br /> and suggestions with us!
            </p>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="flex flex-col items-start gap-4 w-3/4 mt-4">
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 text-[12px] bg-ivory font-body text-black border-black px-4 py-2 w-full rounded-full"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 text-[12px] bg-ivory font-body text-black border-black px-4 py-2 w-full rounded-full"
              placeholder="Email Address"
            />
            <textarea
              name="message"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-2 text-[12px] h-40 bg-ivory font-body text-black border-black px-4 py-2 w-full rounded-[20px]"
              placeholder="Share your thoughts..."
            ></textarea>

            {/* Error message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <Button text={loading ? "Submitting..." : "Submit"} disabled={loading} />
          </form>
        </div>

        {/* Image */}
        <img src="/images/feedback.svg" height={392} width={400} alt="Feedback Illustration" />
      </div>
    </div>
    </>
  );
}
