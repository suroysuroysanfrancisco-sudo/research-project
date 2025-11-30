import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DestinationCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  delay?: number;
}

export const DestinationCard = ({ title, description, image, link, delay = 0 }: DestinationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative overflow-hidden rounded-lg shadow-medium hover:shadow-large transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-2xl font-bold font-playfair mb-2">{title}</h3>
          <p className="text-white/90 mb-4 line-clamp-2">{description}</p>
          <Link 
            to={link}
            className="inline-flex items-center space-x-2 text-sand hover:text-secondary transition-colors"
          >
            <span className="font-medium">Explore</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
      
      <div className="p-6 bg-card">
        <h3 className="text-xl font-bold font-playfair text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground line-clamp-2">{description}</p>
      </div>
    </motion.div>
  );
};
