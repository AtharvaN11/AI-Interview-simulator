import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HeroSection = ({ onStart }) => {

  const navigate = useNavigate();

  // simple AI typing demo text
  const texts = [
    "Tell me about yourself.",
    "What are your strengths?",
    "Explain a challenging project.",
    "Why should we hire you?"
  ];

  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {

      setDisplayText(texts[index].slice(0, charIndex + 1));
      setCharIndex((prev) => prev + 1);

      if (charIndex === texts[index].length) {
        setTimeout(() => {
          setCharIndex(0);
          setIndex((prev) => (prev + 1) % texts.length);
        }, 1500);
      }

    }, 60);

    return () => clearInterval(interval);
  }, [charIndex, index]);

  return (
    <section className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 py-24 overflow-hidden">

      {/* animated gradient background */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#34d399,transparent_40%),radial-gradient(circle_at_80%_30%,#10b981,transparent_40%),radial-gradient(circle_at_50%_80%,#059669,transparent_40%)] animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center min-h-[70vh]">

        {/* LEFT SIDE */}
        <div>

          <div className="mb-6 text-sm bg-emerald-700/40 text-emerald-100 inline-block px-4 py-2 rounded-full backdrop-blur">
            Trusted by thousands of job seekers
          </div>

          <h1 className="text-6xl font-bold text-white leading-tight">
            Practice Your Interview <br />
            <span className="text-emerald-400">With Interview AI</span>
          </h1>

          <p className="text-emerald-100 mt-6 text-lg max-w-lg">
            Simulate real interviews, receive AI feedback, and track your
            performance with intelligent analytics.
          </p>

          {/* AI typing demo */}
          <div className="mt-6 bg-black/20 backdrop-blur border border-white/10 text-emerald-200 px-4 py-3 rounded-lg text-sm font-mono w-fit">
            AI: {displayText}
            <span className="animate-pulse">|</span>
          </div>

          {/* small feature badges */}
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-white">

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
              🤖 AI Generated Questions
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
              🎤 Voice Interview Practice
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
              📊 Performance Analytics
            </div>

          </div>

          <div className="mt-8 flex gap-4">

            {/* FIXED LOGIN REDIRECT */}
            <button
              onClick={() => navigate("/login")}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition"
            >
              Start Free Interview
            </button>

            {/* smooth scroll */}
            <button
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-white/30 text-white px-8 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Learn More
            </button>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="relative flex justify-center">

          {/* main card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-sm z-10 animate-[float_6s_ease-in-out_infinite]">

            <h3 className="font-semibold text-lg mb-6 text-white">
              AI Interview Evaluation
            </h3>

            <div className="space-y-4">

              <div>
                <p className="text-sm text-emerald-200">Confidence</p>
                <div className="w-full bg-white/20 h-3 rounded-full">
                  <div className="bg-emerald-400 h-3 rounded-full w-[82%]"></div>
                </div>
              </div>

              <div>
                <p className="text-sm text-emerald-200">Communication</p>
                <div className="w-full bg-white/20 h-3 rounded-full">
                  <div className="bg-emerald-400 h-3 rounded-full w-[75%]"></div>
                </div>
              </div>

              <div>
                <p className="text-sm text-emerald-200">Technical Depth</p>
                <div className="w-full bg-white/20 h-3 rounded-full">
                  <div className="bg-emerald-400 h-3 rounded-full w-[90%]"></div>
                </div>
              </div>

            </div>

          </div>


          {/* floating card */}
          <div className="absolute -top-10 left-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl px-4 py-2 text-xs text-white animate-pulse">
            🤖 AI Analyzing Answer
          </div>


          {/* floating card */}
          <div className="absolute -bottom-10 right-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl px-4 py-2 text-xs text-white animate-pulse">
            🎯 Confidence Score Updated
          </div>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;