const AuthInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  inputClassName = "",
  containerClassName = "",
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label className="block mb-2 text-white font-semibold">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
       className="
            w-full
            h-10
            rounded-xl
            bg-white/5
            border
            border-white/30
            px-5
            text-white
            placeholder:text-gray-300
            focus:outline-none
            focus:border-[#D4A017]
            focus:ring-2
            focus:ring-[#D4A017]/40
            transition
            ${inputClassName}
        `}
            "
      />

    </div>
  );
};

export default AuthInput;