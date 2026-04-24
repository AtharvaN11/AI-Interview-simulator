import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const InterviewTips = () => {
  return (
    <section id="tips" className="py-24 bg-gray-50 dark:bg-emerald-950">

      <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">
        Interview Tips for Success
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6">

        {/* DOs */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-emerald-900/40 backdrop-blur-lg border border-gray-200 dark:border-emerald-700 shadow-xl rounded-2xl p-8 hover:-translate-y-2 transition"
        >

          <h3 className="flex items-center gap-2 text-xl font-semibold text-emerald-600 mb-6">
            <CheckCircle size={22}/> Do's
          </h3>

          <ul className="space-y-4 text-gray-700 dark:text-gray-300">

            <li>RESEARCH THE COMPANY BEFORE INTERVIEW</li>
            <li>PRACTICE COMMON INTERVIEW QUESTIONS</li>
            <li>MAINTAIN EYE CONTACT AND CONFIDENT POSTURE</li>
            <li>GIVE STRUCTURED AND VALID ANSWERS</li>
            <li>ASK THOUGHTFULL QUESTION TO THE INTERVIEWER</li>

          </ul>

        </motion.div>


        {/* DON'Ts */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-emerald-900/40 backdrop-blur-lg border border-gray-200 dark:border-emerald-700 shadow-xl rounded-2xl p-8 hover:-translate-y-2 transition"
        >

          <h3 className="flex items-center gap-2 text-xl font-semibold text-red-500 mb-6">
            <XCircle size={22}/> Don'ts
          </h3>

          <ul className="space-y-4 text-gray-700 dark:text-gray-300">

            <li>Do not arrive late for the interview</li>
            <li>Avoid negative talk about previous employers</li>
            <li>Do not interrupt the interviewer</li>
            <li>Avoid giving long unrelated answers</li>
            <li>Do not appear unprepared</li>

          </ul>

        </motion.div>

      </div>

    </section>
  );
};

export default InterviewTips;