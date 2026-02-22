module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://your-supabase-url.supabase.co"), ("TURBOPACK compile-time value", "your-supabase-anon-key"));
}),
"[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
const API = ("TURBOPACK compile-time value", "http://localhost:8000") || "http://localhost:8000";
async function authHeaders() {
    const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
    if (!session) return {};
    return {
        Authorization: `Bearer ${session.access_token}`
    };
}
async function apiFetch(path, opts = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...await authHeaders(),
        ...opts.headers || {}
    };
    const res = await fetch(`${API}${path}`, {
        ...opts,
        headers
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text}`);
    }
    return res.json();
}
const api = {
    getMe: ()=>apiFetch("/me"),
    updateThreshold: (t)=>apiFetch("/me/threshold", {
            method: "PUT",
            body: JSON.stringify({
                default_threshold: t
            })
        }),
    getReports: ()=>apiFetch("/reports"),
    createReport: (data)=>apiFetch("/reports", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    upvoteReport: (id)=>apiFetch(`/reports/${id}/upvote`, {
            method: "POST"
        }),
    getAlerts: ()=>apiFetch("/alerts"),
    getAnalytics: ()=>apiFetch("/admin/analytics")
};
}),
"[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthGate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/lib/supabase.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function AuthGate({ children }) {
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSignUp, setIsSignUp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession().then(({ data })=>setSession(data.session));
        const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange((_e, s)=>setSession(s));
        return ()=>subscription.unsubscribe();
    }, []);
    if (session === undefined) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        style: {
            textAlign: "center",
            marginTop: "3rem"
        },
        children: "Loading…"
    }, void 0, false, {
        fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
        lineNumber: 24,
        columnNumber: 12
    }, this);
    if (session) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (isSignUp) {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
                    email,
                    password
                });
                if (error) throw error;
            } else {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
            }
        } catch (err) {
            setError(err.message || "Auth error");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            maxWidth: 380,
            margin: "4rem auto"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                style: {
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    textAlign: "center"
                },
                children: isSignUp ? "Create Account" : "Sign In"
            }, void 0, false, {
                fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                style: {
                    marginTop: "1rem"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Email",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "email",
                                value: email,
                                onChange: (e)=>setEmail(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Password",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                value: password,
                                onChange: (e)=>setPassword(e.target.value),
                                required: true,
                                minLength: 6
                            }, void 0, false, {
                                fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: "#ef4444",
                            marginTop: "0.5rem",
                            fontSize: "0.9rem"
                        },
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "btn btn-primary",
                        style: {
                            width: "100%",
                            marginTop: "1rem",
                            justifyContent: "center"
                        },
                        disabled: loading,
                        children: loading ? "…" : isSignUp ? "Sign Up" : "Sign In"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    textAlign: "center",
                    marginTop: "1rem",
                    fontSize: "0.9rem"
                },
                children: [
                    isSignUp ? "Already have an account?" : "No account?",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setIsSignUp(!isSignUp);
                            setError("");
                        },
                        style: {
                            color: "#4f46e5",
                            fontWeight: 600,
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                        },
                        children: isSignUp ? "Sign In" : "Sign Up"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
}),
"[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$components$2f$AuthGate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/components/AuthGate.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function HomePage() {
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].getMe().then(setProfile).catch(()=>{});
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$src$2f$components$2f$AuthGate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                textAlign: "center",
                marginTop: "2rem"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    style: {
                        fontSize: "2rem",
                        fontWeight: 700
                    },
                    children: "🚨 Community Alerts"
                }, void 0, false, {
                    fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: "#6b7280",
                        marginTop: "0.5rem"
                    },
                    children: "Crowdsourced incident reporting with real-time alerts"
                }, void 0, false, {
                    fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this),
                profile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        marginTop: "1rem"
                    },
                    children: [
                        "Role: ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: profile.role
                        }, void 0, false, {
                            fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                            lineNumber: 25,
                            columnNumber: 19
                        }, this),
                        " | Threshold:",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: profile.default_threshold
                        }, void 0, false, {
                            fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                            lineNumber: 26,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                    lineNumber: 24,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                        maxWidth: 500,
                        margin: "2rem auto"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/map",
                            className: "card btn-primary btn",
                            style: {
                                justifyContent: "center"
                            },
                            children: "🗺️ Map"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/alerts",
                            className: "card btn-primary btn",
                            style: {
                                justifyContent: "center"
                            },
                            children: "🔔 Alerts"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/report",
                            className: "card btn-primary btn",
                            style: {
                                justifyContent: "center"
                            },
                            children: "📝 Report"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/settings",
                            className: "card btn-primary btn",
                            style: {
                                justifyContent: "center"
                            },
                            children: "⚙️ Settings"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                profile?.role === "admin" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$pearlhacks26$2f$emergency$2d$response$2d$hack$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: "/admin/analytics",
                    className: "btn btn-secondary",
                    children: "📊 Admin Analytics"
                }, void 0, false, {
                    fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
                    lineNumber: 54,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Downloads/pearlhacks26/emergency-response-hack/frontend/src/app/page.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6fb2be01._.js.map