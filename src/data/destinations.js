// src/data/destinations.js

import santiagoBay from "@/assets/santiago-bay.jpg";
import timboCave from "@/assets/timubo-cave.jpg";
import lakeDanao from "@/assets/lake-danao.jpg";

export const destinations = [
  {
    id: "santiago-bay",
    title: "Santiago White Beach",
    shortDescription:
      "Pristine white sand beach with crystal-clear turquoise waters.",
    longDescription:
      "Santiago Beach is a popular white sand beach in the Camotes Islands, located on Pacijan Island in the municipality of San Francisco. It is known for its calm, clear waters, especially during high tide, and offers various activities like swimming, snorkeling, and water sports, with options for budget-friendly local accommodations and more developed resorts like Santiago Bay Garden and Resort.",
    image: santiagoBay,
    address: "Santiago, San Francisco, Camotes Island, Cebu",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1308.7690154992563!2d124.30585518482953!3d10.58888383764517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a9cda24b9ccbc3%3A0xb6a7048b13dd7429!2sSantiago%20Bay%20Beach!5e0!3m2!1sen!2sph!4v1764566444238!5m2!1sen!2sph",
    hotspot: { top: "96%", left: "35%" },
  },
  {
    id: "timubo-cave",
    title: "Timubo Cave",
    shortDescription:
      "A mystical cave featuring a natural underground lagoon.",
    longDescription:
      "Timubo Cave is a popular natural attraction on Camotes Island, Cebu, known for its clear, cold, subterranean freshwater pool where visitors can swim. It is part of the island's many cave systems and offers a unique swimming experience after a short trek down a narrow, illuminated pathway.",
    image: timboCave,
    address: "Barangay Sonog, San Francisco, Camotes Island, Cebu",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19757.929324078646!2d124.33172094116503!3d10.698202280098219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a82dfa3e075e0d%3A0x87138d7f55c5b11d!2sTimubo%20Cave!5e0!3m2!1sen!2sph!4v1764567539888!5m2!1sen!2sph",
    hotspot: { top: "19%", left: "59%" },

  },
  {
    id: "lake-danao",
    title: "Lake Danao Park",
    shortDescription:
      "A serene guitar-shaped lake surrounded by lush forest.",
    longDescription:
      "Lake Danao is a park in the Camotes Islands, Cebu, Philippines, that offers various recreational activities like boating, ziplining, and swimming. It is situated in San Francisco and has an entrance fee, with additional costs for activities. Visitors can enjoy amenities such as a mini zoo, a swimming pool, and horseback riding.",
    image: lakeDanao,
    address: "Lake Danao Park, San Francisco, Camotes Island, Cebu",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15683.065247585282!2d124.33157831022717!3d10.675238531477834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a82d9ad2daeb61%3A0xf43d57825b8d647c!2sLake%20Danao!5e0!3m2!1sen!2sph!4v1764567586608!5m2!1sen!2sph",
    hotspot: { top: "40%", left: "58%" },
  },
    {
    id: "mangodlong-rock",
    title: "Mangodlong Rock Resort",
    shortDescription:
      "Pristine white sand beach with crystal-clear turquoise waters.",
    longDescription:
      "Pristine white sand beach with crystal-clear turquoise waters, perfect for swimming, snorkeling, and beach activities.",
    image: santiagoBay,
    address: "Santiago, San Francisco, Camotes Island, Cebu",
    mapEmbed: "YOUR_MAP_EMBED_URL_HERE",
  },
];
