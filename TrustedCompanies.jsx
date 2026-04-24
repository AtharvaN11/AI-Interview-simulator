const TrustedCompanies = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-emerald-950 text-center">

      <h2 className="text-2xl font-semibold mb-10 text-gray-900 dark:text-white">
        Trusted by Job Seekers
      </h2>

      <div className="flex justify-center flex-wrap gap-10 text-gray-500 dark:text-gray-300 text-lg font-medium">

        <span className="hover:text-emerald-500 transition">Amazon</span>
        <span className="hover:text-emerald-500 transition">Google</span>
        <span className="hover:text-emerald-500 transition">Microsoft</span>
        <span className="hover:text-emerald-500 transition">Infosys</span>
        <span className="hover:text-emerald-500 transition">TCS</span>

      </div>

    </section>
  );
};

export default TrustedCompanies;