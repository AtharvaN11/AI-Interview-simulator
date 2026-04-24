import { useNavigate } from "react-router-dom";

const CTA = ({ onStart }) => {

  const navigate = useNavigate();

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-center text-white">

      {/* animated background glow */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,#34d399,transparent_40%),radial-gradient(circle_at_70%_70%,#10b981,transparent_40%)] animate-pulse"></div>

      <div className="relative max-w-4xl mx-auto px-6">

        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to crack your next interview?
        </h2>

        <p className="mt-6 text-lg text-emerald-200">
          Practice realistic interviews with AI feedback and improve your confidence.
        </p>

        {/* CTA BUTTON */}
        <button
          onClick={() => navigate("/login")}
          className="mt-10 bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition duration-300"
        >
          Start Free Today →
        </button>

        {/* small trust text */}
        <p className="mt-6 text-sm text-emerald-300">
          No credit card required • Start instantly
        </p>

      </div>

    </section>
  );
};

export default CTA;