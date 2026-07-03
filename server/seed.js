/**
 * Seed database + upload media to S3
 * Usage: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const ASSETS_DIR = path.join(__dirname, 'seed-assets');
const S3_PREFIX = 'seed';

const BUCKET = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_BUCKET_REGION || 'ap-southeast-1';

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// ─── Schemas (mirror production models) ───────────────────────────────────
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
});
const Admin = mongoose.model('Admin', adminSchema, 'admin');

const profileSchema = new mongoose.Schema({
  name: String,
  key: String,
  url: String,
});

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  profilePic: profileSchema,
  mobile: String,
  password: String,
  interests: { type: [String], default: [] },
  isGoogleUser: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  dateJoined: { type: Date, default: Date.now },
}, { collection: 'students' });
const Student = mongoose.model('students', studentSchema);

const instructorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  profilePic: { type: profileSchema, required: true },
  certificates: { type: Array, required: true },
  mobile: { type: String, required: true, unique: true },
  qualification: { type: String, required: true },
  subjects: { type: Array, required: true },
  experience: { type: String, required: true },
  skills: { type: String, required: true },
  about: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: true },
  coursesCreated: [{ type: mongoose.Schema.Types.ObjectId }],
  dateJoined: { type: Date, default: Date.now },
}, { collection: 'instructor' });
const Instructor = mongoose.model('instructors', instructorSchema);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Category = mongoose.model('Category', categorySchema);

const fileSchema = new mongoose.Schema({
  name: String,
  key: String,
  url: String,
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  duration: { type: Number, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  tags: [String],
  price: Number,
  isPaid: { type: Boolean, required: true },
  about: { type: String, required: true },
  description: { type: String, required: true },
  syllabus: [String],
  requirements: [String],
  thumbnail: { type: fileSchema, required: true },
  thumbnailUrl: String,
  guidelines: { type: fileSchema, required: true },
  guidelinesUrl: String,
  introduction: { type: fileSchema, required: true },
  coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'students' }],
  rating: { type: Number, default: 4.5 },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  completionStatus: { type: Number, default: 100 },
}, { collection: 'course' });
const Course = mongoose.model('Course', courseSchema);

const lessonSchema = new mongoose.Schema({
  title: String,
  description: String,
  contents: [String],
  duration: Number,
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'instructor' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
  about: String,
  media: [{ key: String, name: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: 'lessons' });
const Lesson = mongoose.model('Lesson', lessonSchema);

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'lessons' },
  questions: [{
    question: String,
    options: [{ option: String, isCorrect: Boolean }],
  }],
  createdAt: { type: Date, default: Date.now },
}, { collection: 'quiz' });
const Quiz = mongoose.model('Quiz', quizSchema);

// ─── Helpers ───────────────────────────────────────────────────────────────
const hashPassword = async (pw) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pw, salt);
};

const s3Url = (key) =>
  `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

const randomKey = (ext) =>
  `${S3_PREFIX}/${crypto.randomBytes(16).toString('hex')}${ext}`;

async function downloadFile(url, destPath) {
  const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, Buffer.from(res.data));
  return destPath;
}

async function uploadFile(localPath, s3Key, contentType) {
  const body = fs.readFileSync(localPath);
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    Body: body,
    ContentType: contentType,
  }));
  return { key: s3Key, url: s3Url(s3Key), name: path.basename(localPath) };
}

async function uploadBuffer(buffer, filename, contentType) {
  const s3Key = randomKey(path.extname(filename));
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    Body: buffer,
    ContentType: contentType,
  }));
  return { key: s3Key, url: s3Url(s3Key), name: filename };
}

function makePdfBuffer(title) {
  const text = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R>>endobj\n4 0 obj<</Length 44>>stream\nBT /F1 24 Tf 100 700 Td (${title}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\n0000000190 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n284\n%%EOF`;
  return Buffer.from(text);
}

// Course data — titles/descriptions inspired by real popular topics (free sources)
const COURSE_DATA = [
  {
    title: 'React.js - The Complete Guide 2024',
    category: 'Web Development',
    level: 'Intermediate',
    tags: ['react', 'javascript', 'frontend', 'hooks'],
    isPaid: true,
    price: 499000,
    about: 'Master React from basics to advanced patterns including Hooks, Redux, and Next.js fundamentals.',
    description: 'This comprehensive React course covers components, state management, React Router, custom hooks, performance optimization, and building production-ready applications. Based on industry best practices used by top tech companies.',
    syllabus: ['Introduction to React & JSX', 'Components & Props', 'State & useEffect', 'React Router v6', 'Context API & Redux Toolkit', 'Testing with Jest', 'Deployment'],
    requirements: ['Basic JavaScript knowledge', 'HTML & CSS fundamentals'],
    imageSeed: 'react-course',
  },
  {
    title: 'Node.js API Development with Express & MongoDB',
    category: 'Web Development',
    level: 'Intermediate',
    tags: ['nodejs', 'express', 'mongodb', 'api'],
    isPaid: true,
    price: 399000,
    about: 'Build scalable REST APIs with Node.js, Express, MongoDB, JWT authentication, and clean architecture.',
    description: 'Learn to design and implement RESTful APIs following clean architecture principles. Covers authentication, validation, error handling, file uploads, caching with Redis, and deployment strategies.',
    syllabus: ['Node.js fundamentals', 'Express.js setup', 'MongoDB & Mongoose', 'JWT Authentication', 'Middleware patterns', 'File upload & AWS S3', 'Testing & Deployment'],
    requirements: ['JavaScript ES6+', 'Basic HTTP knowledge'],
    imageSeed: 'nodejs-course',
  },
  {
    title: 'Python for Data Science & Machine Learning',
    category: 'Data Science',
    level: 'Beginner',
    tags: ['python', 'data-science', 'pandas', 'ml'],
    isPaid: false,
    price: 0,
    about: 'Start your data science journey with Python, Pandas, NumPy, Matplotlib, and introductory ML concepts.',
    description: 'A beginner-friendly course covering Python programming for data analysis. Learn to manipulate datasets, create visualizations, and build your first machine learning models with scikit-learn.',
    syllabus: ['Python basics review', 'NumPy arrays', 'Pandas DataFrames', 'Data visualization', 'Intro to scikit-learn', 'First ML project'],
    requirements: ['No prior programming required'],
    imageSeed: 'python-datascience',
  },
  {
    title: 'UI/UX Design Fundamentals with Figma',
    category: 'Design',
    level: 'Beginner',
    tags: ['figma', 'ui', 'ux', 'design'],
    isPaid: true,
    price: 299000,
    about: 'Learn user-centered design principles and create stunning interfaces using Figma from scratch.',
    description: 'Covers design thinking, wireframing, prototyping, color theory, typography, and building a complete design system in Figma. Perfect for aspiring designers and developers.',
    syllabus: ['Design thinking process', 'Figma basics', 'Wireframes & prototypes', 'Color & typography', 'Design systems', 'Handoff to developers'],
    requirements: ['A computer with Figma installed (free)'],
    imageSeed: 'figma-design',
  },
  {
    title: 'Flutter & Dart - Build Native Mobile Apps',
    category: 'Mobile Development',
    level: 'Intermediate',
    tags: ['flutter', 'dart', 'mobile', 'ios', 'android'],
    isPaid: true,
    price: 449000,
    about: 'Create beautiful cross-platform mobile apps for iOS and Android with a single codebase using Flutter.',
    description: 'Master Flutter widgets, state management with Provider/Riverpod, API integration, Firebase, and publish apps to App Store and Google Play.',
    syllabus: ['Dart language basics', 'Flutter widgets', 'Navigation & routing', 'State management', 'REST API integration', 'Firebase setup', 'App publishing'],
    requirements: ['Basic programming knowledge', 'Android Studio or VS Code'],
    imageSeed: 'flutter-mobile',
  },
];

const INSTRUCTORS = [
  {
    firstName: 'Nguyen',
    lastName: 'Van An',
    email: 'instructor1@tutortrek.com',
    mobile: '0901234567',
    qualification: 'MSc Computer Science - HCMUT',
    subjects: ['Web Development', 'JavaScript'],
    experience: '8 years',
    skills: 'React, Node.js, TypeScript, AWS',
    about: 'Senior full-stack developer with 8+ years experience building e-learning platforms and SaaS products.',
    avatarId: 'instructor-an',
  },
  {
    firstName: 'Tran',
    lastName: 'Thi Mai',
    email: 'instructor2@tutortrek.com',
    mobile: '0912345678',
    qualification: 'PhD Data Science - VNU-HCM',
    subjects: ['Data Science', 'Python'],
    experience: '6 years',
    skills: 'Python, Machine Learning, TensorFlow, Pandas',
    about: 'Data scientist and educator passionate about making AI accessible to everyone.',
    avatarId: 'instructor-mai',
  },
];

const STUDENTS = [
  { firstName: 'Le', lastName: 'Minh Khoa', email: 'student1@tutortrek.com', mobile: '0923456789', interests: ['Web Development', 'Data Science'] },
  { firstName: 'Pham', lastName: 'Hoang Nam', email: 'student2@tutortrek.com', mobile: '0934567890', interests: ['Design', 'Mobile Development'] },
  { firstName: 'Vo', lastName: 'Thi Lan', email: 'student3@tutortrek.com', mobile: '0945678901', interests: ['Web Development', 'Design'] },
];

const CATEGORIES = [
  { name: 'Web Development', description: 'Frontend and backend web technologies including React, Node.js, and modern frameworks.' },
  { name: 'Data Science', description: 'Python, machine learning, data analysis, and AI fundamentals.' },
  { name: 'Design', description: 'UI/UX design, Figma, graphic design, and visual communication.' },
  { name: 'Mobile Development', description: 'iOS, Android, Flutter, and React Native mobile app development.' },
];

// ─── Main seed ─────────────────────────────────────────────────────────────
async function seed() {
  if (!process.env.DATABASE) throw new Error('DATABASE not set in .env');
  if (!BUCKET || !process.env.AWS_ACCESS_KEY) throw new Error('AWS S3 not configured in .env');

  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  await mongoose.connect(process.env.DATABASE, { dbName: process.env.DB_NAME || 'TutorTrek' });
  console.log('✅ Connected to MongoDB');

  // Clear existing seed data
  const seedEmails = [
    'admin@tutortrek.com',
    ...INSTRUCTORS.map((i) => i.email),
    ...STUDENTS.map((s) => s.email),
  ];
  await Promise.all([
    Admin.deleteMany({ email: { $in: seedEmails } }),
    Instructor.deleteMany({ email: { $in: INSTRUCTORS.map((i) => i.email) } }),
    Student.deleteMany({ email: { $in: STUDENTS.map((s) => s.email) } }),
    Category.deleteMany({}),
  ]);
  const oldCourses = await Course.find(
    { title: { $in: COURSE_DATA.map((c) => c.title) } },
    '_id'
  );
  if (oldCourses.length) {
    const ids = oldCourses.map((c) => c._id);
    await Lesson.deleteMany({ courseId: { $in: ids } });
    await Quiz.deleteMany({ courseId: { $in: ids } });
    await Course.deleteMany({ _id: { $in: ids } });
  }
  console.log('🗑️  Cleared previous seed records');

  // Download sample intro video (public domain, w3schools)
  const videoPath = path.join(ASSETS_DIR, 'intro-sample.mp4');
  if (!fs.existsSync(videoPath)) {
    console.log('⬇️  Downloading sample video...');
    await downloadFile(
      'https://www.w3schools.com/html/mov_bbb.mp4',
      videoPath
    );
  }

  const videoS3 = await uploadFile(videoPath, randomKey('.mp4'), 'video/mp4');
  console.log('☁️  Uploaded intro video →', videoS3.key);

  // ── Admin ──
  const admin = await Admin.create({
    email: 'admin@tutortrek.com',
    password: await hashPassword('Admin@123456'),
  });
  console.log('👤 Admin: admin@tutortrek.com / Admin@123456');

  // ── Categories ──
  await Category.insertMany(CATEGORIES);
  console.log(`📂 ${CATEGORIES.length} categories created`);

  // ── Instructors (download avatars from picsum) ──
  const instructorDocs = [];
  for (const inst of INSTRUCTORS) {
    const avatarPath = path.join(ASSETS_DIR, `avatar-${inst.email}.jpg`);
    console.log(`⬇️  Downloading avatar for ${inst.firstName}...`);
    await downloadFile(`https://picsum.photos/seed/${inst.avatarId}/400/400`, avatarPath);
    const avatarS3 = await uploadFile(avatarPath, randomKey('.jpg'), 'image/jpeg');

    const certBuffer = makePdfBuffer(`${inst.firstName} Certificate`);
    const certS3 = await uploadBuffer(certBuffer, 'certificate.pdf', 'application/pdf');

    instructorDocs.push(await Instructor.create({
      ...inst,
      password: await hashPassword('Instructor@123'),
      profilePic: { name: 'avatar.jpg', key: avatarS3.key, url: avatarS3.url },
      certificates: [{ name: 'certificate.pdf', key: certS3.key, url: certS3.url }],
      isVerified: true,
    }));
  }
  console.log('👨‍🏫 Instructors: instructor1@tutortrek.com / Instructor@123');

  // ── Students ──
  const studentDocs = [];
  for (let i = 0; i < STUDENTS.length; i++) {
    const st = STUDENTS[i];
    const avatarPath = path.join(ASSETS_DIR, `student-${i}.jpg`);
    await downloadFile(`https://picsum.photos/seed/student-${i}/200/200`, avatarPath);
    const avatarS3 = await uploadFile(avatarPath, randomKey('.jpg'), 'image/jpeg');

    studentDocs.push(await Student.create({
      ...st,
      password: await hashPassword('Student@123'),
      profilePic: { name: 'avatar.jpg', key: avatarS3.key, url: avatarS3.url },
    }));
  }
  console.log('👨‍🎓 Students: student1@tutortrek.com / Student@123');

  // ── Courses + Lessons + Quizzes ──
  let courseCount = 0;
  for (let ci = 0; ci < COURSE_DATA.length; ci++) {
    const c = COURSE_DATA[ci];
    const instructor = instructorDocs[ci % instructorDocs.length];

    // Download course thumbnail from picsum (tech-themed photos)
    const thumbPath = path.join(ASSETS_DIR, `course-${ci}-thumb.jpg`);
    console.log(`⬇️  Downloading thumbnail: ${c.title}`);
    await downloadFile(`https://picsum.photos/seed/${c.imageSeed}/800/450`, thumbPath);
    const thumbS3 = await uploadFile(thumbPath, randomKey('.jpg'), 'image/jpeg');

    const guidelinesBuffer = makePdfBuffer(`${c.title} - Guidelines`);
    const guidelinesS3 = await uploadBuffer(guidelinesBuffer, 'guidelines.pdf', 'application/pdf');

    const course = await Course.create({
      title: c.title,
      instructorId: instructor._id,
      duration: 360 + ci * 60,
      category: c.category,
      level: c.level,
      tags: c.tags,
      isPaid: c.isPaid,
      price: c.isPaid ? c.price : 0,
      about: c.about,
      description: c.description,
      syllabus: c.syllabus,
      requirements: c.requirements,
      thumbnail: { name: 'thumbnail.jpg', key: thumbS3.key, url: thumbS3.url },
      thumbnailUrl: thumbS3.url,
      guidelines: { name: 'guidelines.pdf', key: guidelinesS3.key, url: guidelinesS3.url },
      guidelinesUrl: guidelinesS3.url,
      introduction: { name: 'intro.mp4', key: videoS3.key, url: videoS3.url },
      coursesEnrolled: studentDocs.slice(0, 2 + (ci % 2)).map((s) => s._id),
      rating: 4.2 + (ci % 3) * 0.2,
      isVerified: true,
      completionStatus: 100,
    });

    await Instructor.updateOne(
      { _id: instructor._id },
      { $push: { coursesCreated: course._id } }
    );

    // 3 lessons per course
    const lessonTitles = c.syllabus.slice(0, 3);
    for (let li = 0; li < lessonTitles.length; li++) {
      const lesson = await Lesson.create({
        title: lessonTitles[li],
        description: `In this lesson you will learn about ${lessonTitles[li].toLowerCase()}.`,
        contents: [
          `Overview of ${lessonTitles[li]}`,
          'Key concepts and terminology',
          'Hands-on practice exercise',
          'Summary and next steps',
        ],
        duration: 25 + li * 10,
        instructorId: instructor._id,
        courseId: course._id,
        about: lessonTitles[li],
        media: [{ key: videoS3.key, name: 'lesson-video.mp4' }],
      });

      await Quiz.create({
        courseId: course._id,
        lessonId: lesson._id,
        questions: [
          {
            question: `What is the main topic of "${lessonTitles[li]}"?`,
            options: [
              { option: lessonTitles[li], isCorrect: true },
              { option: 'Unrelated topic A', isCorrect: false },
              { option: 'Unrelated topic B', isCorrect: false },
              { option: 'None of the above', isCorrect: false },
            ],
          },
          {
            question: 'Which skill will you practice in this lesson?',
            options: [
              { option: 'Theoretical concepts only', isCorrect: false },
              { option: 'Hands-on practical exercises', isCorrect: true },
              { option: 'Memorizing definitions', isCorrect: false },
              { option: 'Writing essays', isCorrect: false },
            ],
          },
        ],
      });
    }
    courseCount++;
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   📚 ${courseCount} courses (with lessons & quizzes)`);
  console.log(`   ☁️  Media uploaded to s3://${BUCKET}/${S3_PREFIX}/`);
  console.log('\n── Login credentials ──');
  console.log('   Admin:      admin@tutortrek.com      / Admin@123456');
  console.log('   Instructor: instructor1@tutortrek.com / Instructor@123');
  console.log('   Student:    student1@tutortrek.com    / Student@123');

  try {
    const redis = require('redis');
    const client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    await client.connect();
    await client.del('all-courses');
    await client.quit();
    console.log('   🔄 Cleared courses cache (all-courses)');
  } catch (_) {
    console.log('   ⚠️  Could not clear Redis cache');
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
