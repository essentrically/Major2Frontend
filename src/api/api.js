import axios from "axios";

const TIMEOUT = 10000;

const HEADERS = {
  "Content-Type": "application/json",
};

// Plag Checker Service
const PLAG_CHECKER_SERVICE_BASE_URL = "http://localhost:8080";
const plagCheckerAPI = axios.create({
  baseURL: PLAG_CHECKER_SERVICE_BASE_URL,
  timeout: TIMEOUT,
  headers: HEADERS,
});

export const checkPlagiarism = async (
  code1,
  language1,
  code2,
  language2,
  threshold = 0.8,
  need_explanation = true
) => {
  const payload = {
    code1: code1,
    language1: language1,
    code2: code2,
    language2: language2,
    threshold: threshold,
    need_explanation: need_explanation,
  };

  const endpoint = "/check";

  try {
    const resp = await plagCheckerAPI.post(endpoint, payload);
    const output = resp.data;

    if (output.is_error) {
      // IsSuccess, IsPlagiarism, Similarity, Message
      return [
        false,
        false,
        0.0,
        output?.error_message || "Plagiarism check failed",
      ];
    }

    const verdict = output?.verdict;

    // IsSuccess, IsPlagiarism, Similarity, Message
    return [
      true,
      verdict?.Plagiarism,
      verdict?.Similarity,
      verdict?.Explanation,
    ];
  } catch (error) {
    console.error("Plagiarism check error:", error.message);

    // IsSuccess, IsPlagiarism, Similarity, Message
    return [
      false,
      false,
      0.0,
      "Server error. Please try again later or contact support.",
    ];
  }
};

// Code Execution Service
const CODE_EXECUTION_SERVICE_BASE_URL = "http://localhost:8081";
const codeExecutionAPI = axios.create({
  baseURL: CODE_EXECUTION_SERVICE_BASE_URL,
  timeout: TIMEOUT,
  headers: HEADERS,
});

export const executeCode = async (
  code,
  language,
  input_for_code,
  time_limit = 2 // default 2s if not provided
) => {
  if (!code || !language) {
    return [false, "Code and language are required"];
  }

  const payload = {
    code,
    language,
    input: input_for_code || "",
    time_limit,
  };

  const endpoint = "/execute";

  try {
    const resp = await codeExecutionAPI.post(endpoint, payload);
    const output = resp.data;
    console.log("Code execution response:", output);

    if (output.is_error) {
      return [false, output.resp?.error || "Execution failed"];
    }

    let outputText = output.resp?.output ?? "";

    if (outputText.endsWith("\n")) {
      outputText = outputText.slice(0, -1);
    }

    // Normalize and clean
    outputText = outputText.trim();

    if (!outputText) {
      return [false, "Output is empty"];
    }

    return [true, outputText];
  } catch (error) {
    console.error("Code execution error:", error.message);
    return [false, "Server error. Please try again later or contact support."];
  }
};

// Mail OTP Service
const MAIL_OTP_SERVICE_BASE_URL = "http://localhost:8082";

const mailAPI = axios.create({
  baseURL: MAIL_OTP_SERVICE_BASE_URL,
  timeout: TIMEOUT,
  headers: HEADERS,
});

export const sendMailOTP = async (email) => {
  console.log("Sending OTP to email:", email);
  const payload = {
    to: email,
    from: "essenbeats@gmail.com",
    password: "kkzm qigj ivve eope",
  };

  try {
    const resp = await mailAPI.post("/send/otp/mail", payload);
    if (resp.status !== 200) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send OTP:", error.message);
    return false;
  }
};

export const validateOtp = async (email, otp) => {
  console.log("Validating OTP for email:", email);
  const payload = {
    email: email,
    otp: otp,
  };

  try {
    const resp = await mailAPI.post("/verify/otp", payload);
    console.log("OTP validation response:", resp.data);
    return resp.data.valid;
  } catch (error) {
    console.error("Failed to validate OTP:", error.message);
    return false;
  }
};

// User Service
const USER_SERVICE_BASE_URL = "http://localhost:8083";

const userAPI = axios.create({
  baseURL: USER_SERVICE_BASE_URL,
  timeout: TIMEOUT,
  headers: HEADERS,
});

export const getUserByEmail = async (email) => {
  try {
    const resp = await userAPI.get("/user", { params: { email } });
    return resp.data;
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return null;
  }
};

export const createUser = async (
  email,
  user_name,
  dob,
  phone_number,
  user_photo,
  college,
  college_id,
  college_start_year,
  college_end_year,
  course
) => {
  const payload = {
    email: email,
    user_name: user_name,
    dob: dob,
    phone_number: phone_number,
    user_photo: user_photo,
    college: college,
    college_id: college_id,
    college_start_year: college_start_year,
    college_end_year: college_end_year,
    course: course,
  };

  try {
    const resp = await userAPI.post("/user", payload);
    console.log("User created successfully:", resp.data);
    return !resp.data.is_error;
  } catch (err) {
    console.error("Error creating user:", err.message);
    return false;
  }
};

// Contest Question Submission Service
const CONTEST_QUESTION_SUBMISSION_SERVICE_BASE_URL = "http://localhost:8085";
const contestQuestionSubmissionAPI = axios.create({
  baseURL: CONTEST_QUESTION_SUBMISSION_SERVICE_BASE_URL,
  timeout: TIMEOUT,
  headers: HEADERS,
});

export const submitCode = async (
  questionId,
  userEmail,
  contestId,
  code,
  language,
  isAccepted,
  isPlagChecked,
  isPlag,
  plagDetails,
) => {
  const payload = {
    questionId: questionId,
    userEmail: userEmail,
    contestId: contestId,
    code: code,
    language: language,
    isAccepted: isAccepted,
    isPlagChecked: isPlagChecked,
    isPlag: isPlag,
    plagiarismDetails: plagDetails,
  };

  const endpoint = "/submission";

  try {
    const resp = await contestQuestionSubmissionAPI.post(endpoint, payload);
    console.log("Code submitted successfully:", resp.data);
    return resp.data;
  }
  catch (err) {
    console.error("Error submitting code:", err.message);
    return null;
  }
};

export const upadtePlagiarismDetails = async (submissionId, details) => {
  const payload = {
    submissionId: submissionId,
    plagiarismStatus: details,
  };

  const endpoint = "/submissions/plag";

  try {
    const resp = await contestQuestionSubmissionAPI.put(endpoint, payload);
    console.log("Plagiarism details updated successfully:", resp.data);
    return resp.data;
  } catch (err) {
    console.error("Error updating plagiarism details:", err.message);
    return null;
  }
};

export const updateSubmissionStatus = async (submissionId, status) => {
  const payload = {
    submissionId: submissionId,
    submissionStatus: status,
  };

  const endpoint = "/submissions/status";

  try {
    const resp = await contestQuestionSubmissionAPI.put(endpoint, payload);
    console.log("Submission status updated successfully:", resp.data);
    return resp.data;
  } catch (err) {
    console.error("Error updating submission status:", err.message);
    return null;
  }
};

export const getAllSubmissionsForContestAndQuestion = async (
  contestId,
  questionId
) => {
  const qParams = {
    contestId: contestId,
    questionId: questionId,
  };

  const endpoint = "/submissions";

  try {
    const resp = await contestQuestionSubmissionAPI.get(endpoint, {
      params: qParams,
    });
    const submissionDetails = resp.data;
    console.log("Submission Details:", submissionDetails);
    if (
      !(submissionDetails instanceof Object) ||
      Object.keys(submissionDetails).length === 0
    ) {
      console.log("No submissions found for the contest and question.");
      return null;
    }
    return submissionDetails;
  } catch (err) {
    console.error("Error fetching submission details:", err.message);
    return null;
  }
};

export const getContestDetailsById = async (contestId) => {
  const qParams = {
    id: contestId,
  };

  const endpoint = "/contest";

  try {
    const resp = await contestQuestionSubmissionAPI.get(endpoint, {
      params: qParams,
    });
    const contestDetails = resp.data;
    console.log("Contest Details:", contestDetails);
    return contestDetails;
  } catch (err) {
    console.error("Error fetching contest details:", err.message);
    return null;
  }
};

export const getContestForUserByEmail = async (email) => {
  const queryParams = {
    email: email,
  };

  const endpoint = "/contests/user";

  try {
    const resp = await contestQuestionSubmissionAPI.get(endpoint, {
      params: queryParams,
    });
    const listsOfContests = resp.data;
    console.log("Contest List:", listsOfContests);
    if (!Array.isArray(listsOfContests) || listsOfContests.length === 0) {
      console.log("No contests found for the user.");
      return null;
    }
    return listsOfContests;
  } catch (err) {
    console.error("Error fetching contests for user:", err.message);
    return null;
  }
};

export const getQuestionsForContest = async (contestId) => {
  const queryParams = {
    contestId: contestId,
  };

  const endpoint = "/questions/contest";

  try {
    const resp = await contestQuestionSubmissionAPI.get(endpoint, {
      params: queryParams,
    });
    const listsOfQuestions = resp.data;
    console.log("Questions List:", listsOfQuestions);
    if (!Array.isArray(listsOfQuestions) || listsOfQuestions.length === 0) {
      console.log("No questions found for the contest.");
      return null;
    }
    return listsOfQuestions;
  } catch (err) {
    console.error("Error fetching questions for contest:", err.message);
    return null;
  }
};
