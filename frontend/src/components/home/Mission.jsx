import { BookOpen, ClipboardCheck, Trophy } from "lucide-react";

const Mission = () => {
  const cards = [
    {
      icon: <BookOpen size={34} />,
      title: "Learn",
      description:
        "Build a strong foundation through structured quizzes that help you understand concepts, not just memorize answers.",
    },
    {
      icon: <ClipboardCheck size={34} />,
      title: "Assess",
      description:
        "Evaluate your knowledge with secure, timed assessments designed to measure understanding and readiness.",
    },
    {
      icon: <Trophy size={34} />,
      title: "Achieve",
      description:
        "Track your growth, celebrate progress, and gain confidence with every successful assessment.",
    },
  ];

  return (
    <section id="about" className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <h2 className="text-5xl font-bold text-[#023222]">
            Empowering Every Learning Journey
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-8">
            At Quivora, every assessment is more than just a score. We help
            learners build knowledge, evaluate skills, and achieve meaningful
            progress through a modern and engaging learning experience.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">

          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#023222] text-white flex items-center justify-center">
                {card.icon}
              </div>

              <h3 className="mt-6 text-3xl font-bold text-[#023222]">
                {card.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-8">
                {card.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Mission;