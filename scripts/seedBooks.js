const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

// Import models
const Book = require("../models/book");
const ImageModel = require("../models/image");
const User = require("../models/User");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.log("❌ Error connecting to MongoDB", error);
    process.exit(1);
  }
};

// Create placeholder images for book covers
const createPlaceholderImages = async (adminUserId, count = 25) => {
  console.log(`📸 Creating ${count} placeholder images...`);

  const images = [];
  for (let i = 1; i <= count; i++) {
    // Using Lorem Picsum for placeholder book cover images
    const imageUrl = `https://picsum.photos/300/400?random=${i}`;
    const publicId = `seed_book_cover_${i}`;

    const image = new ImageModel({
      imageUrl,
      publicId,
      uploadedBy: adminUserId,
    });

    images.push(image);
  }

  const savedImages = await ImageModel.insertMany(images);
  console.log(`✅ Created ${savedImages.length} placeholder images`);
  return savedImages.map((img) => img._id);
};

// Generate realistic book data
const generateBookData = (imageIds) => {
  const books = [];
  const currentYear = new Date().getFullYear();

  // Predefined realistic book titles and authors for variety
  const bookTemplates = [
    { title: "The Silent Observer", author: "Emma Richardson" },
    { title: "Echoes of Tomorrow", author: "Marcus Chen" },
    { title: "The Last Garden", author: "Sofia Martinez" },
    { title: "Digital Dreams", author: "Alex Thompson" },
    { title: "Whispers in the Dark", author: "Isabella Romano" },
    { title: "The Quantum Paradox", author: "Dr. James Wilson" },
    { title: "Beyond the Horizon", author: "Liam O'Connor" },
    { title: "The Memory Collector", author: "Zara Patel" },
    { title: "Shadows of the Past", author: "Noah Anderson" },
    { title: "The Crystal Keys", author: "Maya Johansson" },
  ];

  for (let i = 0; i < 20; i++) {
    // Use predefined templates for first 10, then generate random ones
    let title, author;

    if (i < bookTemplates.length) {
      title = bookTemplates[i].title;
      author = bookTemplates[i].author;
    } else {
      // Generate random but realistic titles
      const titleTemplates = [
        `The ${faker.word.adjective()} ${faker.word.noun()}`,
        `${faker.word.adjective()} ${faker.word.noun()}s`,
        `The ${faker.word.noun()} of ${faker.word.noun()}`,
        `${faker.person.firstName()}'s ${faker.word.noun()}`,
        `The Last ${faker.word.noun()}`,
      ];
      title = faker.helpers.arrayElement(titleTemplates);
      author = `${faker.person.firstName()} ${faker.person.lastName()}`;
    }

    const book = {
      title: title.length > 100 ? title.substring(0, 97) + "..." : title,
      author,
      year: faker.date
        .between({
          from: new Date(1950, 0, 1),
          to: new Date(currentYear, 11, 31),
        })
        .getFullYear(),
      imageId: faker.helpers.arrayElement(imageIds),
    };

    books.push(book);
  }

  return books;
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting database seeding...\n");

    // Check if there's an admin user, create one if not
    let adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      console.log("👤 Creating admin user for seeding...");
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      adminUser = new User({
        username: "admin",
        email: "admin@bookstore.com",
        password: hashedPassword,
        role: "admin",
      });

      await adminUser.save();
      console.log("✅ Created admin user (admin@bookstore.com / admin123)\n");
    } else {
      console.log("✅ Using existing admin user\n");
    }

    // Clear existing data
    console.log("🧹 Cleaning existing seed data...");
    await Book.deleteMany({});
    await ImageModel.deleteMany({ publicId: { $regex: /^seed_/ } });
    console.log("✅ Cleaned existing data\n");

    // Create placeholder images
    const imageIds = await createPlaceholderImages(adminUser._id, 25);
    console.log("");

    // Generate and insert book data
    console.log("📚 Creating 20 fake books...");
    const booksData = generateBookData(imageIds);
    const createdBooks = await Book.insertMany(booksData);

    console.log("✅ Successfully created books:\n");
    createdBooks.forEach((book, index) => {
      console.log(
        `${index + 1}. "${book.title}" by ${book.author} (${book.year})`
      );
    });

    console.log(`\n🎉 Database seeding completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   • ${createdBooks.length} books created`);
    console.log(`   • ${imageIds.length} placeholder images created`);
    console.log(`   • Admin user: admin@bookstore.com (password: admin123)`);
    console.log(`\n💡 You can now test your pagination with real data!`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
};

// Run the seeding
seedDatabase();
