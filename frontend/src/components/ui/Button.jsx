const Button = ({
  children,
  variant = "primary",
  type = "button",
  onClick,
}) => {
  const styles = {
    primary:
      "bg-[#023222] text-white hover:bg-[#03452f]",

    secondary:
      "bg-[#D4A017] text-white hover:bg-[#b88a13]",

    outline:
      "border-2 border-[#023222] text-[#023222] hover:bg-[#023222] hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition duration-300 ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;