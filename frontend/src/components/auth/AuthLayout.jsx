import logo from "../../assets/logo/quivora-logo.png";
import {
  BookOpen,
  ShieldCheck,
  ChartNoAxesColumn,
} from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01281B] via-[#023222] to-[#0B4A34] overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4A017]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[160px]" />

      <div className="max-w-7xl mx-auto h-screen grid lg:grid-cols-2 items-center px-10 gap-8">

        {/* LEFT */}

        

         <div className="flex flex-col justify-center h-full">

    <div className="flex items-center ">

        <img
            src={logo}
            alt="Quivora"
            className="h-16 w-auto object-contain"
        />

        <div>

            <h1 className="text-5xl font-bold text-white">
                QUIVORA
            </h1>

            <p className="tracking-[5px] text-white/70">
                Learn. Assess. Achieve.
            </p>

        </div>

    </div>

    <h2 className="mt-6 text-4xl font-extrabold text-white">
        Welcome Back!
    </h2>

    <p className="mt-5 text-lg leading-8 text-white/80 max-w-xl">
        Continue your learning journey by accessing quizzes,
        assessments, performance reports, and personalized
        learning experiences.
    </p>

          <div className="mt-6 space-y-6">

            <div className="flex items-center gap-4 text-white">

              <div className="w-12 h-12 rounded-full bg-[#D4A017]/20 flex items-center justify-center">

                <BookOpen className="text-[#D4A017]" />

              </div>

              <span className="text-lg">
                Learn with confidence
              </span>

            </div>

            <div className="flex items-center gap-4 text-white">

              <div className="w-12 h-12 rounded-full bg-[#D4A017]/20 flex items-center justify-center">

                <ShieldCheck className="text-[#D4A017]" />

              </div>

              <span className="text-lg">
                Take secure assessments
              </span>

            </div>

            <div className="flex items-center gap-4 text-white">

              <div className="w-12 h-12 rounded-full bg-[#D4A017]/20 flex items-center justify-center">

                <ChartNoAxesColumn className="text-[#D4A017]" />

              </div>

              <span className="text-lg">
                Track your progress
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex justify-center">

          {children}

        </div>

      </div>

    </div>
  );
};

export default AuthLayout;