import {
  Code2,
  Globe,
  Database,
  Brain,
  Shield,
  Cpu,
} from "lucide-react";

const categories = [
  {
    icon: <Code2 size={34} />,
    title: "Programming",
    description:
      "Strengthen your coding skills through quizzes on Java, Python, C++, JavaScript, and other programming languages.",
  },
  {
    icon: <Globe size={34} />,
    title: "Web Development",
    description:
      "Learn HTML, CSS, React, Node.js, APIs, and modern web technologies through interactive assessments.",
  },
  {
    icon: <Database size={34} />,
    title: "Database Management",
    description:
      "Practice SQL, PostgreSQL, MySQL, normalization, and database concepts with real-world questions.",
  },
  {
    icon: <Brain size={34} />,
    title: "Aptitude & Reasoning",
    description:
      "Improve logical thinking, analytical ability, and quantitative aptitude for interviews and competitive exams.",
  },
  {
    icon: <Shield size={34} />,
    title: "Cyber Security",
    description:
      "Understand secure computing, networking, and cybersecurity fundamentals through practical assessments.",
  },
  {
    icon: <Cpu size={34} />,
    title: "Emerging Technologies",
    description:
      "Explore Artificial Intelligence, Machine Learning, Cloud Computing, and other modern technologies.",
  },
];

const LearningCategories = () => {
  return (
    <section className="bg-[#F9F1E6] py-14">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <h2 className="text-5xl font-bold text-[#023222]">
            Discover What You Can Learn
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-8">
            Learning has no limits. Quivora offers assessments across diverse
            knowledge domains, helping learners strengthen technical skills,
            logical thinking, and professional readiness.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-20">

          {categories.map((category) => (
            <div
              key={category.title}
              className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#023222] text-white flex items-center justify-center">
                {category.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#023222]">
                {category.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-8">
                {category.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default LearningCategories;