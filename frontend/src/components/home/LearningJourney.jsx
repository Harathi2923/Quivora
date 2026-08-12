import {
  Search,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Award,
} from "lucide-react";

const journey = [
  {
    icon: <Search size={30} />,
    title: "Discover",
    description:
      "Explore quizzes across multiple subjects and choose assessments that match your learning goals.",
  },
  {
    icon: <BookOpen size={30} />,
    title: "Practice",
    description:
      "Strengthen your understanding by solving structured quizzes and improving one concept at a time.",
  },
  {
    icon: <ClipboardCheck size={30} />,
    title: "Assess",
    description:
      "Take secure online assessments to evaluate your knowledge and measure your readiness.",
  },
  {
    icon: <TrendingUp size={30} />,
    title: "Improve",
    description:
      "Review your performance, understand mistakes, and keep improving with every assessment.",
  },
  {
    icon: <Award size={30} />,
    title: "Achieve",
    description:
      "Build confidence, reach your learning goals, and celebrate every milestone in your journey.",
  },
];

const LearningJourney = () => {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <h2 className="text-5xl font-bold text-[#023222]">
            Your Learning Journey
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-8">
            Every learner starts somewhere. Quivora guides you through each
            stage of your journey, helping you build knowledge, gain confidence,
            and achieve continuous growth.
          </p>

        </div>

        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8 mt-20">

          {journey.map((step, index) => (
            <div
              key={index}
              className="text-center"
            >

              <div className="mx-auto w-20 h-20 rounded-full bg-[#023222] text-white flex items-center justify-center shadow-lg">
                {step.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#023222]">
                {step.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default LearningJourney;