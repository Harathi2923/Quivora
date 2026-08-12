import {
  ShieldCheck,
  BarChart3,
  MonitorSmartphone,
  GraduationCap,
  BrainCircuit,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: <GraduationCap size={32} />,
    title: "Learn with Purpose",
    description:
      "Strengthen your understanding through carefully designed quizzes that focus on concept-based learning.",
  },
  {
    icon: <BrainCircuit size={32} />,
    title: "Build Confidence",
    description:
      "Practice regularly in a structured environment that prepares you for exams, interviews, and certifications.",
  },
  {
    icon: <BarChart3 size={32} />,
    title: "Track Your Progress",
    description:
      "Monitor your learning journey and understand how your knowledge grows with every assessment.",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Secure Assessments",
    description:
      "Experience reliable and fair assessments through role-based access and secure evaluation methods.",
  },
  {
    icon: <MonitorSmartphone size={32} />,
    title: "Learn Anywhere",
    description:
      "Access Quivora seamlessly across desktops, tablets, and mobile devices without compromising your experience.",
  },
  {
    icon: <Rocket size={32} />,
    title: "Grow Every Day",
    description:
      "Every assessment becomes an opportunity to improve your skills and achieve your learning goals.",
  },
];

const WhyChoose = () => {
  return (
    <section id="features" className="bg-[#F9F1E6] py-14">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <h2 className="text-5xl font-bold text-[#023222]">
            Why Choose Quivora?
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-8">
            Quivora is designed to make learning meaningful, assessments reliable,
            and progress measurable. Every feature is built to support learners
            in developing knowledge with confidence.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-20">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#023222] text-white flex items-center justify-center">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#023222]">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-8">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default WhyChoose;