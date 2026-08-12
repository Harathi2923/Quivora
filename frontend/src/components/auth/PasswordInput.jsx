import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  label,
  placeholder,
  value,
  onChange,
  inputClassName = "",
  containerClassName = "",
}) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
     <div className={`mb-1 ${containerClassName}`}>
      <label className="block mb-2 text-white font-semibold">
        {label}
      </label>

      <div className="relative">

            <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full
            h-10
            rounded-xl
            bg-white/5
            border
            border-white/30
            px-5
            pr-12
            text-white
            placeholder:text-gray-300
            focus:outline-none
            focus:border-[#D4A017]
            focus:ring-2
            focus:ring-[#D4A017]/40
            transition
            ${inputClassName}
          `}
        />


        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3.5 text-gray-500"
        >
          {showPassword ? <EyeOff size={14} /> : <Eye size={18} />}
        </button>

      </div>

    </div>
  );
};

export default PasswordInput;