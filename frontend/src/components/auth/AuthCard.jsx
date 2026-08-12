const AuthCard = ({
  title,
  subtitle,
  children,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}) => {
  return (
    <div
      className={`
        w-full
        max-w-md
        rounded-[28px]
        border
        border-white/20
        bg-white/10
        backdrop-blur-xl
        shadow-2xl
        px-8
        py-2
        ${className}
      `}
    >

            <h2 className="text-3xl font-bold text-center text-white  ${titleClassName}
        `}">
                {title}
            </h2>

            <p className="text-center text-white/70 mt-3 mb-3  ${subtitleClassName}
        `}">
                {subtitle}
            </p>

            {children}

        </div>

    );
};

export default AuthCard;