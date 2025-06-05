// App.js
import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from "https://cdn.skypack.dev/react";
import { HashRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from "https://cdn.skypack.dev/react-router-dom";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, setDoc, getDoc } from "https://cdn.skypack.dev/firebase/firestore";
import { initializeApp } from "https://cdn.skypack.dev/firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "https://cdn.skypack.dev/firebase/auth";
import { getAnalytics } from "https://cdn.skypack.dev/firebase/analytics";
var firebaseConfig = {
  apiKey: "AIzaSyCcreV3lHrj5YVGDuvGi4F8lFAF8Q3ZEDc",
  // THIS IS THE CORRECT API KEY
  authDomain: "website-77fc4.firebaseapp.com",
  projectId: "website-77fc4",
  storageBucket: "website-77fc4.appspot.com",
  messagingSenderId: "398319176717",
  appId: "1:398319176717:web:b4038c7ae1115a8c97d944",
  measurementId: "G-B7TT199XKE"
};
var app = initializeApp(firebaseConfig);
var auth = getAuth(app);
var analytics = getAnalytics(app);
var AuthContext = createContext();
function useAuth() {
  return useContext(AuthContext);
}
function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logout() {
    return signOut(auth);
  }
  useEffect(() => {
    console.log("AuthProvider: Initializing Firebase with config:", firebaseConfig);
    const signInUser = async () => {
      try {
        await signInAnonymously(auth);
        console.log("AuthProvider: Signed in anonymously.");
      } catch (error) {
        console.error("AuthProvider: Error during initial sign-in:", error);
        if (error.code === "auth/operation-not-allowed") {
          console.error("Firebase Auth Error: 'auth/operation-not-allowed'. Please ensure Anonymous sign-in method is enabled in your Firebase project settings under 'Authentication' -> 'Sign-in method'.");
        }
      }
    };
    signInUser();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        console.log("AuthContext: User authenticated:", user.uid);
      } else {
        console.log("AuthContext: No user authenticated.");
      }
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    signup,
    login,
    logout,
    auth,
    app
  };
  return /* @__PURE__ */ React.createElement(AuthContext.Provider, { value }, !loading && children);
}
function Login({ currentLang }) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  const applyLanguageToElements2 = (lang) => {
    document.querySelectorAll("[data-en], [data-no]").forEach((el) => {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
      } else {
        el.textContent = el.getAttribute(`data-${lang}`);
      }
    });
  };
  useEffect(() => {
    applyLanguageToElements2(currentLang);
  }, [currentLang]);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
    } catch (err) {
      console.error("Failed to log in:", err);
      if (err.code === "auth/operation-not-allowed") {
        setError(currentLang === "en" ? "Login failed: Email/Password authentication is not enabled. Please enable it in your Firebase project settings." : "Innlogging mislyktes: E-post/passord-autentisering er ikke aktivert. Vennligst aktiver dette i Firebase-prosjektinnstillingene dine.");
      } else {
        setError(currentLang === "en" ? "Failed to log in: " + err.message : "Feil ved innlogging: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    // Removed animateIn state and conditional classes. The form is now always visible and at full scale.
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center min-h-screen p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md bg-white rounded-xl shadow-lg p-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold text-center mb-6 text-gray-800", "data-en": "Log In", "data-no": "Logg inn" }, "Log In"), error && /* @__PURE__ */ React.createElement("p", { className: "text-red-500 text-center mb-4" }, error), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "email", className: "sr-only", "data-en": "Email", "data-no": "E-post" }, "Email"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        id: "email",
        ref: emailRef,
        required: true,
        className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500",
        placeholder: currentLang === "en" ? "Email" : "E-post",
        "data-en-placeholder": "Email",
        "data-no-placeholder": "E-post"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "password", className: "sr-only", "data-en": "Password", "data-no": "Passord" }, "Password"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        id: "password",
        ref: passwordRef,
        required: true,
        className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500",
        placeholder: currentLang === "en" ? "Password" : "Passord",
        "data-en-placeholder": "Password",
        "data-no-placeholder": "Passord"
      }
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        disabled: loading,
        type: "submit",
        className: "w-full p-3 bg-gray-800 text-white rounded-md font-bold transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg"
      },
      loading ? currentLang === "en" ? "Logging In..." : "Logger inn..." : currentLang === "en" ? "Log In" : "Logg inn"
    )), /* @__PURE__ */ React.createElement("div", { className: "text-center mt-4 text-gray-700" }, /* @__PURE__ */ React.createElement("span", { "data-en": "Need an account?", "data-no": "Trenger du en konto?" }, "Need an account?"), " ", /* @__PURE__ */ React.createElement(Link, { to: "/signup", className: "text-blue-600 hover:underline", "data-en": "Sign Up", "data-no": "Registrer deg" }, "Sign Up"))))
  );
}
function Signup({ currentLang }) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  const applyLanguageToElements2 = (lang) => {
    document.querySelectorAll("[data-en], [data-no]").forEach((el) => {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
      } else {
        el.textContent = el.getAttribute(`data-${lang}`);
      }
    });
  };
  useEffect(() => {
    applyLanguageToElements2(currentLang);
  }, [currentLang]);
  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError(currentLang === "en" ? "Passwords do not match" : "Passordene stemmer ikke overens");
    }
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch (err) {
      console.error("Failed to create an account:", err);
      if (err.code === "auth/operation-not-allowed") {
        setError(currentLang === "en" ? "Account creation failed: Email/Password authentication is not enabled. Please enable it in your Firebase project settings." : "Kontoopprettelse mislyktes: E-post/passord-autentisering er ikke aktivert. Vennligst aktiver dette i Firebase-prosjektinnstillingene dine.");
      } else {
        setError(currentLang === "en" ? "Failed to create an account: " + err.message : "Feil ved opprettelse av konto: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center min-h-screen p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md bg-white rounded-xl shadow-lg p-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold text-center mb-6 text-gray-800", "data-en": "Sign Up", "data-no": "Registrer deg" }, "Sign Up"), error && /* @__PURE__ */ React.createElement("p", { className: "text-red-500 text-center mb-4" }, error), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "email", className: "sr-only", "data-en": "Email", "data-no": "E-post" }, "Email"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      id: "email",
      ref: emailRef,
      required: true,
      className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500",
      placeholder: currentLang === "en" ? "Email" : "E-post",
      "data-en-placeholder": "Email",
      "data-no-placeholder": "E-post"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "password", className: "sr-only", "data-en": "Password", "data-no": "Passord" }, "Password"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      id: "password",
      ref: passwordRef,
      required: true,
      className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500",
      placeholder: currentLang === "en" ? "Password" : "Passord",
      "data-en-placeholder": "Password",
      "data-no-placeholder": "Passord"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "password-confirm", className: "sr-only", "data-en": "Confirm Password", "data-no": "Bekreft Passord" }, "Confirm Password"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      id: "password-confirm",
      ref: passwordConfirmRef,
      required: true,
      className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500",
      placeholder: currentLang === "en" ? "Confirm Password" : "Bekreft Passord",
      "data-en-placeholder": "Confirm Password",
      "data-no-placeholder": "Bekreft Passord"
    }
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      disabled: loading,
      type: "submit",
      className: "w-full p-3 bg-gray-800 text-white rounded-md font-bold transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg"
    },
    loading ? currentLang === "en" ? "Signing Up..." : "Registrerer..." : currentLang === "en" ? "Sign Up" : "Registrer deg"
  )), /* @__PURE__ */ React.createElement("div", { className: "text-center mt-4 text-gray-700" }, /* @__PURE__ */ React.createElement("span", { "data-en": "Need an account?", "data-no": "Trenger du en konto?" }, "Need an account?"), " ", /* @__PURE__ */ React.createElement(Link, { to: "/signup", className: "text-blue-600 hover:underline", "data-en": "Sign Up", "data-no": "Registrer deg" }, "Sign Up"))));
}
var applyLanguageToElements = (currentLang) => {
  document.querySelectorAll("[data-en], [data-no]").forEach((el) => {
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`);
    } else {
      el.textContent = el.getAttribute(`data-${currentLang}`);
    }
  });
};
var HomePage = ({ onCategoryClick, currentLang }) => {
  const [formStatus, setFormStatus] = useState("");
  useEffect(() => {
    applyLanguageToElements(currentLang);
  }, [currentLang]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus(currentLang === "en" ? "Sending..." : "Sender...");
    const form = event.target;
    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          "Accept": "application/json"
        }
      });
      if (response.ok) {
        setFormStatus(currentLang === "en" ? "Message sent successfully!" : "Melding sendt!");
        form.reset();
        if (typeof grecaptcha !== "undefined" && grecaptcha.getResponse) {
          grecaptcha.reset();
        }
      } else {
        const responseData = await response.json();
        if (responseData.errors) {
          const errorMessages = responseData.errors.map((error) => error.message).join(", ");
          setFormStatus(currentLang === "en" ? `Error: ${errorMessages}` : `Feil: ${errorMessages}`);
        } else {
          setFormStatus(currentLang === "en" ? "Oops! There was an error sending your message." : "Oops! Det oppstod en feil ved sending av meldingen din.");
        }
        if (typeof grecaptcha !== "undefined" && grecaptcha.getResponse) {
          grecaptcha.reset();
        }
      }
    } catch (error) {
      setFormStatus(currentLang === "en" ? "Oops! There was a network error." : "Oops! Det oppstod en nettverksfeil.");
      if (typeof grecaptcha !== "undefined" && grecaptcha.getResponse) {
        grecaptcha.reset();
      }
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", { className: "text-black text-4xl md:text-5xl lg:text-6xl mb-1 mt-0 animate-fade-in opacity-0", "data-en": "Kianosh F. Solheim", "data-no": "Kianosh F. Solheim" }, "Kianosh F. Solheim"), /* @__PURE__ */ React.createElement("p", { className: "text-black text-lg md:text-xl lg:text-2xl mt-0 animate-fade-in opacity-0", style: { animationDelay: "0.2s" }, "data-en": "Comparative politics student", "data-no": "Sammenlignende politikk student" }, "Comparative politics student"), /* @__PURE__ */ React.createElement("div", { className: "social-icons flex justify-center gap-4 mb-4 mt-10 animate-fade-in" }, /* @__PURE__ */ React.createElement("a", { href: "https://www.facebook.com/solheim.online/", title: "Facebook", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-facebook" })), /* @__PURE__ */ React.createElement("a", { href: "https://www.instagram.com/solheim.online", title: "Instagram", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-instagram" })), /* @__PURE__ */ React.createElement("a", { href: "https://www.linkedin.com/in/kianosh-solheim", title: "LinkedIn", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-linkedin" })), /* @__PURE__ */ React.createElement("a", { href: "https://bsky.app/profile/solheim.online", title: "Bluesky", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-bluesky" })), /* @__PURE__ */ React.createElement("a", { href: "https://www.threads.net/@solheim.online", title: "Threads", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-threads" })), /* @__PURE__ */ React.createElement("a", { href: "https://x.com/Kianosh_Solheim", title: "Twitter", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-twitter" }))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-4 mt-6" }, /* @__PURE__ */ React.createElement(Link, { to: "/cv", className: "inline-block px-5 py-3 bg-gray-800 text-white no-underline rounded-lg font-normal transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg animate-fade-in opacity-0", style: { animationDelay: "0.4s" }, "data-en": "Curriculum Vitae", "data-no": "Curriculum Vitae" }, "Curriculum Vitae"), /* @__PURE__ */ React.createElement(Link, { to: "/recommendations", className: "inline-block px-5 py-3 bg-gray-800 text-white no-underline rounded-lg font-normal transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg animate-fade-in opacity-0", style: { animationDelay: "0.5s" }, "data-en": "Recommendations", "data-no": "Anbefalinger" }, "Recommendations")), /* @__PURE__ */ React.createElement("section", { id: "contact", className: "w-full max-w-lg mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg animate-fade-in opacity-0", style: { animationDelay: "0.6s" } }, /* @__PURE__ */ React.createElement("h2", { className: "text-black text-3xl md:text-4xl lg:text-5xl mb-8 text-center", "data-en": "Contact Me", "data-no": "Kontakt Meg" }, "Contact Me"), /* @__PURE__ */ React.createElement(
    "form",
    {
      action: "https://formspree.io/f/meogbldy",
      method: "POST",
      onSubmit: handleSubmit,
      className: "flex flex-col gap-4",
      "data-recaptcha": "true"
    },
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "name", className: "sr-only", "data-en": "Name", "data-no": "Navn" }, "Name"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        name: "name",
        id: "name",
        placeholder: currentLang === "en" ? "Your Name" : "Ditt Navn",
        required: true,
        className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500",
        "data-en-placeholder": "Your Name",
        "data-no-placeholder": "Ditt Navn"
      }
    )),
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "email", className: "sr-only", "data-en": "Email", "data-no": "E-post" }, "Email"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        name: "email",
        id: "email",
        placeholder: currentLang === "en" ? "Your Email" : "Din E-post",
        required: true,
        className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500",
        "data-en-placeholder": "Your Email",
        "data-no-placeholder": "Din E-post"
      }
    )),
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "message", className: "sr-only", "data-en": "Message", "data-no": "Melding" }, "Message"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        name: "message",
        id: "message",
        rows: "5",
        placeholder: currentLang === "en" ? "Your Message" : "Din Melding",
        required: true,
        className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-y",
        "data-en-placeholder": "Your Message",
        "data-no-placeholder": "Din Melding"
      }
    )),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "g-recaptcha",
        "data-sitekey": "YOUR_RECAPTCHA_SITE_KEY"
      }
    ),
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "submit",
        className: "w-full p-3 bg-gray-800 text-white rounded-md font-bold transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg",
        "data-en": "Send Message",
        "data-no": "Send Melding"
      },
      "Send Message"
    )
  ), formStatus && /* @__PURE__ */ React.createElement("p", { className: `form-response text-center mt-4 ${formStatus.includes("Error") || formStatus.includes("Feil") ? "text-red-500" : "text-green-500"}` }, formStatus)));
};
var MoviesPage = ({ onBackClick, onItemClick, currentLang, movies, user, db }) => {
  useEffect(() => {
    applyLanguageToElements(currentLang);
  }, [currentLang]);
  const [newMovieTitleEn, setNewMovieTitleEn] = useState("");
  const [newMovieTitleNo, setNewMovieTitleNo] = useState("");
  const [newMovieImageEn, setNewMovieImageEn] = useState("");
  const [newMovieImageNo, setNewMovieImageNo] = useState("");
  const [newMovieDescriptionEn, setNewMovieDescriptionEn] = useState("");
  const [newMovieDescriptionNo, setNewMovieDescriptionNo] = useState("");
  const [editingMovie, setEditingMovie] = useState(null);
  const [editMovieTitleEn, setEditMovieTitleEn] = useState("");
  const [editMovieTitleNo, setEditMovieTitleNo] = useState("");
  const [editMovieImageEn, setEditMovieImageEn] = useState("");
  const [editMovieImageNo, setEditMovieImageNo] = useState("");
  const [editMovieDescriptionEn, setEditMovieDescriptionEn] = useState("");
  const [editMovieDescriptionNo, setEditMovieDescriptionNo] = useState("");
  const ADMIN_USER_ID = "HCp5TlIvIxZlKvpeNwO1PWBtLfu2";
  const isAdmin = user && user.uid === ADMIN_USER_ID;
  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      console.error("User not authorized to add movie.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot add movie.");
      return;
    }
    try {
      await addDoc(collection(db, `movies`), {
        title_en: newMovieTitleEn,
        title_no: newMovieTitleNo,
        image_en: newMovieImageEn,
        image_no: newMovieImageNo,
        description_en: newMovieDescriptionEn,
        description_no: newMovieDescriptionNo,
        createdAt: /* @__PURE__ */ new Date(),
        createdBy: user.uid
      });
      setNewMovieTitleEn("");
      setNewMovieTitleNo("");
      setNewMovieImageEn("");
      setNewMovieImageNo("");
      setNewMovieDescriptionEn("");
      setNewMovieDescriptionNo("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const handleDeleteMovie = async (movieId) => {
    if (!isAdmin) {
      console.error("User not authorized to delete movie.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot delete movie.");
      return;
    }
    try {
      await deleteDoc(doc(db, `movies`, movieId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const handleEditClick = (movie) => {
    if (!isAdmin) {
      console.error("User not authorized to edit movie.");
      return;
    }
    setEditingMovie(movie);
    setEditMovieTitleEn(movie.title_en || "");
    setEditMovieTitleNo(movie.title_no || "");
    setEditMovieImageEn(movie.image_en || "");
    setEditMovieImageNo(movie.image_no || "");
    setEditMovieDescriptionEn(movie.description_en || "");
    setEditMovieDescriptionNo(movie.description_no || "");
  };
  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    if (!isAdmin || !editingMovie) {
      console.error("User not authorized or no movie selected for editing.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot update movie.");
      return;
    }
    try {
      await updateDoc(doc(db, `movies`, editingMovie.id), {
        title_en: editMovieTitleEn,
        title_no: editMovieTitleNo,
        image_en: editMovieImageEn,
        image_no: editMovieImageNo,
        description_en: editMovieDescriptionEn,
        description_no: editMovieDescriptionNo,
        updatedAt: /* @__PURE__ */ new Date()
      });
      setEditingMovie(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center w-full" }, /* @__PURE__ */ React.createElement("h2", { className: "text-black text-3xl md:text-4xl lg:text-5xl mb-8", "data-en": "Movies", "data-no": "Filmer" }, "Movies"), /* @__PURE__ */ React.createElement("p", { className: "text-black text-lg md:text-xl lg:text-2xl mb-8", "data-en": "Discover our top movie recommendations!", "data-no": "Oppdag v\xE5re beste filmanbefalinger!" }, "Discover our top movie recommendations!"), isAdmin && /* @__PURE__ */ React.createElement("section", { className: "w-full max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold mb-4", "data-en": "Add New Movie", "data-no": "Legg til ny film" }, "Add New Movie"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleAddMovie, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (English)" : "Tittel (Engelsk)", value: newMovieTitleEn, onChange: (e) => setNewMovieTitleEn(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (Norwegian)" : "Tittel (Norsk)", value: newMovieTitleNo, onChange: (e) => setNewMovieTitleNo(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (English)" : "Bilde-URL (Engelsk)", value: newMovieImageEn, onChange: (e) => setNewMovieImageEn(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (Norwegian)" : "Bilde-URL (Norsk)", value: newMovieImageNo, onChange: (e) => setNewMovieImageNo(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (English)" : "Beskrivelse (Engelsk)", value: newMovieDescriptionEn, onChange: (e) => setNewMovieDescriptionEn(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (Norwegian)" : "Beskrivelse (Norsk)", value: newMovieDescriptionNo, onChange: (e) => setNewMovieDescriptionNo(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600" }, currentLang === "en" ? "Add Movie" : "Legg til film"))), editingMovie && isAdmin && /* @__PURE__ */ React.createElement("section", { className: "w-full max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold mb-4", "data-en": "Edit Movie", "data-no": "Rediger film" }, "Edit Movie"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleUpdateMovie, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (English)" : "Tittel (Engelsk)", value: editMovieTitleEn, onChange: (e) => setEditMovieTitleEn(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (Norwegian)" : "Tittel (Norsk)", value: editMovieTitleNo, onChange: (e) => setEditMovieTitleNo(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (English)" : "Bilde-URL (Engelsk)", value: editMovieImageEn, onChange: (e) => setEditMovieImageEn(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (Norwegian)" : "Bilde-URL (Norsk)", value: newMovieImageNo, onChange: (e) => setNewMovieImageNo(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (English)" : "Beskrivelse (Engelsk)", value: editMovieDescriptionEn, onChange: (e) => setNewMovieDescriptionEn(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (Norwegian)" : "Beskrivelse (Norsk)", value: newMovieDescriptionNo, onChange: (e) => setNewMovieDescriptionNo(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600" }, currentLang === "en" ? "Update Movie" : "Oppdater film"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setEditingMovie(null), className: "flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600" }, currentLang === "en" ? "Cancel" : "Avbryt")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4" }, movies.map((movie) => /* @__PURE__ */ React.createElement("div", { key: movie.id, className: "bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer", onClick: () => onItemClick(movie, "movies") }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full pb-[150%]" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: currentLang === "en" ? movie.image_en : movie.image_no || movie.image_en,
      alt: movie[`title_${currentLang}`],
      className: "absolute top-0 left-0 w-full h-full object-cover rounded-md",
      onError: (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/300x450/eeeeee/333333?text=No+Image`;
      }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold mb-2 text-black", "data-en": movie.title_en, "data-no": movie.title_no }, movie[`title_${currentLang}`]), isAdmin && /* @__PURE__ */ React.createElement("div", { className: "flex justify-between mt-3 gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    handleEditClick(movie);
  }, className: "flex-1 bg-yellow-500 text-white p-2 rounded text-sm hover:bg-yellow-600" }, currentLang === "en" ? "Edit" : "Rediger"), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    handleDeleteMovie(movie.id);
  }, className: "flex-1 bg-red-500 text-white p-2 rounded text-sm hover:bg-red-600" }, currentLang === "en" ? "Delete" : "Slett")))))), /* @__PURE__ */ React.createElement("button", { onClick: onBackClick, className: "inline-block px-5 py-3 bg-gray-800 text-white no-underline rounded-lg font-normal transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg mt-12", "data-en": "Back to Recommendations", "data-no": "Tilbake til anbefalinger" }, "Back to Recommendations"));
};
var AppsPage = ({ onBackClick, onItemClick, currentLang, apps, user, db }) => {
  useEffect(() => {
    applyLanguageToElements(currentLang);
  }, [currentLang]);
  const [newAppTitleEn, setNewAppTitleEn] = useState("");
  const [newAppTitleNo, setNewAppTitleNo] = useState("");
  const [newAppImageEn, setNewAppImageEn] = useState("");
  const [newAppImageNo, setNewAppImageNo] = useState("");
  const [newAppDescriptionEn, setNewAppDescriptionEn] = useState("");
  const [newAppDescriptionNo, setNewAppDescriptionNo] = useState("");
  const [editingApp, setEditingApp] = useState(null);
  const [editAppTitleEn, setEditAppTitleEn] = useState("");
  const [editAppTitleNo, setEditAppTitleNo] = useState("");
  const [editAppImageEn, setEditAppImageEn] = useState("");
  const [editAppImageNo, setEditAppImageNo] = useState("");
  const [editAppDescriptionEn, setEditAppDescriptionEn] = useState("");
  const [editAppDescriptionNo, setEditAppDescriptionNo] = useState("");
  const ADMIN_USER_ID = "HCp5TlIvIxZlKvpeNwO1PWBtLfu2";
  const isAdmin = user && user.uid === ADMIN_USER_ID;
  const handleAddApp = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      console.error("User not authorized to add app.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot add app.");
      return;
    }
    try {
      await addDoc(collection(db, `apps`), {
        title_en: newAppTitleEn,
        title_no: newAppTitleNo,
        image_en: newAppImageEn,
        image_no: newAppImageNo,
        description_en: newAppDescriptionEn,
        description_no: newAppDescriptionNo,
        createdAt: /* @__PURE__ */ new Date(),
        createdBy: user.uid
      });
      setNewAppTitleEn("");
      setNewAppTitleNo("");
      setNewAppImageEn("");
      setNewAppImageNo("");
      setNewAppDescriptionEn("");
      setNewAppDescriptionNo("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const handleDeleteApp = async (appId) => {
    if (!isAdmin) {
      console.error("User not authorized to delete app.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot delete app.");
      return;
    }
    try {
      await deleteDoc(doc(db, `apps`, appId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const handleEditClick = (app2) => {
    if (!isAdmin) {
      console.error("User not authorized to edit app.");
      return;
    }
    setEditingApp(app2);
    setEditAppTitleEn(app2.title_en || "");
    setEditAppTitleNo(app2.title_no || "");
    setEditAppImageEn(app2.image_en || "");
    setEditAppImageNo(app2.image_no || "");
    setEditAppDescriptionEn(app2.description_en || "");
    setEditAppDescriptionNo(app2.description_no || "");
  };
  const handleUpdateApp = async (e) => {
    e.preventDefault();
    if (!isAdmin || !editingApp) {
      console.error("User not authorized or no app selected for editing.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot update app.");
      return;
    }
    try {
      await updateDoc(doc(db, `apps`, editingApp.id), {
        title_en: editAppTitleEn,
        title_no: editAppTitleNo,
        image_en: editAppImageEn,
        image_no: editAppImageNo,
        description_en: editAppDescriptionEn,
        description_no: editAppDescriptionNo,
        updatedAt: /* @__PURE__ */ new Date()
      });
      setEditingApp(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center w-full" }, /* @__PURE__ */ React.createElement("h2", { className: "text-black text-3xl md:text-4xl lg:text-5xl mb-8", "data-en": "Apps", "data-no": "Apper" }, "Apps"), /* @__PURE__ */ React.createElement("p", { className: "text-black text-lg md:text-xl lg:text-2xl mb-8", "data-en": "Explore a curated list of useful applications.", "data-no": "Utforsk en kuratert liste over nyttige applikasjoner." }, "Explore a curated list of useful applications."), isAdmin && /* @__PURE__ */ React.createElement("section", { className: "w-full max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold mb-4", "data-en": "Add New App", "data-no": "Legg til ny app" }, "Add New App"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleAddApp, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (English)" : "Tittel (Engelsk)", value: newAppTitleEn, onChange: (e) => setNewAppTitleEn(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (Norwegian)" : "Tittel (Norsk)", value: newAppTitleNo, onChange: (e) => setNewAppTitleNo(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (English)" : "Bilde-URL (Engelsk)", value: newAppImageEn, onChange: (e) => setNewAppImageEn(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (Norwegian)" : "Bilde-URL (Norsk)", value: newAppImageNo, onChange: (e) => setNewAppImageNo(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (English)" : "Beskrivelse (Engelsk)", value: newAppDescriptionEn, onChange: (e) => setNewAppDescriptionEn(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (Norwegian)" : "Beskrivelse (Norsk)", value: newAppDescriptionNo, onChange: (e) => setNewAppDescriptionNo(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600" }, currentLang === "en" ? "Add App" : "Legg til app"))), editingApp && isAdmin && /* @__PURE__ */ React.createElement("section", { className: "w-full max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold mb-4", "data-en": "Edit App", "data-no": "Rediger app" }, "Edit App"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleUpdateApp, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (English)" : "Tittel (Engelsk)", value: editAppTitleEn, onChange: (e) => setEditAppTitleEn(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (Norwegian)" : "Tittel (Norsk)", value: editAppTitleNo, onChange: (e) => setEditAppTitleNo(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (English)" : "Bilde-URL (Engelsk)", value: editAppImageEn, onChange: (e) => setEditAppImageEn(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (Norwegian)" : "Bilde-URL (Norsk)", value: newAppImageNo, onChange: (e) => setNewAppImageNo(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (English)" : "Beskrivelse (Engelsk)", value: editAppDescriptionEn, onChange: (e) => setNewAppDescriptionEn(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (Norwegian)" : "Beskrivelse (Norsk)", value: newAppDescriptionNo, onChange: (e) => setNewAppDescriptionNo(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600" }, currentLang === "en" ? "Update App" : "Oppdater app"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setEditingApp(null), className: "flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600" }, currentLang === "en" ? "Cancel" : "Avbryt")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4" }, apps.map((app2) => /* @__PURE__ */ React.createElement("div", { key: app2.id, className: "bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer", onClick: () => onItemClick(app2, "apps") }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full pb-[100%]" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: currentLang === "en" ? app2.image_en : app2.image_no || app2.image_en,
      alt: app2[`title_${currentLang}`],
      className: "absolute top-0 left-0 w-full h-full object-cover rounded-md",
      onError: (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/300x300/eeeeee/333333?text=No+Image`;
      }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold mb-2 text-black", "data-en": app2.title_en, "data-no": app2.title_no }, app2[`title_${currentLang}`]), isAdmin && /* @__PURE__ */ React.createElement("div", { className: "flex justify-between mt-3 gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    handleEditClick(app2);
  }, className: "flex-1 bg-yellow-500 text-white p-2 rounded text-sm hover:bg-yellow-600" }, currentLang === "en" ? "Edit" : "Rediger"), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    handleDeleteApp(app2.id);
  }, className: "flex-1 bg-red-500 text-white p-2 rounded text-sm hover:bg-red-600" }, currentLang === "en" ? "Delete" : "Slett")))))), /* @__PURE__ */ React.createElement("button", { onClick: onBackClick, className: "inline-block px-5 py-3 bg-gray-800 text-white no-underline rounded-lg font-normal transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg mt-12", "data-en": "Back to Recommendations", "data-no": "Tilbake til anbefalinger" }, "Back to Recommendations"));
};
var BooksPage = ({ onBackClick, onItemClick, currentLang, books, user, db }) => {
  useEffect(() => {
    applyLanguageToElements(currentLang);
  }, [currentLang]);
  const [newBookTitleEn, setNewBookTitleEn] = useState("");
  const [newBookTitleNo, setNewBookTitleNo] = useState("");
  const [newBookAuthorFirst, setNewBookAuthorFirst] = useState("");
  const [newBookAuthorMiddle, setNewBookAuthorMiddle] = useState("");
  const [newBookAuthorLast, setNewBookAuthorLast] = useState("");
  const [newBookImageEn, setNewBookImageEn] = useState("");
  const [newBookImageNo, setNewBookImageNo] = useState("");
  const [newBookDescriptionEn, setNewBookDescriptionEn] = useState("");
  const [newBookDescriptionNo, setNewBookDescriptionNo] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [editBookTitleEn, setEditBookTitleEn] = useState("");
  const [editBookTitleNo, setEditBookTitleNo] = useState("");
  const [editBookAuthorFirst, setEditBookAuthorFirst] = useState("");
  const [editBookAuthorMiddle, setEditBookAuthorMiddle] = useState("");
  const [editBookAuthorLast, setEditBookAuthorLast] = useState("");
  const [editBookImageEn, setEditBookImageEn] = useState("");
  const [editBookImageNo, setEditBookImageNo] = useState("");
  const [editBookDescriptionEn, setEditBookDescriptionEn] = useState("");
  const [editBookDescriptionNo, setEditBookDescriptionNo] = useState("");
  const ADMIN_USER_ID = "HCp5TlIvIxZlKvpeNwO1PWBtLfu2";
  const isAdmin = user && user.uid === ADMIN_USER_ID;
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      console.error("User not authorized to add book.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot add book.");
      return;
    }
    try {
      await addDoc(collection(db, `books`), {
        title_en: newBookTitleEn,
        title_no: newBookTitleNo,
        author: {
          first: newBookAuthorFirst,
          middle: newBookAuthorMiddle,
          last: newBookAuthorLast
        },
        image_en: newBookImageEn,
        image_no: newBookImageNo,
        description_en: newBookDescriptionEn,
        description_no: newBookDescriptionNo,
        createdAt: /* @__PURE__ */ new Date(),
        createdBy: user.uid
      });
      setNewBookTitleEn("");
      setNewBookTitleNo("");
      setNewBookAuthorFirst("");
      setNewBookAuthorMiddle("");
      setNewBookAuthorLast("");
      setNewBookImageEn("");
      setNewBookImageNo("");
      setNewBookDescriptionEn("");
      setNewBookDescriptionNo("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const handleDeleteBook = async (bookId) => {
    if (!isAdmin) {
      console.error("User not authorized to delete book.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot delete book.");
      return;
    }
    try {
      await deleteDoc(doc(db, `books`, bookId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const handleEditClick = (book) => {
    if (!isAdmin) {
      console.error("User not authorized to edit book.");
      return;
    }
    setEditingBook(book);
    setEditBookTitleEn(book.title_en || "");
    setEditBookTitleNo(book.title_no || "");
    setEditBookAuthorFirst(book.author?.first || "");
    setEditBookAuthorMiddle(book.author?.middle || "");
    setEditBookAuthorLast(book.author?.last || "");
    setEditBookImageEn(book.image_en || "");
    setEditBookImageNo(book.image_no || "");
    setEditBookDescriptionEn(book.description_en || "");
    setEditBookDescriptionNo(book.description_no || "");
  };
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!isAdmin || !editingBook) {
      console.error("User not authorized or no book selected for editing.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot update book.");
      return;
    }
    try {
      await updateDoc(doc(db, `books`, editingBook.id), {
        title_en: editBookTitleEn,
        title_no: editBookTitleNo,
        author: {
          first: editBookAuthorFirst,
          middle: editBookAuthorMiddle,
          last: editBookAuthorLast
        },
        image_en: editBookImageEn,
        image_no: editBookImageNo,
        description_en: editBookDescriptionEn,
        description_no: editBookDescriptionNo,
        updatedAt: /* @__PURE__ */ new Date()
      });
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  const formatAuthorName = (author) => {
    if (!author) return "";
    let name = author.first || "";
    if (author.middle) name += ` ${author.middle}`;
    if (author.last) name += ` ${author.last}`;
    return name;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center w-full" }, /* @__PURE__ */ React.createElement("h2", { className: "text-black text-3xl md:text-4xl lg:text-5xl mb-8", "data-en": "Books", "data-no": "B\xF8ker" }, "Books"), /* @__PURE__ */ React.createElement("p", { className: "text-black text-lg md:text-xl lg:text-2xl mb-8", "data-en": "Dive into our favorite books and literary works, including those by Christopher Hitchens.", "data-no": "Dykk ned i v\xE5re favorittb\xF8ker og litter\xE6re verk, inkludert de av Christopher Hitchens." }, "Dive into our favorite books and literary works."), isAdmin && /* @__PURE__ */ React.createElement("section", { className: "w-full max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold mb-4", "data-en": "Add New Book", "data-no": "Legg til ny bok" }, "Add New Book"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleAddBook, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Title (English)" : "Tittel (Engelsk)",
      value: newBookTitleEn,
      onChange: (e) => setNewBookTitleEn(e.target.value),
      className: "p-2 border rounded",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Title (Norwegian)" : "Tittel (Norsk)",
      value: newBookTitleNo,
      onChange: (e) => setNewBookTitleNo(e.target.value),
      className: "p-2 border rounded",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Author First Name" : "Forfatter Fornavn",
      value: newBookAuthorFirst,
      onChange: (e) => setNewBookAuthorFirst(e.target.value),
      className: "p-2 border rounded",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Author Middle Name (Optional)" : "Forfatter Mellomnavn (Valgfritt)",
      value: newBookAuthorMiddle,
      onChange: (e) => setNewBookAuthorMiddle(e.target.value),
      className: "p-2 border rounded"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Author Last Name" : "Forfatter Etternavn",
      value: newBookAuthorLast,
      onChange: (e) => setNewBookAuthorLast(e.target.value),
      className: "p-2 border rounded",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Image URL (English)" : "Bilde-URL (Engelsk)",
      value: newBookImageEn,
      onChange: (e) => setNewBookImageEn(e.target.value),
      className: "p-2 border rounded"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Image URL (Norwegian)" : "Bilde-URL (Norsk)",
      value: newBookImageNo,
      onChange: (e) => setNewBookImageNo(e.target.value),
      className: "p-2 border rounded"
    }
  ), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      placeholder: currentLang === "en" ? "Description (English)" : "Beskrivelse (Engelsk)",
      value: newBookDescriptionEn,
      onChange: (e) => setNewBookDescriptionEn(e.target.value),
      className: "p-2 border rounded",
      rows: "3",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      placeholder: currentLang === "en" ? "Description (Norwegian)" : "Beskrivelse (Norsk)",
      value: newBookDescriptionNo,
      onChange: (e) => setNewBookDescriptionNo(e.target.value),
      className: "p-2 border rounded",
      rows: "3",
      required: true
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600" }, currentLang === "en" ? "Add Book" : "Legg til bok"))), editingBook && isAdmin && /* @__PURE__ */ React.createElement("section", { className: "w-full max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold mb-4", "data-en": "Edit Book", "data-no": "Rediger bok" }, "Edit Book"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleUpdateBook, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Title (English)" : "Tittel (Engelsk)",
      value: editBookTitleEn,
      onChange: (e) => setEditBookTitleEn(e.target.value),
      className: "p-2 border rounded",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Title (Norwegian)" : "Tittel (Norsk)",
      value: editBookTitleNo,
      onChange: (e) => setEditBookTitleNo(e.target.value),
      className: "p-2 border rounded",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Author First Name" : "Forfatter Fornavn",
      value: editBookAuthorFirst,
      onChange: (e) => setEditBookAuthorFirst(e.target.value),
      className: "p-2 border rounded",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Author Middle Name (Optional)" : "Forfatter Mellomnavn (Valgfritt)",
      value: editBookAuthorMiddle,
      onChange: (e) => setNewBookAuthorMiddle(e.target.value),
      className: "p-2 border rounded"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Author Last Name" : "Forfatter Etternavn",
      value: newBookAuthorLast,
      onChange: (e) => setNewBookAuthorLast(e.target.value),
      className: "p-2 border rounded",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Image URL (English)" : "Bilde-URL (Engelsk)",
      value: editBookImageEn,
      onChange: (e) => setEditBookImageEn(e.target.value),
      className: "p-2 border rounded"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: currentLang === "en" ? "Image URL (Norwegian)" : "Bilde-URL (Norsk)",
      value: newBookImageNo,
      onChange: (e) => setNewBookImageNo(e.target.value),
      className: "p-2 border rounded"
    }
  ), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      placeholder: currentLang === "en" ? "Description (English)" : "Beskrivelse (Engelsk)",
      value: editBookDescriptionEn,
      onChange: (e) => setNewBookDescriptionEn(e.target.value),
      className: "p-2 border rounded",
      rows: "3",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      placeholder: currentLang === "en" ? "Description (Norwegian)" : "Beskrivelse (Norsk)",
      value: newBookDescriptionNo,
      onChange: (e) => setNewBookDescriptionNo(e.target.value),
      className: "p-2 border rounded",
      rows: "3",
      required: true
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600" }, currentLang === "en" ? "Update Book" : "Oppdater bok"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setEditingBook(null), className: "flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600" }, currentLang === "en" ? "Cancel" : "Avbryt")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4 mt-8" }, books.map((book) => /* @__PURE__ */ React.createElement("div", { key: book.id, className: "bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer", onClick: () => onItemClick(book, "books") }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full pb-[150%]" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: currentLang === "en" ? book.image_en : book.image_no || book.image_en,
      alt: book[`title_${currentLang}`],
      className: "absolute top-0 left-0 w-full h-full object-cover rounded-md",
      onError: (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/300x450/eeeeee/333333?text=No+Image`;
      }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold mb-2 text-black", "data-en": book.title_en, "data-no": book.title_no }, book[`title_${currentLang}`]), book.author && /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm mb-2", "data-en": `By: ${formatAuthorName(book.author)}`, "data-no": `Av: ${formatAuthorName(book.author)}` }, currentLang === "en" ? "By:" : "Av:", " ", formatAuthorName(book.author)), isAdmin && /* @__PURE__ */ React.createElement("div", { className: "flex justify-between mt-3 gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: (e) => {
        e.stopPropagation();
        handleEditClick(book);
      },
      className: "flex-1 bg-yellow-500 text-white p-2 rounded text-sm hover:bg-yellow-600"
    },
    currentLang === "en" ? "Edit" : "Rediger"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: (e) => {
        e.stopPropagation();
        handleDeleteBook(book.id);
      },
      className: "flex-1 bg-red-500 text-white p-2 rounded text-sm hover:bg-red-600"
    },
    currentLang === "en" ? "Delete" : "Slett"
  )))))), /* @__PURE__ */ React.createElement("button", { onClick: onBackClick, className: "inline-block px-5 py-3 bg-gray-800 text-white no-underline rounded-lg font-normal transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg mt-12", "data-en": "Back to Recommendations", "data-no": "Tilbake til anbefalinger" }, "Back to Recommendations"));
};
var PodcastsPage = ({ onBackClick, onItemClick, currentLang, podcasts, user, db }) => {
  useEffect(() => {
    applyLanguageToElements(currentLang);
  }, [currentLang]);
  const [newPodcastTitleEn, setNewPodcastTitleEn] = useState("");
  const [newPodcastTitleNo, setNewPodcastTitleNo] = useState("");
  const [newPodcastImageEn, setNewPodcastImageEn] = useState("");
  const [newPodcastImageNo, setNewPodcastImageNo] = useState("");
  const [newPodcastDescriptionEn, setNewPodcastDescriptionEn] = useState("");
  const [newPodcastDescriptionNo, setNewPodcastDescriptionNo] = useState("");
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [editPodcastTitleEn, setEditPodcastTitleEn] = useState("");
  const [editPodcastTitleNo, setEditPodcastTitleNo] = useState("");
  const [editPodcastImageEn, setEditPodcastImageEn] = useState("");
  const [editPodcastImageNo, setEditPodcastImageNo] = useState("");
  const [editPodcastDescriptionEn, setEditPodcastDescriptionEn] = useState("");
  const [editPodcastDescriptionNo, setEditPodcastDescriptionNo] = useState("");
  const ADMIN_USER_ID = "HCp5TlIvIxZlKvpeNwO1PWBtLfu2";
  const isAdmin = user && user.uid === ADMIN_USER_ID;
  const handleAddPodcast = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      console.error("User not authorized to add podcast.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot add podcast.");
      return;
    }
    try {
      await addDoc(collection(db, `podcasts`), {
        title_en: newPodcastTitleEn,
        title_no: newPodcastTitleNo,
        image_en: newPodcastImageEn,
        image_no: newPodcastImageNo,
        description_en: newPodcastDescriptionEn,
        description_no: newPodcastDescriptionNo,
        createdAt: /* @__PURE__ */ new Date(),
        createdBy: user.uid
      });
      setNewPodcastTitleEn("");
      setNewPodcastTitleNo("");
      setNewPodcastImageEn("");
      setNewPodcastImageNo("");
      setNewPodcastDescriptionEn("");
      setNewPodcastDescriptionNo("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const handleDeletePodcast = async (podcastId) => {
    if (!isAdmin) {
      console.error("User not authorized to delete podcast.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot delete podcast.");
      return;
    }
    try {
      await deleteDoc(doc(db, `podcasts`, podcastId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const handleEditClick = (podcast) => {
    if (!isAdmin) {
      console.error("User not authorized to edit podcast.");
      return;
    }
    setEditingPodcast(podcast);
    setEditPodcastTitleEn(podcast.title_en || "");
    setEditPodcastTitleNo(podcast.title_no || "");
    setEditPodcastImageEn(podcast.image_en || "");
    setEditPodcastImageNo(podcast.image_no || "");
    setEditPodcastDescriptionEn(podcast.description_en || "");
    setEditPodcastDescriptionNo(podcast.description_no || "");
  };
  const handleUpdatePodcast = async (e) => {
    e.preventDefault();
    if (!isAdmin || !editingPodcast) {
      console.error("User not authorized or no podcast selected for editing.");
      return;
    }
    if (!db) {
      console.error("Firestore DB not initialized. Cannot update podcast.");
      return;
    }
    try {
      await updateDoc(doc(db, `podcasts`, editingPodcast.id), {
        title_en: editPodcastTitleEn,
        title_no: editPodcastTitleNo,
        image_en: editPodcastImageEn,
        image_no: editPodcastImageNo,
        description_en: editPodcastDescriptionEn,
        description_no: editPodcastDescriptionNo,
        updatedAt: /* @__PURE__ */ new Date()
      });
      setEditingPodcast(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center w-full" }, /* @__PURE__ */ React.createElement("h2", { className: "text-black text-3xl md:text-4xl lg:text-5xl mb-8", "data-en": "Podcasts", "data-no": "Podkaster" }, "Podcasts"), /* @__PURE__ */ React.createElement("p", { className: "text-black text-lg md:text-xl lg:text-2xl mb-8", "data-en": "Listen to our recommended podcasts for all interests.", "data-no": "Lytt til v\xE5re anbefalte podkaster for alle interesser." }, "Listen to our recommended podcasts for all interests."), isAdmin && /* @__PURE__ */ React.createElement("section", { className: "w-full max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold mb-4", "data-en": "Add New Podcast", "data-no": "Legg til ny podkast" }, "Add New Podcast"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleAddPodcast, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (English)" : "Tittel (Engelsk)", value: newPodcastTitleEn, onChange: (e) => setNewPodcastTitleEn(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (Norwegian)" : "Tittel (Norsk)", value: newPodcastTitleNo, onChange: (e) => setNewPodcastTitleNo(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (English)" : "Bilde-URL (Engelsk)", value: newPodcastImageEn, onChange: (e) => setNewPodcastImageEn(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (Norwegian)" : "Bilde-URL (Norsk)", value: newPodcastImageNo, onChange: (e) => setNewPodcastImageNo(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (English)" : "Beskrivelse (Engelsk)", value: newPodcastDescriptionEn, onChange: (e) => setNewPodcastDescriptionEn(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (Norwegian)" : "Beskrivelse (Norsk)", value: newPodcastDescriptionNo, onChange: (e) => setNewPodcastDescriptionNo(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600" }, currentLang === "en" ? "Add Podcast" : "Legg til podkast"))), editingPodcast && isAdmin && /* @__PURE__ */ React.createElement("section", { className: "w-full max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold mb-4", "data-en": "Edit Podcast", "data-no": "Rediger podkast" }, "Edit Podcast"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleUpdatePodcast, className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (English)" : "Tittel (Engelsk)", value: editPodcastTitleEn, onChange: (e) => setEditPodcastTitleEn(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Title (Norwegian)" : "Tittel (Norsk)", value: editPodcastTitleNo, onChange: (e) => setEditPodcastTitleNo(e.target.value), className: "p-2 border rounded", required: true }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (English)" : "Bilde-URL (Engelsk)", value: editPodcastImageEn, onChange: (e) => setEditPodcastImageEn(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: currentLang === "en" ? "Image URL (Norwegian)" : "Bilde-URL (Norsk)", value: newPodcastImageNo, onChange: (e) => setNewPodcastImageNo(e.target.value), className: "p-2 border rounded" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (English)" : "Beskrivelse (Engelsk)", value: editPodcastDescriptionEn, onChange: (e) => setNewPodcastDescriptionEn(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("textarea", { placeholder: currentLang === "en" ? "Description (Norwegian)" : "Beskrivelse (Norsk)", value: newPodcastDescriptionNo, onChange: (e) => setNewPodcastDescriptionNo(e.target.value), className: "p-2 border rounded", rows: "3", required: true }), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600" }, currentLang === "en" ? "Update Podcast" : "Oppdater podkast"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setEditingPodcast(null), className: "flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600" }, currentLang === "en" ? "Cancel" : "Avbryt")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4" }, podcasts.map((podcast) => /* @__PURE__ */ React.createElement("div", { key: podcast.id, className: "bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer", onClick: () => onItemClick(podcast, "podcasts") }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full pb-[100%]" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: currentLang === "en" ? podcast.image_en : podcast.image_no || podcast.image_en,
      alt: podcast[`title_${currentLang}`],
      className: "absolute top-0 left-0 w-full h-full object-cover rounded-md",
      onError: (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/300x300/eeeeee/333333?text=No+Image`;
      }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold mb-2 text-black", "data-en": podcast.title_en, "data-no": podcast.title_no }, podcast[`title_${currentLang}`]), isAdmin && /* @__PURE__ */ React.createElement("div", { className: "flex justify-between mt-3 gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    handleEditClick(podcast);
  }, className: "flex-1 bg-yellow-500 text-white p-2 rounded text-sm hover:bg-yellow-600" }, currentLang === "en" ? "Edit" : "Rediger"), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    handleDeletePodcast(podcast.id);
  }, className: "flex-1 bg-red-500 text-white p-2 rounded text-sm hover:bg-red-600" }, currentLang === "en" ? "Delete" : "Slett")))))), /* @__PURE__ */ React.createElement("button", { onClick: onBackClick, className: "inline-block px-5 py-3 bg-gray-800 text-white no-underline rounded-lg font-normal transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg mt-12", "data-en": "Back to Recommendations", "data-no": "Tilbake til anbefalinger" }, "Back to Recommendations"));
};
var RecommendationsPage = ({ onCategoryClick, onBackClick, currentLang }) => {
  useEffect(() => {
    applyLanguageToElements(currentLang);
  }, [currentLang]);
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center w-full" }, /* @__PURE__ */ React.createElement("h2", { className: "text-black text-3xl md:text-4xl lg:text-5xl mb-8", "data-en": "Recommendations", "data-no": "Anbefalinger" }, "Recommendations"), /* @__PURE__ */ React.createElement("p", { className: "text-black text-lg md:text-xl lg:text-2xl mb-8", "data-en": "Explore content across various categories.", "data-no": "Utforsk innhold i ulike kategorier." }, "Explore content across various categories."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-4xl" }, /* @__PURE__ */ React.createElement("div", { className: "category-link movies-category bg-red-100 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer", onClick: () => onCategoryClick("movies") }, /* @__PURE__ */ React.createElement("i", { className: "icon fa-solid fa-film text-red-500 text-6xl mb-4" }), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-red-800", "data-en": "Movies", "data-no": "Filmer" }, "Movies")), /* @__PURE__ */ React.createElement("div", { className: "category-link apps-category bg-blue-100 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer", onClick: () => onCategoryClick("apps") }, /* @__PURE__ */ React.createElement("i", { className: "icon fa-solid fa-mobile-alt text-blue-500 text-6xl mb-4" }), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-blue-800", "data-en": "Apps", "data-no": "Apper" }, "Apps")), /* @__PURE__ */ React.createElement("div", { className: "category-link books-category bg-green-100 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer", onClick: () => onCategoryClick("books") }, /* @__PURE__ */ React.createElement("i", { className: "icon fa-solid fa-book text-green-500 text-6xl mb-4" }), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-green-800", "data-en": "Books", "data-no": "B\xF8ker" }, "Books")), /* @__PURE__ */ React.createElement("div", { className: "category-link podcasts-category bg-purple-100 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer", onClick: () => onCategoryClick("podcasts") }, /* @__PURE__ */ React.createElement("i", { className: "icon fa-solid fa-podcast text-purple-500 text-6xl mb-4" }), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-purple-800", "data-en": "Podcasts", "data-no": "Podkaster" }, "Podcasts"))), /* @__PURE__ */ React.createElement("button", { onClick: onBackClick, className: "inline-block px-5 py-3 bg-gray-800 text-white no-underline rounded-lg font-normal transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg mt-12", "data-en": "Back to Home", "data-no": "Tilbake til hjem" }, "Back to Home"));
};
var CV_FIREB_APP_ID = "c_a9eccf039804a661_landing-page-react-439";
var initialCvData = {
  personalDetails: {
    born: "11.01.2002",
    languages_en: "Norwegian (native), English (fluent)",
    languages_no: "Norsk (morsm\xE5l), Engelsk (flytende)",
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    // Add a timestamp
  },
  education: [
    {
      id: "edu1",
      institution_en: "University of Bergen",
      institution_no: "Universitetet i Bergen",
      degree_en: "Master's degree in Comparative Politics",
      degree_no: "Mastergrad i sammenlignende politikk",
      date: "2025-2027",
      thesis_en: "Thesis Title: (To be determined)",
      thesis_no: "Tittel p\xE5 masteroppgave: (Ikke bestemt)",
      logo: "https://media.snl.no/media/11669/standard_uib.png"
    },
    {
      id: "edu2",
      institution_en: "University of Bergen",
      institution_no: "Universitetet i Bergen",
      degree_en: "Bachelor's degree in Comparative Politics",
      degree_no: "Bachelorgrad i sammenlignende politikk",
      date: "2022-2025",
      thesis_en: 'Thesis Title: "The Elephant in the Room: How the GOP Paved the Way for Trump\u2019s Populism"',
      thesis_no: 'Tittel p\xE5 bacheloroppgave: "The Elephant in the Room: How the GOP Paved the Way for Trump\u2019s Populism"',
      supervisor_en: "Supervisor: Jonas Linde (UiB)",
      supervisor_no: "Veileder: Jonas Linde (UiB)",
      courses_en: "Courses: SAMPOL100 Introduction to Comparative Politics, SAMPOL103 Political ideologies, SAMPOL105 State and Nation Building, SAMPOL106 Political Institutions in Established Democracies, SAMPOL107 Political Mobilization, SAMPOL115 Democracy and Democratization, MET102 Methods in the Social Sciences, SAMPOL203 Comparative Arctic Indigenous Governance, SAMPOL226 Populism and its Consequences for Liberal Democracy, SAMPOL233 Forsvar og totalforsvar i etablerte demokrati, SAMPOL230 Party Politics in Europa andutover, SAMPOL235 The Politics and Global Governance of International Protection, SAMPOL238 The Politics of Contestation, SAMPOL260 Bachelor Essay in Comparative Politics",
      courses_no: "Emner: SAMPOL100 Introduksjon til sammenlignende politikk, SAMPOL103 Politiske ideologier, SAMPOL105 Stats- og nasjonsbygging, SAMPOL106 Politiske institusjoner i etablerte demokratier, SAMPOL107 Politisk mobilisering, SAMPOL115 Demokrati og demokratisering, MET102 Samfunnsvitenskapelige metoder, SAMPOL203 Sammenlignende urfolksstyring i Arktis, SAMPOL226 Populisme og dens konsekvenser for liberalt demokrati, SAMPOL233 Forsvar og totalforsvar i etablerte demokrati, SAMPOL230 Partipolitikk i Europa og utover, SAMPOL235 Internasjonal beskyttelsespolitikk og global styring, SAMPOL238 Protestpolitikk, SAMPOL260 Bacheloroppgave i sammenlignende politikk",
      logo: "https://media.snl.no/media/11669/standard_uib.png"
    }
  ],
  experience: [
    {
      id: "exp1",
      company_en: "United Nations Association of Norway",
      company_no: "FN-sambandet",
      position_en: "Intern",
      position_no: "Praktikant",
      date: "Jan 2025 - Jul 2025",
      description_en: "Unpaid internship as part of my Comparative Politics bachelor's degree (SAMPOL290 Comparative Politics Internship)",
      description_no: "Ul\xF8nnet praksisplass som del av bachelorgraden i sammenlignende politikk (SAMPOL290 Praksis i sammenlignende politikk)",
      logo: "https://media.snl.no/media/17348/standard_FN-sambandet-logo.png"
    }
  ],
  roles: [
    {
      id: "role1",
      organization_en: "University of Bergen",
      organization_no: "Universitetet i Bergen",
      role_en: "Representative on the University's Learning Environment Committee",
      role_no: "Studentrepresentant i universitetets l\xE6ringsmilj\xF8utvalg",
      date: "2023-2025",
      description_en: "Elected by the Student Parliament for two terms: 1 Aug 2023-31 Jul 2024 & 1 Aug 2024-31 Jul 2025",
      description_no: "Valgt av Studentparlamentet for to perioder: 1. august 2023-31. juli 2024 og 1. august 2024-31. juli 2025",
      logo: "https://media.snl.no/media/11669/standard_uib.png"
    },
    {
      id: "role2",
      organization_en: "Sampolkonferansen (Comparative Politics Conference)",
      organization_no: "Sampolkonferansen (Sammenlignende Politikk Konferanse)",
      role_en: "PR Committee Member",
      role_no: "Medlem av PR-komiteen",
      date: "2022-2023",
      description_en: "Contributed to public relations and marketing efforts, with responsibility for the website and other communication channels",
      description_no: "Bidro til PR- og markedsf\xF8ringsarbeidet, med ansvar for netusiden og andre kommunikasjonskanaler",
      logo: "https://placehold.co/60x60/FF5733/FFFFFF?text=SC"
      // Placeholder for Sampolkonferansen logo
    },
    {
      id: "role3",
      organization_en: "Social Democratic List",
      organization_no: "Sosialdemokratiske liste",
      role_en: "Head of the Social Democratic List",
      role_no: "Listeleder for Sosialdemokratiske liste",
      date: "2023-2024",
      description_en: "I was Head of the Social Democratic List at the University of Bergen Student Parliament, representing and coordinating the list's activities and initiatives from March 2023 to March 2024.",
      description_no: "Jeg var listeleder for sosialdemokratisk liste ved Studentparlamentet ved Universitetet i Bergen, og representerte samt koordinerte listens aktiviteter og initiativ fra mars 2023 til mars 2024.",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm4mvh0jdZ2t9qtEHCCjhqnnxs-XecXbQr8g&s"
    },
    {
      id: "role4",
      organization_en: "Bergen AUF (Labour Party Youth Organisation)",
      organization_no: "Bergen AUF (Arbeiderpartiets Ungdomsorganisasjon)",
      role_en: "Board Member",
      role_no: "Styremedlem",
      date: "2020-2024",
      logo: "https://media.snl.no/media/63475/standard_auf.png"
    },
    {
      id: "role5",
      organization_en: "A-STUD (Labour Party Student Group in Bergen)",
      organization_no: "A-STUD (Arbeiderpartiets Studentgruppe in Bergen)",
      role_en: "Board Member",
      role_no: "Styremedlem",
      date: "2024-2025",
      logo: "https://samskipnaden.imgix.net/foreninger/271707754_233769422243385_179932508120700312_n.png?w=3840&auto=compress,format"
    },
    {
      id: "role6",
      organization_en: "The Architectural Uprising Bergen",
      organization_no: "Arkitekturoppr\xF8ret Bergen",
      role_en: "Head of Communications",
      role_no: "Kommunikasjonsansvarlig",
      date: "2024-Present",
      description_en: "Responsible to key individuals, and for developing communication strategies for use on various political parties.",
      description_no: "Ansvarlig overfor sentrale personer og for \xE5 utvikle kommunikasjonsstrategier for bruk ovenfor ulike politiske partier.",
      logo: "https://placehold.co/60x60/8B4513/FFFFFF?text=AB"
      // Placeholder for Arkitekturopprøret Bergen logo
    }
  ],
  skills: [
    { id: "skill1", name_en: "Writing and editing", name_no: "Skriving og redigering", icon: "fas fa-pencil-alt", type: "icon" },
    { id: "skill2", name_en: "Research and analysis", name_no: "Forskning og analyse", icon: "fas fa-magnifying-glass", type: "icon" },
    { id: "skill3", name_en: "Communication", name_no: "Kommunikasjon", icon: "fas fa-comments", type: "icon" },
    { id: "skill4", name_en: "Speech writing", name_no: "Taleskriving", icon: "fas fa-microphone-alt", type: "icon" },
    { id: "skill5", name_en: "Project management", name_no: "Prosjektledelse", icon: "fas fa-tasks", type: "icon" },
    { id: "skill6", name_en: "Content creation and digital media", name_no: "Innholdsproduksjon og digitale medier", icon: "fas fa-video", type: "icon" },
    {
      id: "skill7",
      name_en: "Languages (fluent in Norwegian and English)",
      name_no: "Spr\xE5k (flytende i norsk og engelsk)",
      type: "flags",
      flags: [
        "https://flagcdn.com/gb.svg",
        "https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Norway.svg"
      ]
    },
    { id: "skill8", name_en: "Microsoft Word", name_no: "Microsoft Word", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg/768px-Microsoft_Office_Word_%282019%E2%80%93present%29.svg.png", type: "image" },
    { id: "skill9", name_en: "Microsoft PowerPoint", name_no: "Microsoft PowerPoint", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Microsoft_Office_PowerPoint_%282019%E2%80%93present%29.svg/768px-Microsoft_Office_PowerPoint_%282019%E2%80%93present%29.svg.png", type: "image" },
    { id: "skill10", name_en: "Microsoft Excel", name_no: "Microsoft Excel", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/768px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png", type: "image" },
    { id: "skill11", name_en: "Windows", name_no: "Windows", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_logo_-_2021.svg/640px-Windows_logo_-_2021.svg.png", type: "image" },
    { id: "skill12", name_en: "Markdown", name_no: "Markdown", icon: "fa-brands fa-markdown", type: "icon" },
    { id: "skill13", name_en: "Obsidian.md", name_no: "Obsidian.md", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/2023_Obsidian_logo.svg/640px-2023_Obsidian_logo.png", type: "image" }
  ]
};
function CurriculumVitaePage({ onBackClick, currentLang, db }) {
  const { currentUser } = useAuth();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableCvData, setEditableCvData] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const ADMIN_USER_ID = "HCp5TlIvIxZlKvpeNwO1PWBtLfu2";
  const isAdmin = currentUser && currentUser.uid === ADMIN_USER_ID;
  useEffect(() => {
    applyLanguageToElements(currentLang);
  }, [currentLang]);
  useEffect(() => {
    if (!db) {
      setError("Firestore DB not initialized.");
      setLoading(false);
      return;
    }
    const cvDocRef = doc(db, `artifacts/${CV_FIREB_APP_ID}/public/data/cv`, `mainCV`);
    console.log("Attempting to fetch CV from path:", cvDocRef.path);
    const unsubscribe = onSnapshot(cvDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const fetchedData = docSnap.data();
        if (Object.keys(fetchedData).length === 0 && isAdmin) {
          console.log("Admin: Existing empty CV document detected. Attempting to re-populate.");
          try {
            await setDoc(cvDocRef, initialCvData);
            setCvData(initialCvData);
            setError(null);
            console.log("Admin: Empty CV document re-populated successfully.");
          } catch (e) {
            console.error("Error re-populating empty CV document by admin: ", e);
            setError("Failed to re-populate CV data. Check admin permissions.");
          }
        } else {
          setCvData(fetchedData);
          setError(null);
          console.log("CV data fetched from Firestore successfully from:", cvDocRef.path);
        }
      } else {
        console.log("CV document does not exist at:", cvDocRef.path);
        if (isAdmin) {
          console.log("Admin user detected. Attempting to create with initial data.");
          try {
            await setDoc(cvDocRef, initialCvData);
            setCvData(initialCvData);
            setError(null);
            console.log("Initial CV data successfully written to Firestore by admin to:", cvDocRef.path);
          } catch (e) {
            console.error("Error setting initial CV document by admin: ", e);
            setError("Failed to initialize CV data. Check admin permissions.");
          }
        } else {
          console.log("Non-admin user. CV document does not exist and will not be created automatically.");
          setCvData(null);
          setError("No CV data available.");
        }
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching CV document: ", err);
      setError("Failed to fetch CV data.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db, isAdmin]);
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2
    };
    const observer = new IntersectionObserver((entries, observer2) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add("is-visible");
          if (target.tagName === "SECTION") {
            const animatedChildren = target.querySelectorAll("li, .skill-item, .institution-logo, .app-logo, .pdf-download-section");
            animatedChildren.forEach((child, index) => {
              child.style.setProperty("--stagger-delay", `${index * 0.15}s`);
              child.classList.add("is-visible");
            });
          }
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    }, observerOptions);
    document.querySelectorAll("h2, .cv-container section, .pdf-download-section").forEach((element) => {
      observer.observe(element);
    });
    document.querySelectorAll("section ul li, .skills-grid .skill-item").forEach((element) => {
      observer.observe(element);
    });
    document.querySelectorAll(".institution-logo, .app-logo").forEach((logo) => {
      observer.observe(logo);
    });
    return () => observer.disconnect();
  }, [cvData]);
  const generatePdf = (targetLang) => {
    let pdfUrl;
    if (targetLang === "en") {
      pdfUrl = "https://solheim.online/KIANOSH F SOLHEIM CV EN.pdf";
    } else {
      pdfUrl = "https://solheim.online/KIANOSH F SOLHEIM CV NO.pdf";
    }
    window.open(pdfUrl, "_blank");
  };
  const formatAuthorName = (author) => {
    if (!author) return "";
    let name = author.first || "";
    if (author.middle) name += ` ${author.middle}`;
    if (author.last) name += ` ${author.last}`;
    return name;
  };
  const handleEditClick = () => {
    setEditableCvData(JSON.parse(JSON.stringify(cvData)));
    setIsEditing(true);
    setSaveStatus("idle");
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableCvData(null);
    setSaveStatus("idle");
  };
  const handleSaveCv = async () => {
    if (!isAdmin || !db || !editableCvData) {
      console.error("Save failed: Not admin, no CV data, or DB not initialized.");
      return;
    }
    setSaveStatus("saving");
    try {
      const cvDocRef = doc(db, `artifacts/${CV_FIREB_APP_ID}/public/data/cv`, `mainCV`);
      await updateDoc(cvDocRef, {
        ...editableCvData,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        // Update timestamp
      });
      setSaveStatus("saved");
      setIsEditing(false);
      setCvData(editableCvData);
      console.log("CV data saved successfully.");
    } catch (e) {
      console.error("Error saving CV data: ", e);
      setSaveStatus("error");
      setError("Failed to save CV data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const updateArrayItem = (arrayName, itemId, updatedFields) => {
    setEditableCvData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map(
        (item) => item.id === itemId ? { ...item, ...updatedFields } : item
      )
    }));
  };
  const deleteArrayItem = (arrayName, itemId) => {
    setEditableCvData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((item) => item.id !== itemId)
    }));
  };
  const addArrayItem = (arrayName, newItem) => {
    setEditableCvData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { id: Date.now().toString(), ...newItem }]
      // Simple unique ID
    }));
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center min-h-screen text-gray-700 text-xl" }, /* @__PURE__ */ React.createElement("span", { "data-en": "Loading CV...", "data-no": "Laster CV..." }, "Laster CV..."));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center min-h-screen text-red-500 text-xl" }, /* @__PURE__ */ React.createElement("span", { "data-en": "Error loading CV: ", "data-no": "Feil ved lasting av CV: " }, "Error loading CV: "), error);
  }
  if (!cvData && !isAdmin) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center min-h-screen text-gray-700 text-xl" }, /* @__PURE__ */ React.createElement("span", { "data-en": "No CV data available.", "data-no": "Ingen CV-data tilgjengelig." }, "Ingen CV-data tilgjengelig."));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "cv-container w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg flex flex-col items-center text-left" }, /* @__PURE__ */ React.createElement("h1", { className: "text-center text-4xl text-gray-800 mb-2 animate-fade-in", "data-en": "Curriculum Vitae", "data-no": "Curriculum Vitae" }, "Curriculum Vitae"), /* @__PURE__ */ React.createElement("div", { className: "contact-info text-center text-gray-600 text-lg animate-fade-in animate-delay-500" }, /* @__PURE__ */ React.createElement("p", null, "Kianosh F. Solheim"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { "data-en": "Updated:", "data-no": "Oppdatert:" }, "Updated:"), " ", cvData?.personalDetails.updatedAt ? new Date(cvData.personalDetails.updatedAt).toLocaleDateString(currentLang === "no" ? "nb-NO" : "en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A")), isAdmin && /* @__PURE__ */ React.createElement("div", { className: "flex justify-center gap-4 mt-6 mb-8 w-full" }, !isEditing ? /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleEditClick,
      className: "px-5 py-3 bg-blue-600 text-white rounded-lg font-normal transition-all duration-300 hover:bg-blue-700 hover:scale-105 shadow-md"
    },
    currentLang === "en" ? "Edit CV" : "Rediger CV"
  ) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleSaveCv,
      className: "px-5 py-3 bg-green-600 text-white rounded-lg font-normal transition-all duration-300 hover:bg-green-700 hover:scale-105 shadow-md",
      disabled: saveStatus === "saving"
    },
    saveStatus === "saving" ? currentLang === "en" ? "Saving..." : "Lagrer..." : currentLang === "en" ? "Save Changes" : "Lagre endringer"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleCancelEdit,
      className: "px-5 py-3 bg-red-600 text-white rounded-lg font-normal transition-all duration-300 hover:bg-red-700 hover:scale-105 shadow-md"
    },
    currentLang === "en" ? "Cancel" : "Avbryt"
  )), saveStatus === "saved" && /* @__PURE__ */ React.createElement("p", { className: "text-green-500" }, currentLang === "en" ? "Saved!" : "Lagret!"), saveStatus === "error" && /* @__PURE__ */ React.createElement("p", { className: "text-red-500" }, currentLang === "en" ? "Save failed!" : "Lagring feilet!")), /* @__PURE__ */ React.createElement("section", { className: "pdf-download-section w-full" }, /* @__PURE__ */ React.createElement("h3", { className: "text-gray-700 text-base mb-2", "data-en": "Download CV as PDF", "data-no": "Last ned CV som PDF" }, "Download CV as PDF"), /* @__PURE__ */ React.createElement("div", { className: "pdf-buttons flex justify-center gap-3 flex-wrap" }, /* @__PURE__ */ React.createElement("button", { className: "pdf-button bg-gray-800 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 hover:bg-gray-700 shadow-md flex items-center gap-1", onClick: () => generatePdf("en") }, /* @__PURE__ */ React.createElement("i", { className: "fa-solid fa-file-pdf" }), " ", /* @__PURE__ */ React.createElement("span", { "data-en": "Download English PDF", "data-no": "Last ned engelsk PDF" }, "Download English PDF")), /* @__PURE__ */ React.createElement("button", { className: "pdf-button bg-gray-800 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 hover:bg-gray-700 shadow-md flex items-center gap-1", onClick: () => generatePdf("no") }, /* @__PURE__ */ React.createElement("i", { className: "fa-solid fa-file-pdf" }), " ", /* @__PURE__ */ React.createElement("span", { "data-en": "Download Norwegian PDF", "data-no": "Last ned norsk PDF" }, "Last ned norsk PDF")))), cvData && // Only render sections if cvData exists
  /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "w-full mb-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gray-700 text-2xl border-b-2 border-gray-200 pb-2 mb-6", "data-en": "Personal Details", "data-no": "Personlige Opplysninger" }, "Personal Details"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", { className: "bg-white p-4 mb-4 rounded-lg shadow-sm flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "item-content w-full" }, isEditing ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 text-sm font-bold mb-1", htmlFor: "born" }, "Born:"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      id: "born",
      value: editableCvData.personalDetails.born,
      onChange: (e) => setEditableCvData((prev) => ({ ...prev, personalDetails: { ...prev.personalDetails, born: e.target.value } })),
      className: "p-2 border border-gray-300 rounded-md w-full mb-2"
    }
  ), /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 text-sm font-bold mb-1", htmlFor: "languages_en" }, "Languages (English):"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      id: "languages_en",
      value: editableCvData.personalDetails.languages_en,
      onChange: (e) => setEditableCvData((prev) => ({ ...prev, personalDetails: { ...prev.personalDetails, languages_en: e.target.value } })),
      className: "p-2 border border-gray-300 rounded-md w-full mb-2"
    }
  ), /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 text-sm font-bold mb-1", htmlFor: "languages_no" }, "Languages (Norwegian):"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      id: "languages_no",
      value: editableCvData.personalDetails.languages_no,
      onChange: (e) => setEditableCvData((prev) => ({ ...prev, personalDetails: { ...prev.personalDetails, languages_no: e.target.value } })),
      className: "p-2 border border-gray-300 rounded-md w-full mb-2"
    }
  )) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", { "data-en": "Born:", "data-no": "F\xF8dt:" }, "Born:"), " ", cvData.personalDetails.born), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", { "data-en": "Languages:", "data-no": "Spr\xE5k:" }, "Languages:"), " ", cvData.personalDetails[`languages_${currentLang}`])))))), /* @__PURE__ */ React.createElement("section", { className: "w-full mb-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gray-700 text-2xl border-b-2 border-gray-200 pb-2 mb-6", "data-en": "Education", "data-no": "Utdanning" }, "Education"), /* @__PURE__ */ React.createElement("ul", null, (isEditing ? editableCvData.education : cvData.education).map((edu, index) => /* @__PURE__ */ React.createElement("li", { key: edu.id, className: "bg-white p-4 mb-4 rounded-lg shadow-sm flex items-start gap-4 animate-on-scroll", style: { "--stagger-delay": `${index * 0.1}s` } }, /* @__PURE__ */ React.createElement("img", { src: edu.logo, alt: edu[`institution_${currentLang}`], className: "institution-logo w-16 h-16 rounded-lg object-contain flex-shrink-0", onError: (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/60x60/eeeeee/333333?text=Logo`;
  } }), /* @__PURE__ */ React.createElement("div", { className: "item-content flex-grow w-full" }, isEditing ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Institution (EN)", value: edu.institution_en, onChange: (e) => updateArrayItem("education", edu.id, { institution_en: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Institution (NO)", value: edu.institution_no, onChange: (e) => updateArrayItem("education", edu.id, { institution_no: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Degree (EN)", value: edu.degree_en, onChange: (e) => updateArrayItem("education", edu.id, { degree_en: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Degree (NO)", value: edu.degree_no, onChange: (e) => updateArrayItem("education", edu.id, { degree_no: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Date", value: edu.date, onChange: (e) => updateArrayItem("education", edu.id, { date: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Thesis Title (EN)", value: edu.thesis_en, onChange: (e) => updateArrayItem("education", edu.id, { thesis_en: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Thesis Title (NO)", value: edu.thesis_no, onChange: (e) => updateArrayItem("education", edu.id, { thesis_no: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Supervisor (EN)", value: edu.supervisor_en || "", onChange: (e) => updateArrayItem("education", edu.id, { supervisor_en: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Supervisor (NO)", value: edu.supervisor_no || "", onChange: (e) => updateArrayItem("education", edu.id, { supervisor_no: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: "Courses (EN)", value: edu.courses_en || "", onChange: (e) => updateArrayItem("education", edu.id, { courses_en: e.target.value }), className: "p-2 border rounded w-full mb-1", rows: "3" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: "Courses (NO)", value: edu.courses_no || "", onChange: (e) => updateArrayItem("education", edu.id, { courses_no: e.target.value }), className: "p-2 border rounded w-full mb-1", rows: "3" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Logo URL", value: edu.logo, onChange: (e) => updateArrayItem("education", edu.id, { logo: e.target.value }), className: "p-2 border rounded w-full mb-2" }), /* @__PURE__ */ React.createElement("button", { onClick: () => deleteArrayItem("education", edu.id), className: "bg-red-500 text-white p-2 rounded text-sm hover:bg-red-600 w-full" }, currentLang === "en" ? "Delete" : "Slett")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-semibold text-gray-800", "data-en": edu.degree_en, "data-no": edu.degree_no }, edu[`degree_${currentLang}`], ", ", edu[`institution_${currentLang}`]), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-sm" }, edu.date), edu[`thesis_${currentLang}`] && /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm mt-1", "data-en": edu.thesis_en, "data-no": edu.thesis_no }, "Thesis: ", edu[`thesis_${currentLang}`]), edu[`supervisor_${currentLang}`] && /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm mt-1", "data-en": edu.supervisor_en, "data-no": edu.supervisor_no }, edu[`supervisor_${currentLang}`]), edu[`courses_${currentLang}`] && /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm mt-1", "data-en": edu.courses_en, "data-no": edu.courses_no }, "Courses: ", edu[`courses_${currentLang}`])))))), isAdmin && isEditing && /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => addArrayItem("education", {
        institution_en: "",
        institution_no: "",
        degree_en: "",
        degree_no: "",
        date: "",
        thesis_en: "",
        thesis_no: "",
        supervisor_en: "",
        supervisor_no: "",
        courses_en: "",
        courses_no: "",
        logo: ""
      }),
      className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    },
    currentLang === "en" ? "Add New Education" : "Legg til ny utdanning"
  ))), /* @__PURE__ */ React.createElement("section", { className: "w-full mb-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gray-700 text-2xl border-b-2 border-gray-200 pb-2 mb-6", "data-en": "Professional Experience", "data-no": "Yrkeserfaring" }, "Professional Experience"), /* @__PURE__ */ React.createElement("ul", null, (isEditing ? editableCvData.experience : cvData.experience).map((exp, index) => /* @__PURE__ */ React.createElement("li", { key: exp.id, className: "bg-white p-4 mb-4 rounded-lg shadow-sm flex items-start gap-4 animate-on-scroll", style: { "--stagger-delay": `${index * 0.1}s` } }, /* @__PURE__ */ React.createElement("img", { src: exp.logo, alt: exp[`company_${currentLang}`], className: "institution-logo w-16 h-16 rounded-lg object-contain flex-shrink-0", onError: (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/60x60/eeeeee/333333?text=Logo`;
  } }), /* @__PURE__ */ React.createElement("div", { className: "item-content flex-grow w-full" }, isEditing ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Company (EN)", value: exp.company_en, onChange: (e) => updateArrayItem("experience", exp.id, { company_en: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Company (NO)", value: exp.company_no, onChange: (e) => updateArrayItem("experience", exp.id, { company_no: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Position (EN)", value: exp.position_en, onChange: (e) => updateArrayItem("experience", exp.id, { position_en: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Position (NO)", value: exp.position_no, onChange: (e) => updateArrayItem("experience", exp.id, { position_no: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Date", value: exp.date, onChange: (e) => updateArrayItem("experience", exp.id, { date: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: "Description (EN)", value: exp.description_en, onChange: (e) => updateArrayItem("experience", exp.id, { description_en: e.target.value }), className: "p-2 border rounded w-full mb-1", rows: "3" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: "Description (NO)", value: exp.description_no, onChange: (e) => updateArrayItem("experience", exp.id, { description_no: e.target.value }), className: "p-2 border rounded w-full mb-1", rows: "3" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Logo URL", value: exp.logo, onChange: (e) => updateArrayItem("experience", exp.id, { logo: e.target.value }), className: "p-2 border rounded w-full mb-2" }), /* @__PURE__ */ React.createElement("button", { onClick: () => deleteArrayItem("experience", exp.id), className: "bg-red-500 text-white p-2 rounded text-sm hover:bg-red-600 w-full" }, currentLang === "en" ? "Delete" : "Slett")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-semibold text-gray-800", "data-en": exp.position_en, "data-no": exp.position_no }, exp[`position_${currentLang}`], ", ", exp[`company_${currentLang}`]), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-sm" }, exp.date), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm mt-1", "data-en": exp.description_en, "data-no": exp.description_no }, exp[`description_${currentLang}`])))))), isAdmin && isEditing && /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => addArrayItem("experience", {
        company_en: "",
        company_no: "",
        position_en: "",
        position_no: "",
        date: "",
        description_en: "",
        description_no: "",
        logo: ""
      }),
      className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    },
    currentLang === "en" ? "Add New Experience" : "Legg til ny erfaring"
  ))), /* @__PURE__ */ React.createElement("section", { className: "w-full mb-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gray-700 text-2xl border-b-2 border-gray-200 pb-2 mb-6", "data-en": "Roles", "data-no": "Roller" }, "Roles"), /* @__PURE__ */ React.createElement("ul", null, (isEditing ? editableCvData.roles : cvData.roles).map((role, index) => /* @__PURE__ */ React.createElement("li", { key: role.id, className: "bg-white p-4 mb-4 rounded-lg shadow-sm flex items-start gap-4 animate-on-scroll", style: { "--stagger-delay": `${index * 0.1}s` } }, /* @__PURE__ */ React.createElement("img", { src: role.logo, alt: role[`organization_${currentLang}`], className: "institution-logo w-16 h-16 rounded-lg object-contain flex-shrink-0", onError: (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/60x60/eeeeee/333333?text=Logo`;
  } }), /* @__PURE__ */ React.createElement("div", { className: "item-content flex-grow w-full" }, isEditing ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Organization (EN)", value: role.organization_en, onChange: (e) => updateArrayItem("roles", role.id, { organization_en: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Organization (NO)", value: role.organization_no, onChange: (e) => updateArrayItem("roles", role.id, { organization_no: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Role (EN)", value: role.role_en, onChange: (e) => updateArrayItem("roles", role.id, { role_en: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Role (NO)", value: role.role_no, onChange: (e) => updateArrayItem("roles", role.id, { role_no: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Date", value: role.date, onChange: (e) => updateArrayItem("roles", role.id, { date: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: "Description (EN)", value: role.description_en || "", onChange: (e) => updateArrayItem("roles", role.id, { description_en: e.target.value }), className: "p-2 border rounded w-full mb-1", rows: "3" }), /* @__PURE__ */ React.createElement("textarea", { placeholder: "Description (NO)", value: role.description_no || "", onChange: (e) => updateArrayItem("roles", role.id, { description_no: e.target.value }), className: "p-2 border rounded w-full mb-1", rows: "3" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Logo URL", value: role.logo, onChange: (e) => updateArrayItem("roles", role.id, { logo: e.target.value }), className: "p-2 border rounded w-full mb-2" }), /* @__PURE__ */ React.createElement("button", { onClick: () => deleteArrayItem("roles", role.id), className: "bg-red-500 text-white p-2 rounded text-sm hover:bg-red-600 w-full" }, currentLang === "en" ? "Delete" : "Slett")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-semibold text-gray-800", "data-en": role.role_en, "data-no": role.role_no }, role[`role_${currentLang}`], ", ", role[`organization_${currentLang}`]), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-sm" }, role.date), role.description_en && /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm mt-1", "data-en": role.description_en, "data-no": role.description_no }, role[`description_${currentLang}`])))))), isAdmin && isEditing && /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => addArrayItem("roles", {
        organization_en: "",
        organization_no: "",
        role_en: "",
        role_no: "",
        date: "",
        description_en: "",
        description_no: "",
        logo: ""
      }),
      className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    },
    currentLang === "en" ? "Add New Role" : "Legg til ny rolle"
  ))), /* @__PURE__ */ React.createElement("section", { className: "w-full mb-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gray-700 text-2xl border-b-2 border-gray-200 pb-2 mb-6", "data-en": "Skills", "data-no": "Ferdigheter" }, "Skills"), /* @__PURE__ */ React.createElement("div", { className: "skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, (isEditing ? editableCvData.skills : cvData.skills).map((skill, index) => /* @__PURE__ */ React.createElement("div", { key: skill.id, className: "skill-item bg-white p-4 rounded-lg shadow-sm text-center flex flex-col items-center justify-center animate-on-scroll", style: { "--stagger-delay": `${index * 0.05}s` } }, isEditing ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Skill Name (EN)", value: skill.name_en, onChange: (e) => updateArrayItem("skills", skill.id, { name_en: e.target.value }), className: "p-2 border rounded w-full mb-1" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Skill Name (NO)", value: skill.name_no, onChange: (e) => updateArrayItem("skills", skill.id, { name_no: e.target.value }), className: "p-2 border rounded w-full mb-1" }), skill.type === "icon" && /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Icon Class (e.g., fas fa-star)", value: skill.icon, onChange: (e) => updateArrayItem("skills", skill.id, { icon: e.target.value }), className: "p-2 border rounded w-full mb-1" }), skill.type === "image" && /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Image URL", value: skill.image, onChange: (e) => updateArrayItem("skills", skill.id, { image: e.target.value }), className: "p-2 border rounded w-full mb-1" }), skill.type === "flags" && /* @__PURE__ */ React.createElement("textarea", { placeholder: "Flag URLs (comma-separated)", value: skill.flags.join(", "), onChange: (e) => updateArrayItem("skills", skill.id, { flags: e.target.value.split(",").map((s) => s.trim()) }), className: "p-2 border rounded w-full mb-1", rows: "2" }), /* @__PURE__ */ React.createElement("select", { value: skill.type, onChange: (e) => updateArrayItem("skills", skill.id, { type: e.target.value, icon: "", image: "", flags: [] }), className: "p-2 border rounded w-full mb-2" }, /* @__PURE__ */ React.createElement("option", { value: "icon" }, "Icon"), /* @__PURE__ */ React.createElement("option", { value: "image" }, "Image"), /* @__PURE__ */ React.createElement("option", { value: "flags" }, "Flags")), /* @__PURE__ */ React.createElement("button", { onClick: () => deleteArrayItem("skills", skill.id), className: "bg-red-500 text-white p-2 rounded text-sm hover:bg-red-600 w-full" }, currentLang === "en" ? "Delete" : "Slett")) : /* @__PURE__ */ React.createElement(React.Fragment, null, skill.type === "icon" && /* @__PURE__ */ React.createElement("i", { className: `${skill.icon} text-4xl mb-2 text-blue-600` }), skill.type === "image" && /* @__PURE__ */ React.createElement("img", { src: skill.image, alt: skill[`name_${currentLang}`], className: "app-logo w-12 h-12 mb-2 object-contain rounded-md shadow-sm", onError: (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/48x48/eeeeee/333333?text=App`;
  } }), skill.type === "flags" && /* @__PURE__ */ React.createElement("div", { className: "flag-container flex justify-center items-center mb-2" }, skill.flags.map((flagUrl, flagIndex) => /* @__PURE__ */ React.createElement("img", { key: flagIndex, src: flagUrl, alt: `Flag ${flagIndex}`, className: "flag-icon w-9 h-6 mx-0.5 object-cover border border-gray-300 rounded-md shadow-sm", onError: (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/36x24/eeeeee/333333?text=Flag`;
  } }))), /* @__PURE__ */ React.createElement("span", { className: "text-gray-800 font-semibold", "data-en": skill.name_en, "data-no": skill.name_no }, skill[`name_${currentLang}`]))))), isAdmin && isEditing && /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => addArrayItem("skills", { name_en: "", name_no: "", type: "icon", icon: "" }),
      className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    },
    currentLang === "en" ? "Add New Skill" : "Legg til ny ferdighet"
  )))), /* @__PURE__ */ React.createElement("button", { onClick: onBackClick, className: "inline-block px-5 py-3 bg-gray-800 text-white no-underline rounded-lg font-normal transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg mt-12", "data-en": "Back to Home", "data-no": "Tilbake til hjem" }, "Back to Home"));
}
var DetailPage = ({ item, onBackClick, currentLang }) => {
  useEffect(() => {
    applyLanguageToElements(currentLang);
  }, [currentLang]);
  if (!item) {
    return null;
  }
  const formatAuthorName = (author) => {
    if (!author) return "";
    let name = author.first || "";
    if (author.middle) name += ` ${author.middle}`;
    if (author.last) name += ` ${author.last}`;
    return name;
  };
  const isBookOrMovie = item.type === "books" || item.type === "movies";
  const aspectRatioClass = isBookOrMovie ? "pb-[150%]" : "pb-[100%]";
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center w-full max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg animate-fade-in" }, /* @__PURE__ */ React.createElement("h2", { className: "text-black text-3xl md:text-4xl lg:text-5xl mb-6 text-center", "data-en": item.title_en, "data-no": item.title_no }, item[`title_${currentLang}`]), /* @__PURE__ */ React.createElement("div", { className: `relative w-full mx-auto ${aspectRatioClass} mb-6 rounded-lg shadow-md overflow-hidden` }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: currentLang === "en" ? item.image_en : item.image_no || item.image_en,
      alt: item[`title_${currentLang}`],
      className: "absolute top-0 left-0 w-full h-full object-cover",
      onError: (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/400x600/eeeeee/333333?text=No+Image`;
      }
    }
  )), item.author && /* @__PURE__ */ React.createElement("p", { className: "text-gray-700 text-lg text-center mb-4", "data-en": `By: ${formatAuthorName(item.author)}`, "data-no": `Av: ${formatAuthorName(item.author)}` }, currentLang === "en" ? "By:" : "Av:", " ", formatAuthorName(item.author)), /* @__PURE__ */ React.createElement("p", { className: "text-gray-800 text-base text-center mb-8", "data-en": item.description_en, "data-no": item.description_no }, item[`description_${currentLang}`]), /* @__PURE__ */ React.createElement("button", { onClick: onBackClick, className: "inline-block px-5 py-3 bg-gray-800 text-white no-underline rounded-lg font-normal transition-all duration-300 hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg", "data-en": "Back", "data-no": "Tilbake" }, "Back"));
};
var MainAppContent = () => {
  const { currentUser, logout, auth: auth2, app: app2, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [movies, setMovies] = useState([]);
  const [apps, setApps] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showExpandingOverlay, setShowExpandingOverlay] = useState(false);
  const [isOverlaySlidingOpen, setIsOverlaySlidingOpen] = useState(false);
  const [logoRect, setLogoRect] = useState(null);
  const logoRef = useRef(null);
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const db = app2 ? getFirestore(app2) : null;
  useEffect(() => {
    let unsubscribeBooks;
    let unsubscribeMovies;
    let unsubscribeApps;
    let unsubscribePodcasts;
    if (!authLoading && db && app2) {
      console.log("Firestore useEffect: Initializing Firestore listeners.");
      unsubscribeBooks = onSnapshot(collection(db, `books`), (snapshot) => {
        console.log("Firestore useEffect: Received new books snapshot.");
        const fetchedBooks = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
        fetchedBooks.sort((a, b) => {
          const dateA = a.createdAt && typeof a.createdAt.toDate === "function" ? a.createdAt.toDate() : a.createdAt instanceof Date ? a.createdAt : /* @__PURE__ */ new Date(0);
          const dateB = b.createdAt && typeof b.createdAt.toDate === "function" ? b.createdAt.toDate() : b.createdAt instanceof Date ? b.createdAt : /* @__PURE__ */ new Date(0);
          return dateA.getTime() - dateB.getTime();
        });
        setBooks(fetchedBooks);
        console.log("Firestore useEffect: Books updated, count:", fetchedBooks.length);
      }, (error) => {
        console.error("Firestore useEffect: Error listening to books collection: ", error);
      });
      unsubscribeMovies = onSnapshot(collection(db, `movies`), (snapshot) => {
        console.log("Firestore useEffect: Received new movies snapshot.");
        const fetchedMovies = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
        fetchedMovies.sort((a, b) => {
          const dateA = a.createdAt && typeof a.createdAt.toDate === "function" ? a.createdAt.toDate() : a.createdAt instanceof Date ? a.createdAt : /* @__PURE__ */ new Date(0);
          const dateB = b.createdAt && typeof b.createdAt.toDate === "function" ? b.createdAt.toDate() : b.createdAt instanceof Date ? b.createdAt : /* @__PURE__ */ new Date(0);
          return dateA.getTime() - dateB.getTime();
        });
        setMovies(fetchedMovies);
        console.log("Firestore useEffect: Movies updated, count:", fetchedMovies.length);
      }, (error) => {
        console.error("Firestore useEffect: Error listening to movies collection: ", error);
      });
      unsubscribeApps = onSnapshot(collection(db, `apps`), (snapshot) => {
        console.log("Firestore useEffect: Received new apps snapshot.");
        const fetchedApps = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
        fetchedApps.sort((a, b) => {
          const dateA = a.createdAt && typeof a.createdAt.toDate === "function" ? a.createdAt.toDate() : a.createdAt instanceof Date ? a.createdAt : /* @__PURE__ */ new Date(0);
          const dateB = b.createdAt && typeof b.createdAt.toDate === "function" ? b.createdAt.toDate() : b.createdAt instanceof Date ? b.createdAt : /* @__PURE__ */ new Date(0);
          return dateA.getTime() - dateB.getTime();
        });
        setApps(fetchedApps);
        console.log("Firestore useEffect: Apps updated, count:", fetchedApps.length);
      }, (error) => {
        console.error("Firestore useEffect: Error listening to apps collection: ", error);
      });
      unsubscribePodcasts = onSnapshot(collection(db, `podcasts`), (snapshot) => {
        console.log("Firestore useEffect: Received new podcasts snapshot.");
        const fetchedPodcasts = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
        fetchedPodcasts.sort((a, b) => {
          const dateA = a.createdAt && typeof a.createdAt.toDate === "function" ? a.createdAt.toDate() : a.createdAt instanceof Date ? a.createdAt : /* @__PURE__ */ new Date(0);
          const dateB = b.createdAt && typeof b.createdAt.toDate === "function" ? b.createdAt.toDate() : b.createdAt instanceof Date ? b.createdAt : /* @__PURE__ */ new Date(0);
          return dateA.getTime() - dateB.getTime();
        });
        setPodcasts(fetchedPodcasts);
        console.log("Firestore useEffect: Podcasts updated, count:", fetchedPodcasts.length);
      }, (error) => {
        console.error("Firestore useEffect: Error listening to podcasts collection: ", error);
      });
    } else {
      console.log("Firestore useEffect: Auth loading or Firebase app/Firestore not ready, skipping Firestore listener setup.");
    }
    return () => {
      if (unsubscribeBooks) {
        console.log("Firestore useEffect: Cleaning up books listener.");
        unsubscribeBooks();
      }
      if (unsubscribeMovies) {
        console.log("Firestore useEffect: Cleaning up movies listener.");
        unsubscribeMovies();
      }
      if (unsubscribeApps) {
        console.log("Firestore useEffect: Cleaning up apps listener.");
        unsubscribeApps();
      }
      if (unsubscribePodcasts) {
        console.log("Firestore useEffect: Cleaning up podcasts listener.");
        unsubscribePodcasts();
      }
    };
  }, [db, app2, authLoading]);
  const applyLanguageToElementsAndToggle = useCallback((currentLang) => {
    document.querySelectorAll("[data-en], [data-no]").forEach((el) => {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`);
      } else {
        el.textContent = el.getAttribute(`data-${currentLang}`);
      }
    });
    const btn = document.querySelector(".lang-toggle");
    const url = currentLang === "en" ? "https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Norway.svg" : "https://flagcdn.com/gb.svg";
    if (btn) {
      btn.style.backgroundImage = `url(${url})`;
    }
    const langLabelElement = document.getElementById("langLabel");
    if (langLabelElement) {
      langLabelElement.textContent = currentLang === "en" ? "Change Language" : "Endre Spr\xE5k";
    }
  }, []);
  useEffect(() => {
    applyLanguageToElementsAndToggle(lang);
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = (/* @__PURE__ */ new Date()).getFullYear();
    }
  }, [lang, applyLanguageToElementsAndToggle]);
  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "no" : "en";
    setLang(nextLang);
    localStorage.setItem("lang", nextLang);
  };
  const handleCategoryClick = (category) => {
    setSelectedItem(null);
    setSelectedCategory(category);
    navigate(`/${category}`);
  };
  const handleItemClick = (item, category) => {
    setSelectedItem({ ...item, type: category });
    setSelectedCategory(category);
    navigate("/detail");
  };
  const handleBackFromDetail = () => {
    setSelectedItem(null);
    navigate(`/${selectedCategory}`);
  };
  const handleBackToHome = () => {
    setSelectedItem(null);
    setSelectedCategory(null);
    navigate("/");
  };
  const handleBackToRecommendations = () => {
    setSelectedItem(null);
    setSelectedCategory(null);
    navigate("/recommendations");
  };
  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }
  const handleLogoClick = () => {
    setLogoClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount >= 7) {
        if (logoRef.current) {
          const rect = logoRef.current.getBoundingClientRect();
          setLogoRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
        }
        setShowExpandingOverlay(true);
        setTimeout(() => {
          navigate("/login");
          setIsOverlaySlidingOpen(true);
          setTimeout(() => {
            setLogoClickCount(0);
            setShowExpandingOverlay(false);
            setIsOverlaySlidingOpen(false);
            setLogoRect(null);
          }, 1500);
        }, 1200);
      }
      return newCount;
    });
  };
  return /* @__PURE__ */ React.createElement("div", { className: `min-h-screen flex flex-col items-center justify-between font-serif ${isAuthPage ? "bg-gray-100" : "bg-white"}` }, showExpandingOverlay && logoRect && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `logo-expanding-overlay ${showExpandingOverlay ? "active" : ""} ${isOverlaySlidingOpen ? "slide-open" : ""}`,
      style: {
        "--logo-initial-top": `${logoRect.top}px`,
        "--logo-initial-left": `${logoRect.left}px`,
        "--logo-initial-width": `${logoRect.width}px`,
        "--logo-initial-height": `${logoRect.height}px`,
        "--logo-background-image": `url('https://www.solheim.online/Kianosh%20F.%20Solheim%20Heraldry.svg')`
        // Pass image URL as CSS variable
      }
    }
  ), /* @__PURE__ */ React.createElement("link", { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css", crossOrigin: "anonymous", referrerPolicy: "no-referrer" }), /* @__PURE__ */ React.createElement("script", { src: "https://cdn.tailwindcss.com" }), /* @__PURE__ */ React.createElement("script", { src: "https://www.google.com/recaptcha/api.js", async: true, defer: true }), /* @__PURE__ */ React.createElement("style", null, `
        html, body {
            box-sizing: border-box;
            overflow-x: hidden;
            margin: 0;
            padding: 0;
        }
        *, *::before, *::after {
            box-sizing: inherit;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-delay-500 {
            animation-delay: 0.5s;
        }

        @keyframes slideInFromBottom {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-bottom {
          animation: slideInFromBottom 0.8s ease-out forwards;
        }


        .home-button-wrapper, .lang-toggle-wrapper {
          position: fixed;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .home-button-wrapper {
          top: 1rem;
          left: 1rem;
        }

        .lang-toggle-wrapper {
          top: 1rem;
          right: 1rem;
        }

        .home-button, .lang-toggle {
          background: transparent;
          border: none;
          border-radius: 50%;
          width: 2rem;
          height: 2rem;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          opacity: 0.5;
          transition: transform 0.4s ease, box-shadow 0.4s ease, opacity 0.4s ease;
        }

        .home-button:hover, .lang-toggle:hover {
          transform: rotate(360deg) scale(1.2);
          box-shadow: 0 0 12px rgba(0,0,0,0.2);
          opacity: 1;
        }

        /* Explicitly set color for home icon */
        .home-button i {
          font-size: 1.2rem;
          color: #000 !important;
          transition: color 0.4s ease;
        }
        .home-button:hover i {
          color: #000 !important;
        }


        .lang-toggle {
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }

        .home-label, .lang-label {
          position: absolute;
          top: calc(100% + 0.3rem);
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
        }
        .home-button-wrapper:hover .home-label, .lang-toggle-wrapper:hover .lang-label {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* Category Link Animations */
        .category-link .icon {
          transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
        }
        .category-link.movies-category:hover .icon {
          transform: rotateY(360deg) scale(1.2);
          color: #E74C3C;
        }
        .category-link.apps-category:hover .icon {
          animation: bounce 0.6s ease-in-out infinite alternate;
          color: #3498DB;
        }
        .category-link.books-category:hover .icon {
          transform: rotateZ(-10deg) scale(1.15);
          color: #27AE60;
        }
        .category-link.podcasts-category:hover .icon {
          animation: pulse 1s infinite, spin 2s linear infinite;
          color: #9B59B6;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Social Icons Animations */
        .social-icons a {
            transition: transform 0.2s ease, color 0.3s ease, text-shadow 0.3s ease;
        }
        .social-icons a:hover {
            transform: scale(1.35) rotate(5deg);
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        .social-icons a[title="Facebook"]:hover { color: #1877F2; }
        .social-icons a[title="Instagram"]:hover { color: #E1306C; }
        .social-icons a[title="LinkedIn"]:hover { color: #0077B5; }
        .social-icons a[title="Bluesky"]:hover { color: #0A7AFF; }
        .social-icons a[title="Threads"]:hover { color: #000000; text-shadow: 0 0 6px #000000; }
        .social-icons a[title="Twitter"]:hover { color: #1DA1F2; }

        .social-icons a::after {
            content: attr(title);
            font-size: 0.75rem;
            color: #666;
            margin-top: 0.3rem;
            opacity: 0;
            transform: translateY(5px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: none;
        }
        .social-icons a:hover::after {
            opacity: 1;
            transform: translateY(0);
        }

        /* CV Page Specific Styles */
        .cv-container {
            text-align: left;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        }
        .cv-container h1 {
            text-align: center;
            color: #2c3e50;
            font-size: 2.8rem;
            margin-bottom: 0.5rem;
            animation: slideInFromTop 0.8s ease-out;
        }
        .cv-container p {
            text-align: center;
        }
        .cv-container h2 {
            font-size: 1.8rem;
            color: #34495e;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 0.5rem;
            margin-top: 2.5rem;
            margin-bottom: 1.5rem;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .cv-container h2.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
        .cv-container h3 {
            color: #555;
            font-size: 1.3rem;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
        }
        .cv-container .contact-info p {
            margin: 0.3rem 0;
            text-align: center;
        }
        .cv-container .contact-info a {
            color: #3498db;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        .cv-container .contact-info a:hover {
            color: #2980b9;
            text-decoration: underline;
        }
        .cv-container ul {
            list-style: none;
            padding: 0;
        }
        .cv-container ul li {
            background: #ffffff;
            padding: 1rem 1.5rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            opacity: 0;
            transform: translateX(-50px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            transition-delay: var(--stagger-delay, 0s);
        }
        .cv-container ul li.is-visible {
            opacity: 1;
            transform: translateX(0);
        }
        .cv-container .item-content {
            flex-grow: 1;
        }
        .cv-container .item-content p {
            margin: 0.2rem 0;
            text-align: left;
        }
        .cv-container .item-content .date {
            font-size: 0.9rem;
            color: #777;
            margin-top: 0.5rem;
        }
        .cv-container .item-content .thesis-title, .cv-container .item-content .courses, .cv-container .item-content .description {
            font-style: italic;
            color: #666;
        }
        .cv-container .institution-logo, .cv-container .app-logo {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            object-fit: contain;
            flex-shrink: 0;
            opacity: 0;
            transform: scale(0.5);
            transition: opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            transition-delay: var(--stagger-delay, 0s);
        }
        .cv-container .institution-logo.is-visible, .cv-container .app-logo.is-visible {
            opacity: 1;
            transform: scale(1);
        }
        .cv-container .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .cv-container .skill-item {
            background: #ffffff;
            padding: 0.8rem;
            border-radius: 8px;
            text-align: center;
            font-size: 0.95rem;
            font-weight: bold;
            color: #2980b9;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            opacity: 0;
            transform: translateY(20px) scale(0.9);
            transition: opacity 0.7s ease-out, transform 0.7s ease-out;
            transition-delay: var(--stagger-delay, 0s);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .cv-container .skill-item.is-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .cv-container .skill-item:hover {
            transform: translateY(-8px) scale(1.1);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2), 0 0 25px rgba(41, 128, 185, 0.5);
            transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .cv-container .skill-item img {
            width: 35px;
            height: 35px;
            margin-bottom: 0.5rem;
            object-fit: contain;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cv-container .skill-item img:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .cv-container .skill-item i {
            font-size: 35px;
            margin-bottom: 0.5rem;
            color: #2980b9;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, text-shadow 0.3s ease, color 0.3s ease;
        }

        .cv-container .skill-item i:hover {
            transform: scale(1.1);
            color: #3498db;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .cv-container .skill-item .flag-icon {
            width: 35px;
            height: 23px;
            margin: 0 2px;
            object-fit: cover;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cv-container .skill-item .flag-icon:hover {
            transform: scale(1.15);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        .cv-container .flag-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        /* PDF Download Buttons */
        .pdf-download-section {
            text-align: center;
            margin-top: 1.5rem;
            margin-bottom: 2rem;
            padding: 0.8rem 1rem;
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
            background-color: #f8f8f8;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .pdf-download-section.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        .pdf-download-section h3 {
            color: #34495e;
            font-size: 1.1rem;
            margin-bottom: 0.8rem;
        }

        .pdf-buttons {
            display: flex;
            justify-content: center;
            gap: 0.8rem;
            flex-wrap: wrap;
        }

        .pdf-button {
            background-color: #333333;
            color: white;
            padding: 0.6rem 1.2rem;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .pdf-button:hover {
            background-color: #555555;
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .pdf-button i {
            font-size: 1rem;
            margin-bottom: 0;
            text-shadow: none;
        }

        /* Animations */
        @keyframes slideInFromTop {
            0% { opacity: 0; transform: translateY(-30px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .cv-container {
                margin: 1rem auto;
                padding: 1rem;
            }
            .cv-container h1 {
                font-size: 2.2rem;
            }
            .cv-container h2 {
                font-size: 1.5rem;
            }
            .cv-container ul li {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            .cv-container .institution-logo {
                margin-bottom: 0.5rem;
            }
            .cv-container .skills-grid {
                grid-template-columns: 1fr;
            }
            .lang-toggle-wrapper {
                top: 0.5rem;
                right: 0.5rem;
            }
            .home-button-wrapper {
                top: 0.5rem;
                left: 0.5rem;
            }
            .home-label, .lang-label {
                top: 2rem;
                left: 2rem;
            }
        }

        /* Developer Mode / Hidden Login Styles */
        .logo-door-container {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0.5rem auto;
        }

        .logo-door {
            display: block;
            width: 100%;
            height: 100%;
            transition: none;
        }

        /* New Logo Expanding Overlay Styles */
        .logo-expanding-overlay {
            position: fixed;
            z-index: 9998;
            background-color: white; /* Default background, will be overridden by .slide-open */
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain; /* Ensure logo is contained and not cut off during initial expansion */
            opacity: 0;
            pointer-events: none;
            /* Initial state set by JS variables, but conceptually it's a small rectangle */
            top: var(--logo-initial-top);
            left: var(--logo-initial-left);
            width: var(--logo-initial-width);
            height: var(--logo-initial-height);
            transform: translate(0, 0);
            border-radius: 0; /* No border-radius transition on the overlay itself */
            overflow: hidden; /* Important for clean transitions */
            /* The background-image will be set via inline style in React */
        }

        /* When the overlay is meant to be visible and expanding */
        .logo-expanding-overlay.active {
            opacity: 1; /* Make it visible immediately upon activation */
            pointer-events: auto;
            animation: expand-from-logo-position 1.2s ease-in-out forwards;
            background-image: var(--logo-background-image); /* Show full logo during expansion */
        }

        @keyframes expand-from-logo-position {
            0% {
                top: var(--logo-initial-top);
                left: var(--logo-initial-left);
                width: var(--logo-initial-width);
                height: var(--logo-initial-height);
                transform: translate(0, 0);
                /* No border-radius here, it's always 0 */
            }
            100% {
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                transform: translate(0, 0);
                /* No border-radius here, it's always 0 */
                opacity: 1;
            }
        }

        /* Pseudo-elements for the sliding door effect */
        .logo-expanding-overlay::before,
        .logo-expanding-overlay::after {
            content: '';
            position: absolute;
            top: 0;
            height: 100%;
            /* Use CSS variable for image */
            background-image: var(--logo-background-image);
            background-repeat: no-repeat;
            background-size: 200% 100%; /* Make background image twice as wide to cover both halves */
            background-color: white; /* Ensure the doors themselves are white */
            opacity: 1; /* Always visible when slide-open is active, no fade-in */
            transition: none; /* No transition for opacity */
        }

        /* When the overlay is in slide-open state, hide the main background-image and show pseudo-elements */
        .logo-expanding-overlay.slide-open {
            background-image: none !important; /* Hide the full logo */
            background-color: transparent !important; /* Make the overlay itself transparent to reveal content behind */
        }

        .logo-expanding-overlay.slide-open::before,
        .logo-expanding-overlay.slide-open::after {
            opacity: 1; /* Make pseudo-elements visible */
        }

        .logo-expanding-overlay::before {
            left: 0;
            width: 50%;
            background-position: 0% 0%; /* Show left half of the image */
        }

        .logo-expanding-overlay::after {
            left: 50%;
            width: 50%;
            background-position: 100% 0%; /* Show right half of the image */
        }

        /* Animation for sliding the doors open */
        @keyframes slide-open-logo-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
        }

        @keyframes slide-open-logo-right {
            0% { transform: translateX(0); }
            100% { transform: translateX(100%); }
        }

        .logo-expanding-overlay.slide-open::before {
            animation: slide-open-logo-left 1.5s ease-out forwards; /* Slower animation */
        }

        .logo-expanding-overlay.slide-open::after {
            animation: slide-open-logo-right 1.5s ease-out forwards; /* Slower animation */
        }

        /* Hide login/signup links by default */
        .footer-auth-links {
            display: none;
        }

        /* Ensure main content is behind the overlay when it's active */
        .main-content-wrapper {
            position: relative; /* Needed for z-index to work */
            z-index: 1; /* Lower than the overlay's z-index */
        }

        `), /* @__PURE__ */ React.createElement("div", { className: "home-button-wrapper" }, /* @__PURE__ */ React.createElement(Link, { to: "/", className: "home-button", title: "Home" }, /* @__PURE__ */ React.createElement("i", { className: "fa-solid fa-house" })), /* @__PURE__ */ React.createElement("div", { className: "home-label" }, "Home")), /* @__PURE__ */ React.createElement("div", { className: "lang-toggle-wrapper" }, /* @__PURE__ */ React.createElement("button", { onClick: toggleLanguage, className: "lang-toggle", title: "Change Language" }), /* @__PURE__ */ React.createElement("div", { className: "lang-label", id: "langLabel" }, "Change Language")), /* @__PURE__ */ React.createElement("main", { className: `main-content-wrapper w-full max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-center` }, /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, { path: "/login", element: /* @__PURE__ */ React.createElement(Login, { currentLang: lang }) }), /* @__PURE__ */ React.createElement(Route, { path: "/signup", element: /* @__PURE__ */ React.createElement(Signup, { currentLang: lang }) }), /* @__PURE__ */ React.createElement(Route, { path: "/", element: /* @__PURE__ */ React.createElement(HomePage, { onCategoryClick: handleCategoryClick, currentLang: lang }) }), /* @__PURE__ */ React.createElement(Route, { path: "/recommendations", element: /* @__PURE__ */ React.createElement(RecommendationsPage, { onCategoryClick: handleCategoryClick, onBackClick: handleBackToHome, currentLang: lang }) }), /* @__PURE__ */ React.createElement(Route, { path: "/movies", element: /* @__PURE__ */ React.createElement(MoviesPage, { onBackClick: handleBackToRecommendations, onItemClick: handleItemClick, currentLang: lang, movies, user: currentUser, db }) }), /* @__PURE__ */ React.createElement(Route, { path: "/apps", element: /* @__PURE__ */ React.createElement(AppsPage, { onBackClick: handleBackToRecommendations, onItemClick: handleItemClick, currentLang: lang, apps, user: currentUser, db }) }), /* @__PURE__ */ React.createElement(Route, { path: "/books", element: /* @__PURE__ */ React.createElement(BooksPage, { onBackClick: handleBackToRecommendations, onItemClick: handleItemClick, currentLang: lang, books, user: currentUser, db }) }), /* @__PURE__ */ React.createElement(Route, { path: "/podcasts", element: /* @__PURE__ */ React.createElement(PodcastsPage, { onBackClick: handleBackToRecommendations, onItemClick: handleItemClick, currentLang: lang, podcasts, user: currentUser, db }) }), /* @__PURE__ */ React.createElement(Route, { path: "/cv", element: /* @__PURE__ */ React.createElement(CurriculumVitaePage, { onBackClick: handleBackToHome, currentLang: lang, db }) }), /* @__PURE__ */ React.createElement(Route, { path: "/detail", element: /* @__PURE__ */ React.createElement(DetailPage, { item: selectedItem, onBackClick: handleBackFromDetail, currentLang: lang }) }), /* @__PURE__ */ React.createElement(Route, { path: "*", element: /* @__PURE__ */ React.createElement("h2", { className: "text-black text-3xl text-center mb-8", "data-en": "Page Not Found", "data-no": "Side ikke funnet" }, "Side Not Found") }))), /* @__PURE__ */ React.createElement("footer", { className: "w-full text-center mt-auto py-8 px-4 text-gray-600 border-t border-gray-300 bg-gray-50 box-border" }, currentUser && /* @__PURE__ */ React.createElement("p", { className: "text-sm mb-2" }, /* @__PURE__ */ React.createElement("span", { "data-en": "Current User ID:", "data-no": "Gjeldende bruker-ID:" }, "Current User ID:"), " ", currentUser.uid, /* @__PURE__ */ React.createElement("button", { onClick: handleLogout, className: "ml-4 px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition-colors" }, lang === "en" ? "Log Out" : "Logg ut")), /* @__PURE__ */ React.createElement("div", { className: "social-icons flex justify-center gap-4 mb-4 mt-10 animate-fade-in" }, /* @__PURE__ */ React.createElement("a", { href: "https://www.facebook.com/solheim.online/", title: "Facebook", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-facebook" })), /* @__PURE__ */ React.createElement("a", { href: "https://www.instagram.com/solheim.online", title: "Instagram", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-instagram" })), /* @__PURE__ */ React.createElement("a", { href: "https://www.linkedin.com/in/kianosh-solheim", title: "LinkedIn", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-linkedin" })), /* @__PURE__ */ React.createElement("a", { href: "https://bsky.app/profile/solheim.online", title: "Bluesky", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-bluesky" })), /* @__PURE__ */ React.createElement("a", { href: "https://www.threads.net/@solheim.online", title: "Threads", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-threads" })), /* @__PURE__ */ React.createElement("a", { href: "https://x.com/Kianosh_Solheim", title: "Twitter", className: "relative flex flex-col items-center text-2xl text-black" }, /* @__PURE__ */ React.createElement("i", { className: "fa-brands fa-twitter" }))), /* @__PURE__ */ React.createElement("div", { className: "logo-door-container" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://www.solheim.online/Kianosh%20F.%20Solheim%20Heraldry.svg",
      alt: "Personal Logo",
      className: `footer-logo logo-door mx-auto my-2 block`,
      onClick: handleLogoClick,
      ref: logoRef,
      onError: (e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/80x80/eeeeee/333333?text=Logo";
      }
    }
  )), /* @__PURE__ */ React.createElement("p", { className: "copyright-text mt-2", "data-en": "\xA9 2025 Kianosh F. Solheim. All rights reserved.", "data-no": "\xA9 2025 Kianosh F. Solheim. Alle rettigheter forbeholdt." }, "\xA9 ", /* @__PURE__ */ React.createElement("span", { id: "year" }), " All rights reserved. Made by Kianosh F. Solheim.")));
};
var App = () => /* @__PURE__ */ React.createElement(AuthProvider, null, /* @__PURE__ */ React.createElement(Router, null, /* @__PURE__ */ React.createElement(MainAppContent, null)));
var App_default = App;
export {
  App_default as default
};
