import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-[#023222]">
            Let's Connect
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-8">
            Whether you're a student looking to improve your skills, an educator
            planning assessments, or an organization seeking a reliable evaluation
            platform, we're here to help. We'd love to hear your ideas, answer
            your questions, and support your learning journey.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-20 mt-10">

          {/* Left Side */}

          <div className="space-y-10">

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-xl bg-[#023222] text-white flex items-center justify-center">
                <Mail size={24}/>
              </div>

              <div>
                <h3 className="font-bold text-xl text-[#023222]">
                  Email Us
                </h3>

                <p className="text-gray-600">
                  support@quivora.com
                </p>
              </div>

            </div>

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-xl bg-[#023222] text-white flex items-center justify-center">
                <Phone size={24}/>
              </div>

              <div>
                <h3 className="font-bold text-xl text-[#023222]">
                  Call Us
                </h3>

                <p className="text-gray-600">
                  +91 98765 43210
                </p>
              </div>

            </div>

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-xl bg-[#023222] text-white flex items-center justify-center">
                <MapPin size={24}/>
              </div>

              <div>
                <h3 className="font-bold text-xl text-[#023222]">
                  Visit Us
                </h3>

                <p className="text-gray-600">
                  Hyderabad, Telangana, India
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}

          <form className="bg-[#F9F1E6] rounded-3xl p-10 shadow-lg space-y-6">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none focus:ring-2 focus:ring-[#023222]"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none focus:ring-2 focus:ring-[#023222]"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none focus:ring-2 focus:ring-[#023222]"
            />

            <textarea
              rows="4"
              placeholder="Write your message..."
              className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none focus:ring-2 focus:ring-[#023222]"
            />

            <button
              className="w-full bg-[#023222] text-white py-4 rounded-xl font-semibold hover:bg-[#03452f] transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>
    </section>
  );
};

export default Contact;