var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var userModel = require("../models/userModel");
var projectModel = require("../models/projectModel");
// Imports removed: fs, os, path, child_process (no longer needed for Piston API)


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const secret = process.env.JWT_SECRET || "secret"; // secret key for jwt

router.post("/signUp", async (req, res) => {
  let { username, name, email, password } = req.body;
  let emailCon = await userModel.findOne({ email: email });
  if (emailCon) {
    return res.json({ success: false, message: "Email already exists" });
  }
  else {

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        let user = userModel.create({
          username: username,
          name: name,
          email: email,
          password: hash
        });

        return res.json({ success: true, message: "User created successfully" });
      });
    });

  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });

  if (user) {
    // Rename the second `res` to avoid conflict
    bcrypt.compare(password, user.password, function (err, isMatch) {
      if (err) {
        return res.json({ success: false, message: "An error occurred", error: err });
      }
      if (isMatch) {
        let token = jwt.sign({ email: user.email, userId: user._id }, secret);
        return res.json({ success: true, message: "User logged in successfully", token: token, userId: user._id });
      } else {
        return res.json({ success: false, message: "Invalid email or password" });
      }
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getUserDetails", async (req, res) => {
  console.log("Called")
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    return res.json({ success: true, message: "User details fetched successfully", user: user });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/createProject", async (req, res) => {
  let { userId, title } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.create({
      title: title,
      createdBy: userId
    });


    return res.json({ success: true, message: "Project created successfully", projectId: project._id });
  }
  else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getProjects", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let projects = await projectModel.find({ createdBy: userId });
    return res.json({ success: true, message: "Projects fetched successfully", projects: projects });
  }
  else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/deleteProject", async (req, res) => {
  let { userId, progId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.findOneAndDelete({ _id: progId });
    return res.json({ success: true, message: "Project deleted successfully" });
  }
  else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getProject", async (req, res) => {
  let { userId, projId } = req.body;
  // support practice projects (frontend uses ids like 'practice-<problem-id>')
  if (projId && typeof projId === 'string' && projId.startsWith('practice-')) {
    const title = projId.replace('practice-', '').replace(/-/g, ' ');
    return res.json({ success: true, message: 'Practice project', project: { _id: projId, title: title, htmlCode: '', cssCode: '', jsCode: '' } });
  }
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.findOne({ _id: projId });
    return res.json({ success: true, message: "Project fetched successfully", project: project });
  }
  else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/updateProject", async (req, res) => {
  let { userId, projId, jsCode, pythonCode, phpCode, javaCode } = req.body;
  let user = await userModel.findOne({ _id: userId });

  if (user) {
    const update = {};
    if (jsCode !== undefined) update.jsCode = jsCode;
    if (pythonCode !== undefined) update.pythonCode = pythonCode;
    if (phpCode !== undefined) update.phpCode = phpCode;
    if (javaCode !== undefined) update.javaCode = javaCode;

    let project = await projectModel.findOneAndUpdate(
      { _id: projId },
      update,
      { new: true } // This option returns the updated document
    );

    if (project) {
      return res.json({ success: true, message: "Project updated successfully" });
    } else {
      return res.json({ success: false, message: "Project not found!" });
    }
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

const axios = require('axios');

// ─── Judge0 CE (free, no key needed) language ID map ─────────────────────────
// https://ce.judge0.com/languages/
const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_LANG_IDS = {
  python:     71,   // Python 3.8
  java:       62,   // Java (OpenJDK 13)
  cpp:        54,   // C++ (GCC 9.2)
  'c++':      54,
  c:          50,   // C (GCC 9.2)
  csharp:     51,   // C# (Mono 6.6)
  'c#':       51,
  go:         60,   // Go (1.13)
  rust:       73,   // Rust (1.40)
  php:        68,   // PHP (7.4)
  swift:      83,   // Swift (5.2)
  kotlin:     78,   // Kotlin (1.3)
  sql:        82,   // SQL (SQLite 3)
};

// ─── /run route ───────────────────────────────────────────────────────────────
router.post('/run', async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ success: false, message: 'Code and language are required' });
  }

  const langLower = language.toLowerCase();

  // JavaScript: run locally in Node so it is always instant and free
  if (['javascript', 'js'].includes(langLower)) {
    return executeJavaScript(code, res);
  }

  // All other languages → Judge0 CE (free public instance, no key)
  const languageId = JUDGE0_LANG_IDS[langLower];
  if (!languageId) {
    return res.status(400).json({ success: false, message: `Language '${language}' is not supported` });
  }

  try {
    // 1. Submit
    const submitRes = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      { language_id: languageId, source_code: code, stdin: '' },
      {
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          // Public free tier – no key required for the open instance below
        }
      }
    );

    const result = submitRes.data;
    const stdout = result.stdout || '';
    const stderr = result.stderr || result.compile_output || '';

    return res.json({ success: true, stdout, stderr, error: null });

  } catch (err) {
    console.error('Judge0 error:', err.message);

    // Fallback: try the free public Judge0 instance (no RapidAPI wrapper)
    try {
      const submitRes2 = await axios.post(
        'https://ce.judge0.com/submissions?base64_encoded=false&wait=true',
        { language_id: languageId, source_code: code, stdin: '' },
        { timeout: 20000, headers: { 'Content-Type': 'application/json' } }
      );

      const r = submitRes2.data;
      return res.json({
        success: true,
        stdout: r.stdout || '',
        stderr: r.stderr || r.compile_output || '',
        error: null
      });
    } catch (err2) {
      console.error('Judge0 fallback error:', err2.message);
      return res.json({
        success: false,
        stdout: '',
        stderr: '',
        error: 'Execution service is temporarily unavailable. Please try again in a moment.'
      });
    }
  }
});

// ─── JavaScript: run inside Node.js (no external call needed) ─────────────────
function executeJavaScript(code, res) {
  try {
    let output = '';
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const capture = (...args) => {
      output += args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n';
    };

    console.log = capture;
    console.error = capture;
    console.warn = capture;

    eval(code);  // eslint-disable-line no-eval

    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;

    return res.json({ success: true, stdout: output, stderr: '', error: null });
  } catch (error) {
    return res.json({ success: true, stdout: '', stderr: error.toString(), error: error.message });
  }
}


// ==================== Q&A ROUTES ====================

const questionModel = require("../models/questionModel");
const answerModel = require("../models/answerModel");
const commentModel = require("../models/commentModel");

// ========== QUESTION ROUTES ==========

// Create new question
router.post("/questions/create", async (req, res) => {
  try {
    let { userId, title, description, code, language, tags } = req.body;

    if (!title || !description) {
      return res.json({ success: false, message: "Title and description are required" });
    }

    let question = await questionModel.create({
      title,
      description,
      code: code || '',
      language: language || 'other',
      tags: tags || [],
      askedBy: userId
    });

    return res.json({ success: true, message: "Question created successfully", questionId: question._id });
  } catch (error) {
    console.error("Error creating question:", error);
    return res.json({ success: false, message: "Error creating question", error: error.message });
  }
});

// Get all questions with pagination and filters
router.post("/questions/list", async (req, res) => {
  try {
    let { page = 1, limit = 10, sortBy = 'newest', tag, language, search } = req.body;

    let query = {};

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Filter by language
    if (language && language !== 'all') {
      query.language = language;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'votes':
        sort = { votes: -1 };
        break;
      case 'unanswered':
        query.answerCount = 0;
        sort = { createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    let questions = await questionModel
      .find(query)
      .populate('askedBy', 'name username email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    let count = await questionModel.countDocuments(query);

    return res.json({
      success: true,
      questions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalQuestions: count
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.json({ success: false, message: "Error fetching questions", error: error.message });
  }
});

// Get single question with answers
router.post("/questions/get", async (req, res) => {
  try {
    let { questionId } = req.body;

    let question = await questionModel
      .findById(questionId)
      .populate('askedBy', 'name username email');

    if (!question) {
      return res.json({ success: false, message: "Question not found" });
    }

    // Get answers for this question
    let answers = await answerModel
      .find({ questionId })
      .populate('answeredBy', 'name username email')
      .sort({ isAccepted: -1, votes: -1, createdAt: -1 });

    return res.json({ success: true, question, answers });
  } catch (error) {
    console.error("Error fetching question:", error);
    return res.json({ success: false, message: "Error fetching question", error: error.message });
  }
});

// Update question
router.post("/questions/update", async (req, res) => {
  try {
    let { userId, questionId, title, description, code, language, tags } = req.body;

    let question = await questionModel.findById(questionId);

    if (!question) {
      return res.json({ success: false, message: "Question not found" });
    }

    // Check if user is the author
    if (question.askedBy.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized to update this question" });
    }

    question.title = title || question.title;
    question.description = description || question.description;
    question.code = code !== undefined ? code : question.code;
    question.language = language || question.language;
    question.tags = tags || question.tags;

    await question.save();

    return res.json({ success: true, message: "Question updated successfully" });
  } catch (error) {
    console.error("Error updating question:", error);
    return res.json({ success: false, message: "Error updating question", error: error.message });
  }
});

// Delete question
router.post("/questions/delete", async (req, res) => {
  try {
    let { userId, questionId } = req.body;

    let question = await questionModel.findById(questionId);

    if (!question) {
      return res.json({ success: false, message: "Question not found" });
    }

    // Check if user is the author
    if (question.askedBy.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized to delete this question" });
    }

    // Delete associated answers and comments
    await answerModel.deleteMany({ questionId });
    await commentModel.deleteMany({ parentId: questionId, parentType: 'Question' });

    await questionModel.findByIdAndDelete(questionId);

    return res.json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.json({ success: false, message: "Error deleting question", error: error.message });
  }
});

// Vote on question
router.post("/questions/vote", async (req, res) => {
  try {
    let { userId, questionId, voteType } = req.body; // voteType: 'upvote' or 'downvote'

    let question = await questionModel.findById(questionId);

    if (!question) {
      return res.json({ success: false, message: "Question not found" });
    }

    let hasUpvoted = question.upvotedBy.includes(userId);
    let hasDownvoted = question.downvotedBy.includes(userId);

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote
        question.upvotedBy = question.upvotedBy.filter(id => id.toString() !== userId);
        question.votes -= 1;
      } else {
        // Add upvote
        question.upvotedBy.push(userId);
        question.votes += 1;

        // Remove downvote if exists
        if (hasDownvoted) {
          question.downvotedBy = question.downvotedBy.filter(id => id.toString() !== userId);
          question.votes += 1;
        }
      }
    } else if (voteType === 'downvote') {
      if (hasDownvoted) {
        // Remove downvote
        question.downvotedBy = question.downvotedBy.filter(id => id.toString() !== userId);
        question.votes += 1;
      } else {
        // Add downvote
        question.downvotedBy.push(userId);
        question.votes -= 1;

        // Remove upvote if exists
        if (hasUpvoted) {
          question.upvotedBy = question.upvotedBy.filter(id => id.toString() !== userId);
          question.votes -= 1;
        }
      }
    }

    await question.save();

    return res.json({ success: true, votes: question.votes, hasUpvoted: question.upvotedBy.includes(userId), hasDownvoted: question.downvotedBy.includes(userId) });
  } catch (error) {
    console.error("Error voting on question:", error);
    return res.json({ success: false, message: "Error voting on question", error: error.message });
  }
});

// Increment view count
router.post("/questions/view", async (req, res) => {
  try {
    let { questionId, userId } = req.body;

    let question = await questionModel.findById(questionId);
    if (!question) {
      return res.json({ success: false, message: "Question not found" });
    }

    // Since we just added viewedBy to the schema, it might be undefined for old questions
    if (!question.viewedBy) {
      question.viewedBy = [];
    }

    // Logic:
    // 1. If user is logged in (userId provided), check if they have already viewed it.
    // 2. If already viewed, do nothing.
    // 3. If not viewed, add to viewedBy and increment views.
    // 4. If userId is not provided (guest), we might just increment views or ignore. 
    //    For now, let's only strictly track logged-in users to match the "one account" request.
    //    Or we can allow guest views to increment always (simple behavior), but logged-in users are unique.

    if (userId) {
      if (!question.viewedBy.includes(userId)) {
        question.viewedBy.push(userId);
      }
    }

    // Strict sync: views always equals valid unique viewers
    // Filter out any potential nulls if they exist, though schema should prevent it
    question.views = question.viewedBy.length;
    await question.save();

    return res.json({ success: true, views: question.views });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return res.json({ success: false, message: "Error incrementing view count" });
  }
});

// ========== ANSWER ROUTES ==========

// Create new answer
router.post("/answers/create", async (req, res) => {
  try {
    let { userId, questionId, content, code } = req.body;

    if (!content) {
      return res.json({ success: false, message: "Answer content is required" });
    }

    let answer = await answerModel.create({
      questionId,
      content,
      code: code || '',
      answeredBy: userId
    });

    // Increment answer count on question
    await questionModel.findByIdAndUpdate(questionId, { $inc: { answerCount: 1 } });

    return res.json({ success: true, message: "Answer created successfully", answerId: answer._id });
  } catch (error) {
    console.error("Error creating answer:", error);
    return res.json({ success: false, message: "Error creating answer", error: error.message });
  }
});

// Update answer
router.post("/answers/update", async (req, res) => {
  try {
    let { userId, answerId, content, code } = req.body;

    let answer = await answerModel.findById(answerId);

    if (!answer) {
      return res.json({ success: false, message: "Answer not found" });
    }

    // Check if user is the author
    if (answer.answeredBy.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized to update this answer" });
    }

    answer.content = content || answer.content;
    answer.code = code !== undefined ? code : answer.code;

    await answer.save();

    return res.json({ success: true, message: "Answer updated successfully" });
  } catch (error) {
    console.error("Error updating answer:", error);
    return res.json({ success: false, message: "Error updating answer", error: error.message });
  }
});

// Delete answer
router.post("/answers/delete", async (req, res) => {
  try {
    let { userId, answerId } = req.body;

    let answer = await answerModel.findById(answerId);

    if (!answer) {
      return res.json({ success: false, message: "Answer not found" });
    }

    // Check if user is the author
    if (answer.answeredBy.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized to delete this answer" });
    }

    // Delete associated comments
    await commentModel.deleteMany({ parentId: answerId, parentType: 'Answer' });

    // Decrement answer count on question
    await questionModel.findByIdAndUpdate(answer.questionId, { $inc: { answerCount: -1 } });

    // If this was the accepted answer, unmark it
    await questionModel.findOneAndUpdate(
      { acceptedAnswer: answerId },
      { acceptedAnswer: null, isResolved: false }
    );

    await answerModel.findByIdAndDelete(answerId);

    return res.json({ success: true, message: "Answer deleted successfully" });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return res.json({ success: false, message: "Error deleting answer", error: error.message });
  }
});

// Vote on answer
router.post("/answers/vote", async (req, res) => {
  try {
    let { userId, answerId, voteType } = req.body;

    let answer = await answerModel.findById(answerId);

    if (!answer) {
      return res.json({ success: false, message: "Answer not found" });
    }

    let hasUpvoted = answer.upvotedBy.includes(userId);
    let hasDownvoted = answer.downvotedBy.includes(userId);

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        answer.upvotedBy = answer.upvotedBy.filter(id => id.toString() !== userId);
        answer.votes -= 1;
      } else {
        answer.upvotedBy.push(userId);
        answer.votes += 1;

        if (hasDownvoted) {
          answer.downvotedBy = answer.downvotedBy.filter(id => id.toString() !== userId);
          answer.votes += 1;
        }
      }
    } else if (voteType === 'downvote') {
      if (hasDownvoted) {
        answer.downvotedBy = answer.downvotedBy.filter(id => id.toString() !== userId);
        answer.votes += 1;
      } else {
        answer.downvotedBy.push(userId);
        answer.votes -= 1;

        if (hasUpvoted) {
          answer.upvotedBy = answer.upvotedBy.filter(id => id.toString() !== userId);
          answer.votes -= 1;
        }
      }
    }

    await answer.save();

    return res.json({ success: true, votes: answer.votes, hasUpvoted: answer.upvotedBy.includes(userId), hasDownvoted: answer.downvotedBy.includes(userId) });
  } catch (error) {
    console.error("Error voting on answer:", error);
    return res.json({ success: false, message: "Error voting on answer", error: error.message });
  }
});

// Accept answer
router.post("/answers/accept", async (req, res) => {
  try {
    let { userId, answerId, questionId } = req.body;

    let question = await questionModel.findById(questionId);

    if (!question) {
      return res.json({ success: false, message: "Question not found" });
    }

    // Check if user is the question author
    if (question.askedBy.toString() !== userId) {
      return res.json({ success: false, message: "Only question author can accept answers" });
    }

    // Unmark previous accepted answer if exists
    if (question.acceptedAnswer) {
      await answerModel.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
    }

    // Mark new answer as accepted
    let answer = await answerModel.findByIdAndUpdate(answerId, { isAccepted: true }, { new: true });

    if (!answer) {
      return res.json({ success: false, message: "Answer not found" });
    }

    // Update question
    question.acceptedAnswer = answerId;
    question.isResolved = true;
    await question.save();

    return res.json({ success: true, message: "Answer accepted successfully" });
  } catch (error) {
    console.error("Error accepting answer:", error);
    return res.json({ success: false, message: "Error accepting answer", error: error.message });
  }
});

// ========== COMMENT ROUTES ==========

// Create new comment
router.post("/comments/create", async (req, res) => {
  try {
    let { userId, parentId, parentType, content } = req.body;

    if (!content) {
      return res.json({ success: false, message: "Comment content is required" });
    }

    let comment = await commentModel.create({
      parentId,
      parentType,
      content,
      commentedBy: userId
    });

    return res.json({ success: true, message: "Comment created successfully", commentId: comment._id });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.json({ success: false, message: "Error creating comment", error: error.message });
  }
});

// Get comments for a question or answer
router.post("/comments/get", async (req, res) => {
  try {
    let { parentId, parentType } = req.body;

    let comments = await commentModel
      .find({ parentId, parentType })
      .populate('commentedBy', 'name username email')
      .sort({ createdAt: 1 });

    return res.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.json({ success: false, message: "Error fetching comments", error: error.message });
  }
});

// Delete comment
router.post("/comments/delete", async (req, res) => {
  try {
    let { userId, commentId } = req.body;

    let comment = await commentModel.findById(commentId);

    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.commentedBy.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized to delete this comment" });
    }

    await commentModel.findByIdAndDelete(commentId);

    return res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.json({ success: false, message: "Error deleting comment", error: error.message });
  }
});


module.exports = router;

