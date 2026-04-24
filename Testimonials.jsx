import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer – Infosys",
    text: "This AI interview simulator helped me improve my confidence and structure my answers better.",
  },
  {
    name: "Ananya Verma",
    role: "Data Analyst – TCS",
    text: "Practicing with AI feedback made me realize my weak points before my real interview.",
  },
  {
    name: "Karan Patel",
    role: "Frontend Developer – Startup",
    text: "The voice interview feature feels like a real interview environment. Highly recommended.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white dark:bg-emerald-950">

      <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">
        What Users Say
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">

        {testimonials.map((t, i) => (

          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-white/80 dark:bg-emerald-900/40 backdrop-blur-lg border border-gray-200 dark:border-emerald-700 shadow-xl rounded-2xl p-8 hover:-translate-y-2 transition"
          >

            <p className="text-gray-600 dark:text-gray-300 italic">
              “{t.text}”
            </p>

            <div className="mt-6">

              <p className="font-semibold text-gray-900 dark:text-white">
                {t.name}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.role}
              </p>

            </div>

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default Testimonials;