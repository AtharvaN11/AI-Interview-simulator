import { LogIn, PlayCircle, Mic, BarChart } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-emerald-950">

      <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">
        How It Works
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 px-6">

        {[
          {icon: LogIn, title: "Login", desc: "Create your account to start practicing"},
          {icon: PlayCircle, title: "Start Interview", desc: "Choose interview type and difficulty"},
          {icon: Mic, title: "Answer Questions", desc: "Respond using voice or text"},
          {icon: BarChart, title: "Get AI Feedback", desc: "Receive detailed performance analysis"},
        ].map((step, i) => (
          
          <motion.div
          key={i}
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.5, delay:i*0.1 }}
          className="bg-white dark:bg-emerald-900 shadow-lg rounded-xl p-6 text-center hover:-translate-y-2 transition"
          >

            <step.icon className="mx-auto text-emerald-600" size={36}/>

            <h3 className="font-semibold mt-4 text-lg text-gray-900 dark:text-white">
              {step.title}
            </h3>

            <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
              {step.desc}
            </p>

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default HowItWorks;