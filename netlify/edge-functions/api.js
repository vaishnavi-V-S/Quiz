import { getStore } from "@netlify/blobs";
import bank from "../../data/questions.json" with { type: "json" };

const store = getStore("kle-bca-quiz-results");
const encoder = new TextEncoder();
const QUIZ_SIZE = 40;
const SESSION_SECONDS = 8 * 60 * 60;
const CLASSES = new Set(["BCA 1st Year", "BCA 2nd Year", "BCA 3rd Year"]);

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extraHeaders },
  });
}
function clean(value, max = 160) { return String(value ?? "").trim().slice(0, max); }
function cookieValue(request, name) {
  const cookies = request.headers.get("cookie") || "";
  const entry = cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : "";
}
function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
async function hash(value) {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function isAdmin(request) {
  const token = cookieValue(request, "kleBcaAdmin");
  if (!token) return false;
  const session = await store.get(`session:${await hash(token)}`, { type: "json" });
  return Boolean(session && session.expiresAt > Date.now());
}
function registrationKey(registrationNumber) {
  return `student:${encodeURIComponent(registrationNumber.trim().toLowerCase())}`;
}
function resultKey(attemptId) { return `result:${encodeURIComponent(attemptId)}`; }

async function login(request) {
  const body = await request.json();
  const expectedUser = Netlify.env.get("ADMIN_USERNAME") || "admin";
  const expectedPassword = Netlify.env.get("ADMIN_PASSWORD") || "admin123";
  const username = clean(body.username, 80);
  const password = String(body.password || "");
  if (!constantTimeEqual(username, expectedUser) || !constantTimeEqual(password, expectedPassword)) {
    return json({ error: "Username or password is incorrect." }, 401);
  }
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  await store.set(`session:${await hash(token)}`, JSON.stringify({ expiresAt: Date.now() + SESSION_SECONDS * 1000 }));
  return json({ ok: true }, 200, { "set-cookie": `kleBcaAdmin=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_SECONDS}` });
}

async function saveResult(request) {
  const body = await request.json();
  const student = body.student || {};
  const registrationNumber = clean(student.registrationNumber, 60);
  const name = clean(student.name, 120);
  const semester = clean(student.semester, 30);
  const className = clean(student.className, 40);
  const attemptId = clean(body.attemptId, 120);
  const questionIds = Array.isArray(body.questionIds) ? body.questionIds : [];
  if (!registrationNumber || !name || !semester || !CLASSES.has(className) || !attemptId) return json({ error: "Student or attempt details are incomplete." }, 400);
  if (questionIds.length !== QUIZ_SIZE || new Set(questionIds).size !== QUIZ_SIZE) return json({ error: "A valid attempt must contain 40 unique questions." }, 400);

  const questionMap = new Map((bank.questions || []).map((question) => [question.id, question]));
  const counts = { correctCount: 0, wrongCount: 0, unansweredCount: 0 };
  const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
  for (const id of questionIds) {
    const question = questionMap.get(id);
    if (!question || !question.verified || question.enabled === false || !question.options?.some((option) => option.id === question.correctOptionId)) {
      return json({ error: "This attempt includes a question that is not currently eligible." }, 400);
    }
    const answer = answers[id] || null;
    if (!answer) counts.unansweredCount++;
    else if (!question.options.some((option) => option.id === answer)) return json({ error: "An answer does not match the selected question." }, 400);
    else if (answer === question.correctOptionId) counts.correctCount++;
    else counts.wrongCount++;
  }

  const key = resultKey(attemptId);
  const savedAttempt = await store.get(key, { type: "json" });
  const studentKey = registrationKey(registrationNumber);
  const priorStudent = await store.get(studentKey, { type: "json" });
  if (priorStudent?.attemptId && priorStudent.attemptId !== attemptId) return json({ error: "This registration number already has a completed attempt." }, 409);

  const startTime = Number(body.startTime) || Date.now();
  const submittedAt = Date.now();
  const endTime = Math.min(Number(body.endTime) || submittedAt, submittedAt, startTime + 60 * 60 * 1000);
  const score = counts.correctCount;
  const result = {
    attemptId, student: { registrationNumber, name, semester, className },
    questionIds, optionOrder: body.optionOrder || {}, answers,
    ...counts, score, totalMarks: QUIZ_SIZE, percentage: score / QUIZ_SIZE * 100,
    startTime, endTime, timeTakenMs: Math.max(0, endTime - startTime),
    quizDate: new Date(endTime).toLocaleDateString("en-CA"),
    quizTime: new Date(endTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    status: "Completed", submitted: true, syncStatus: "synced",
  };
  if (!savedAttempt) await store.set(key, JSON.stringify(result));
  else Object.assign(result, savedAttempt, { syncStatus: "synced" });
  const studentRecord = { ...result.student, registrationTimestamp: startTime, registrationDate: result.quizDate, registrationTime: result.quizTime, status: "Completed", attemptId };
  await store.set(studentKey, JSON.stringify(studentRecord));
  return json({ result, student: studentRecord });
}

async function listResults(request) {
  if (!await isAdmin(request)) return json({ error: "Please sign in again to view shared results." }, 401);
  const [resultKeys, studentKeys] = await Promise.all([store.list({ prefix: "result:" }), store.list({ prefix: "student:" })]);
  const [results, students] = await Promise.all([
    Promise.all(resultKeys.blobs.map((blob) => store.get(blob.key, { type: "json" }))),
    Promise.all(studentKeys.blobs.map((blob) => store.get(blob.key, { type: "json" }))),
  ]);
  results.sort((a, b) => (b?.endTime || 0) - (a?.endTime || 0));
  return json({ results: results.filter(Boolean), students: students.filter(Boolean) });
}

async function resetResult(request) {
  if (!await isAdmin(request)) return json({ error: "Please sign in again to manage results." }, 401);
  const body = await request.json();
  const attemptId = clean(body.attemptId, 120);
  const result = await store.get(resultKey(attemptId), { type: "json" });
  if (!result) return json({ error: "Attempt not found." }, 404);
  await Promise.all([store.delete(resultKey(attemptId)), store.delete(registrationKey(result.student.registrationNumber))]);
  return json({ ok: true });
}

export default async function handler(request) {
  const path = new URL(request.url).pathname;
  try {
    if (path === "/api/admin/login" && request.method === "POST") return await login(request);
    if (path === "/api/admin/logout" && request.method === "POST") {
      const token = cookieValue(request, "kleBcaAdmin");
      if (token) await store.delete(`session:${await hash(token)}`);
      return json({ ok: true }, 200, { "set-cookie": "kleBcaAdmin=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0" });
    }
    if (path === "/api/results" && request.method === "GET") return await listResults(request);
    if (path === "/api/results" && request.method === "POST") return await saveResult(request);
    if (path === "/api/results" && request.method === "DELETE") return await resetResult(request);
    if (path === "/api/health" && request.method === "GET") return json({ ok: true });
    return json({ error: "API route not found." }, 404);
  } catch (error) {
    console.error("Quiz API error", error);
    return json({ error: "The shared quiz service is temporarily unavailable. Please retry." }, 500);
  }
}

