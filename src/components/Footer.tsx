import { MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-ocean text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-4">San Francisco, Camotes</h3>
            <p className="text-white/90 leading-relaxed">
              Discover the hidden paradise of the San Francisco Camotes Island Cebu, Philippines. Experience pristine beaches,
              crystal caves, and natural wonders through our immersive virtual tours.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/destinations" className="text-white/90 hover:text-sand transition-colors">
                  Destinations
                </a>
              </li>
              <li>
                <a href="/virtual-tours" className="text-white/90 hover:text-sand transition-colors">
                  Virtual Tours
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/90 hover:text-sand transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white/90 hover:text-sand transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-white/90">San Francisco, Cebu, Philippines</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-white/90">+63 968 286 0905</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-white/90">suroysuroysanfrancisco@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} Suroy-suroy San Francisco. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
