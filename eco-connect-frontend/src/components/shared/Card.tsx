interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "soft";
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  children,
  className = "",
  variant = "default",  
}) => {
  const variants = {
    default: "bg-white border-green-100",
    soft: "bg-green-50 border-green-100",
  };

  return (
    <div
      className={`
        group rounded-3xl border shadow-sm
        hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300
        overflow-hidden ${variants[variant]} ${className}
      `}
    >
      {image && (
        <div className="overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {title && (
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-slate-600 text-sm mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};