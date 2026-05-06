import mongoose from "mongoose";
import CountryModel from "../src/models/country";
import CardModel from "../src/models/card";
import UserModel from "../src/models/user";
import bcrypt from "bcrypt";

const countries = [
  { name: "USA", empire: "American", coordinates: [345, 242] },
  { name: "Philippines", empire: "American", coordinates: [1260, 346] },
  { name: "UK", empire: "British", coordinates: [747, 161] },
  { name: "India", empire: "British", coordinates: [1067, 296] },
  { name: "South Africa", empire: "British", coordinates: [858, 546] },
  { name: "Sri Lanka", empire: "British", coordinates: [1079, 379] },
  { name: "Egypt", empire: "British", coordinates: [878, 291] },
  { name: "Australia", empire: "British", coordinates: [1299, 535] },
  { name: "New Zealand", empire: "British", coordinates: [1453, 619] },
  { name: "Singapore", empire: "British", coordinates: [1147, 325] },
  { name: "Malaysia", empire: "British", coordinates: [1128, 315] },
  { name: "Canada", empire: "British", coordinates: [325, 119] },
  { name: "France", empire: "French", coordinates: [762, 191] },
  { name: "Morocco", empire: "French", coordinates: [729, 270] },
  { name: "Vietnam", empire: "French", coordinates: [1168, 322] },
  { name: "Algeria", empire: "French", coordinates: [769, 259] },
  { name: "Tunisia", empire: "French", coordinates: [540, 401] },
  { name: "Turkey", empire: "Ottoman", coordinates: [844, 217] },
  { name: "Netherlands", empire: "Dutch", coordinates: [775, 164] },
  { name: "Indonesia", empire: "Dutch", coordinates: [1217, 417] },
  { name: "Belgium", empire: "Belgian", coordinates: [771, 175] },
  { name: "Congo", empire: "Belgian", coordinates: [849, 422] },
  { name: "Germany", empire: "German", coordinates: [789, 143] },
  { name: "German East Africa", empire: "German", coordinates: [901, 459] },
  { name: "German West Africa", empire: "German", coordinates: [829, 521] },
  { name: "Japan", empire: "Japanese", coordinates: [1316, 240] },
  { name: "Mexico", empire: "Mexican", coordinates: [338, 302] },
  { name: "Cuba", empire: "Cuban", coordinates: [426, 310] },
  { name: "Russia", empire: "Russian", coordinates: [1085, 89] },
  { name: "Portugal", empire: "Portuguese", coordinates: [821, 486] },
  { name: "Madeira", empire: "Portuguese", coordinates: [668, 273] },
];

const cards = [
  // American
  {
    number: 1000,
    item: "postcard",
    date: "Undivided Back [manufactured pre-1907]",
    postmarked: "Yes; Date: June 24th 1907",
    place: "Plymouth, Wisconsin",
    country: "United States",
    empire: "American",
    company: "Unknown",
    companyInformation: "N/A",
    description:
      "This black and white photographic postcard shows an overwhelmed father smiling at the camera while holding a bucket and what could be a mop in his hands, with a lit candle balancing on top of his head.",
    analysis:
      "Anti-suffrage postcard reflecting fears about changing gender roles in the early 1900s.",
    message: "Mr. M. B. Heiman. Random Sake Ms in haste",
    imageLinks: [],
    themes: [],
    isInScrapbook: false,
    isBlurByDefault: false,
  },
  {
    number: 1004,
    item: "postcard",
    date: "Post 1907",
    postmarked: "Yes; Date: April 14 1911, Prosser, Washington",
    place: "",
    country: "United States",
    empire: "American",
    company: "Unknown",
    companyInformation: "N/A",
    description:
      "This postcard is a cartoon depiction of a man rocking a baby in a cradle while holding a bottle being fed to the baby through a tube.",
    analysis:
      "Anti-suffrage postcard reflecting fears about changing gender roles in the early 1900s.",
    message: "Hello? Say if you want to try and play ball why cum to Kiona?",
    imageLinks: [],
    themes: [],
    isInScrapbook: false,
    isBlurByDefault: false,
  },

  // British
  {
    number: 292,
    item: "postcard",
    date: "Divided Back (Post-1902)",
    postmarked: "No",
    place: "Madras & Bangalore",
    country: "India",
    empire: "British",
    company: "Higginbotham & Co.",
    companyInformation:
      "Higginbotham & Co. was a prominent bookstore and publishing house in colonial India, founded in 1844 in Madras.",
    description:
      "The black-and-white photographic postcard depicts an Indian manservant slumped on a seat and leaning back against a wall.",
    analysis:
      "Intended to be humorous for a British audience via racial stereotyping of Indian manservants.",
    message: "N/A",
    imageLinks: [],
    themes: [],
    isInScrapbook: false,
    isBlurByDefault: false,
  },
  {
    number: 1019,
    item: "postcard",
    date: "Post 1902",
    postmarked: "Yes; Date: [?] 23, 1908, Amble, Northumberland",
    place: "London",
    country: "England",
    empire: "British",
    company: "Eustace Watkins",
    companyInformation:
      "Part of the Burlesque Series, a variety of heavily hand tinted photograph postcards with comedic messages.",
    description:
      "This postcard is a heavily tinted real photograph of a man using a clothes wringer on laundry outside of a building.",
    analysis:
      "Anti-suffrage postcard from the early 1900s reflecting fears about changing gender roles.",
    message: "How would you like to be the husband of a suffragette?",
    imageLinks: [],
    themes: [],
    isInScrapbook: false,
    isBlurByDefault: false,
  },

  // Dutch
  {
    number: 950,
    item: "postcard",
    date: "Divided Back",
    postmarked: "Yes",
    place: "Leiden",
    country: "Netherlands",
    empire: "Dutch",
    company: "N/A",
    companyInformation: "",
    description:
      "This postcard depicts the traditional Dutch figure Santa Claus with Black Pete, riding a white horse.",
    analysis:
      "Reflects the Western colonial binary of colonizer and colonized through the depiction of Santa Claus and Black Pete.",
    message: "Groeten van Santa Claus",
    imageLinks: [],
    themes: [],
    isInScrapbook: false,
    isBlurByDefault: false,
  },
  {
    number: 951,
    item: "postcard",
    date: "Undivided Back [pre-1906]",
    postmarked: "Yes; December 6, 1901",
    place: "Rotterdam",
    country: "The Netherlands",
    empire: "Dutch",
    company: "C.G. Roder",
    companyInformation:
      "A printing firm and music engraving company founded in 1846 by Carl Gottlieb Roder, first based in Leipzig, Germany.",
    description:
      "This postcard depicts an outdoor scene of Santa Claus arriving at a harbor on board a steamship with the Netherlands flag flying atop the mast.",
    analysis:
      "Black Pete is at the center of this postcard. The figures of Zwarte Piet and St. Nicolaas gained popularity in Netherlands culture during the mid-19th century.",
    message: "Briefkaart — carte postale",
    imageLinks: [],
    themes: [],
    isInScrapbook: false,
    isBlurByDefault: false,
  },

  // French
  {
    number: 152,
    item: "postcard",
    date: "Post-1902",
    postmarked: "No",
    place: "",
    country: "Guinea",
    empire: "French",
    company: "Unknown",
    companyInformation: "",
    description:
      "The postcard depicts a black and white photograph of a black Guinean woman carrying a small European infant.",
    analysis:
      "Depicts the role of African nursemaids in raising European children in the age of French New Imperialism.",
    message: "N/A",
    imageLinks: [],
    themes: [],
    isInScrapbook: false,
    isBlurByDefault: false,
  },
  {
    number: 164,
    item: "postcard",
    date: "Post-1902",
    postmarked: "No",
    place: "Cairo",
    country: "Egypt",
    empire: "French",
    company: "The Cairo Postcard Trust",
    companyInformation:
      "Established in 1898 by Joseph Max Lichtenstern, an Austrian man who settled in Cairo.",
    description:
      "The illustration depicts an oriental architectural backdrop and an overwhelming female presence to reveal a harem scene.",
    analysis:
      "This postcard evokes a scene from the oriental harem, reflecting European Orientalist fantasies about the Middle East.",
    message: "N/A",
    imageLinks: [],
    themes: [],
    isInScrapbook: false,
    isBlurByDefault: false,
  },

  // Other
  {
    number: 1007,
    item: "postcard",
    date: "Post 1902",
    postmarked: "No",
    place: "Berlin",
    country: "Germany",
    empire: "Other",
    company: "Paul Finkenrath Berlin",
    companyInformation:
      "PFB was a typical German export oriented postcard company that published what customers desired.",
    description:
      "This postcard depicts a man with a very square jaw, with furrowed eyebrows holding two infants.",
    analysis:
      "Anti-suffrage postcard reflecting fears about changing gender roles in the early 1900s.",
    message: "From Herman Jehnzen",
    imageLinks: [],
    themes: [],
    isInScrapbook: false,
    isBlurByDefault: false,
  },
  {
    number: 1008,
    item: "postcard",
    date: "Post 1902",
    postmarked: "",
    place: "Berlin",
    country: "Germany",
    empire: "Other",
    company: "Paul Finkenrath Berlin",
    companyInformation:
      "PFB was a typical German export oriented postcard company that published what customers desired.",
    description:
      "This postcard is a cartoon drawing of a man, presumably a father, with an exasperated look on his face rocking a bassinet.",
    analysis:
      "Anti-suffrage postcard reflecting fears about changing gender roles and domestic labor.",
    message: "",
    imageLinks: [],
    themes: [],
    isInScrapbook: false,
    isBlurByDefault: false,
  },
];

const seed = async () => {
  const uri = "mongodb://localhost:27017/database";

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    await CountryModel.deleteMany({});
    await CardModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log("Cleared existing collections");

    await CountryModel.insertMany(countries);
    console.log(`Seeded ${countries.length} countries`);

    await CardModel.insertMany(cards);
    console.log(`Seeded ${cards.length} cards`);

    const passwordHash = await bcrypt.hash("hello1234", 10);
    await UserModel.create({
      email: process.env.TEST_ADMIN_EMAIL || "test.admin@gmail.com",
      password: passwordHash,
      role: "super_admin",
    });
    console.log("Seeded test admin user");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
