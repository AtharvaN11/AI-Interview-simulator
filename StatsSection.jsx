import { motion } from "framer-motion";

const StatsSection = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white">

      {/* glowing background */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#34d399,transparent_40%),radial-gradient(circle_at_80%_30%,#10b981,transparent_40%),radial-gradient(circle_at_50%_80%,#059669,transparent_40%)] animate-pulse"></div>

      <div className="relative max-w-6xl mx-auto px-6">

        {/* section title */}
        <h2 className="text-center text-4xl font-bold mb-16">
          Trusted by Job Seekers Worldwide
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-center">

          {/* Stat 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8 }}
            className="p-10 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl hover:shadow-emerald-400/30 transition"
          >
            <h2 className="text-5xl font-bold text-emerald-400">10K+</h2>
            <p className="text-emerald-200 mt-4">
              Interviews Practiced
            </p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="p-10 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl hover:shadow-emerald-400/30 transition"
          >
            <h2 className="text-5xl font-bold text-emerald-400">95%</h2>
            <p className="text-emerald-200 mt-4">
              User Satisfaction
            </p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -8 }}
            className="p-10 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl hover:shadow-emerald-400/30 transition"
          >
            <h2 className="text-5xl font-bold text-emerald-400">5K+</h2>
            <p className="text-emerald-200 mt-4">
              Active Users
            </p>
          </motion.div>

        </div>

      </div>

    </section>
  );
};

export default StatsSection;