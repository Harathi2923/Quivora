const Hero = () => {
  return (
    <section id="home" className="bg-[#F9F1E6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}

          <div>

            <span className="inline-block bg-[#023222]/10 text-[#023222] px-4 py-2 rounded-full text-sm font-semibold">
              Welcome to Quivora
            </span>

            <h1 className="mt-6 text-5xl lg:text-6xl font-extrabold text-[#023222] leading-tight">
              Learn Smarter.
              <br />
              Assess Better.
              <br />
              Achieve More.
            </h1>

            <p className="mt-8 text-lg text-gray-700 leading-8">
              Quivora is a modern learning and assessment platform that helps
              learners build knowledge, evaluate their understanding, and grow
              with confidence through structured quizzes and meaningful
              assessments. Every attempt becomes a step toward continuous
              learning and achievement.
            </p>

            {/* Highlights */}

            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3 text-[#023222] font-medium">
                <span className="text-green-700 text-xl">✔</span>
                Interactive Learning Experience
              </div>

              <div className="flex items-center gap-3 text-[#023222] font-medium">
                <span className="text-green-700 text-xl">✔</span>
                Secure Online Assessments
              </div>

              <div className="flex items-center gap-3 text-[#023222] font-medium">
                <span className="text-green-700 text-xl">✔</span>
                Continuous Skill Development
              </div>

            </div>

            {/* Scroll */}

            <div className="mt-12">

              <a
                href="#about"
                className="inline-flex items-center gap-2 text-[#023222] font-semibold hover:text-[#D4A017] transition duration-300"
              >
                Discover More

                <span className="text-2xl animate-bounce">
                  ↓
                </span>

              </a>

            </div>

          </div>

          {/* Right Side */}

          <div className="relative flex justify-center">

            {/* Floating Card */}

            <div className="bg-white rounded-3xl shadow-2xl w-[420px] p-8 border border-gray-200">

              <div className="bg-[#023222] text-white rounded-2xl p-6">

                <h2 className="text-2xl font-bold">
                  Java Full Stack Assessment
                </h2>

                <p className="mt-2 text-sm text-gray-300">
                  Question 4 of 20
                </p>

              </div>

              <div className="mt-8 space-y-4">

                <div className="border rounded-xl p-4 cursor-pointer hover:border-[#023222]">
                  HTML
                </div>

                <div className="border-2 border-[#023222] bg-[#F9F1E6] rounded-xl p-4 font-semibold">
                  React.js ✓
                </div>

                <div className="border rounded-xl p-4 cursor-pointer hover:border-[#023222]">
                  Spring Boot
                </div>

                <div className="border rounded-xl p-4 cursor-pointer hover:border-[#023222]">
                  MySQL
                </div>

              </div>

              <div className="mt-8">

                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>Progress</span>
                  <span>65%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div className="bg-[#D4A017] h-3 rounded-full w-2/3"></div>

                </div>

              </div>

              <div className="mt-8 flex justify-between items-center">

                <span className="text-gray-600">
                  ⏱ 12:43 Remaining
                </span>

                <button className="bg-[#023222] text-white px-5 py-2 rounded-xl hover:bg-[#03452f] transition">
                  Next →
                </button>

              </div>

            </div>

            {/* Floating Badge */}

            <div className="absolute -top-6 -right-6 bg-white shadow-xl rounded-2xl px-5 py-4 animate-bounce">

              <p className="text-sm text-gray-500">
                Score
              </p>

              <h3 className="text-2xl font-bold text-[#023222]">
                92%
              </h3>

            </div>

            {/* Floating Time */}

            <div className="absolute -bottom-6 -left-6 bg-white shadow-xl rounded-2xl px-5 py-4">

              <p className="text-sm text-gray-500">
                Duration
              </p>

              <h3 className="text-xl font-bold text-[#023222]">
                20 Min
              </h3>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;