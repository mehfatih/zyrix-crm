module.exports = [
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/lib/auth/token-storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAuth",
    ()=>clearAuth,
    "getAccessToken",
    ()=>getAccessToken,
    "getCompany",
    ()=>getCompany,
    "getRefreshToken",
    ()=>getRefreshToken,
    "getUser",
    ()=>getUser,
    "removeAccessToken",
    ()=>removeAccessToken,
    "removeRefreshToken",
    ()=>removeRefreshToken,
    "setAccessToken",
    ()=>setAccessToken,
    "setCompany",
    ()=>setCompany,
    "setRefreshToken",
    ()=>setRefreshToken,
    "setUser",
    ()=>setUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
"use client";
;
// ============================================================================
// TOKEN STORAGE — Secure localStorage + cookies hybrid
// ============================================================================
// Access token: memory + localStorage (fast access)
// Refresh token: httpOnly cookie is best, but we use secure cookie for MVP
// ============================================================================
const ACCESS_TOKEN_KEY = "zyrix_crm_access_token";
const REFRESH_TOKEN_KEY = "zyrix_crm_refresh_token";
const USER_KEY = "zyrix_crm_user";
const COMPANY_KEY = "zyrix_crm_company";
const COOKIE_OPTIONS = {
    secure: ("TURBOPACK compile-time value", "undefined") !== "undefined" && window.location.protocol === "https:",
    sameSite: "strict",
    expires: 7
};
function setAccessToken(token) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function getAccessToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function removeAccessToken() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function setRefreshToken(token) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set(REFRESH_TOKEN_KEY, token, COOKIE_OPTIONS);
}
function getRefreshToken() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(REFRESH_TOKEN_KEY) || null;
}
function removeRefreshToken() {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove(REFRESH_TOKEN_KEY);
}
function setUser(user) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function getUser() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function setCompany(company) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function getCompany() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function clearAuth() {
    removeAccessToken();
    removeRefreshToken();
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
}),
"[project]/lib/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient,
    "extractErrorMessage",
    ()=>extractErrorMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/token-storage.ts [app-ssr] (ecmascript)");
"use client";
;
;
// ============================================================================
// API CLIENT — Axios instance with auth interceptors
// ============================================================================
const API_URL = ("TURBOPACK compile-time value", "http://localhost:4000") || "http://localhost:4000";
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
});
// ─────────────────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR — Attach access token
// ─────────────────────────────────────────────────────────────────────────
apiClient.interceptors.request.use((config)=>{
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>Promise.reject(error));
// ─────────────────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR — Auto-refresh on 401
// ─────────────────────────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue = [];
function processQueue(token) {
    refreshQueue.forEach((cb)=>cb(token));
    refreshQueue = [];
}
apiClient.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    // Not 401 → reject immediately
    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
        return Promise.reject(error);
    }
    // Already refreshing → queue this request
    if (isRefreshing) {
        return new Promise((resolve, reject)=>{
            refreshQueue.push((token)=>{
                if (token) {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    resolve(apiClient(originalRequest));
                } else {
                    reject(error);
                }
            });
        });
    }
    originalRequest._retry = true;
    isRefreshing = true;
    const refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRefreshToken"])();
    if (!refreshToken) {
        isRefreshing = false;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuth"])();
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return Promise.reject(error);
    }
    try {
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/api/auth/refresh`, {
            refreshToken
        });
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAccessToken"])(newAccessToken);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setRefreshToken"])(newRefreshToken);
        processQueue(newAccessToken);
        if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
    } catch (refreshError) {
        processQueue(null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuth"])();
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return Promise.reject(refreshError);
    } finally{
        isRefreshing = false;
    }
});
function extractErrorMessage(error) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
        const data = error.response?.data;
        if (data?.error?.message) return data.error.message;
        if (error.message === "Network Error") {
            return "Network error. Check your connection.";
        }
        return error.message;
    }
    if (error instanceof Error) return error.message;
    return "An unexpected error occurred";
}
}),
"[project]/lib/api/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logoutApi",
    ()=>logoutApi,
    "meApi",
    ()=>meApi,
    "signinApi",
    ()=>signinApi,
    "signupApi",
    ()=>signupApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/client.ts [app-ssr] (ecmascript)");
"use client";
;
async function signupApi(payload) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post("/api/auth/signup", payload);
    return response.data.data;
}
async function signinApi(payload) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post("/api/auth/signin", payload);
    return response.data.data;
}
async function logoutApi(refreshToken) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post("/api/auth/logout", {
        refreshToken
    });
}
async function meApi() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get("/api/auth/me");
    return response.data.data;
}
}),
"[project]/lib/auth/context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/token-storage.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children, locale = "en" }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUserState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [company, setCompanyState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const loadFromCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const cachedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUser"])();
        const cachedCompany = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCompany"])();
        if (cachedUser) setUserState(cachedUser);
        if (cachedCompany) setCompanyState(cachedCompany);
    }, []);
    const fetchMe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const { user: u, company: c } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["meApi"])();
            setUserState(u);
            setCompanyState(c);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setUser"])(u);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCompany"])(c);
        } catch  {
            // Token expired / invalid → clear
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuth"])();
            setUserState(null);
            setCompanyState(null);
        }
    }, []);
    // On mount, restore session if possible
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadFromCache();
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])();
        if (token) {
            fetchMe().finally(()=>setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [
        fetchMe,
        loadFromCache
    ]);
    // ───────────────────────────────────────────────────────────────────
    // Actions
    // ───────────────────────────────────────────────────────────────────
    const signup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (payload)=>{
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signupApi"])(payload);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAccessToken"])(result.tokens.accessToken);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setRefreshToken"])(result.tokens.refreshToken);
        setUserState(result.user);
        setCompanyState(result.company);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setUser"])(result.user);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCompany"])(result.company);
        router.push(`/${locale}/dashboard`);
    }, [
        locale,
        router
    ]);
    const signin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (payload)=>{
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signinApi"])(payload);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAccessToken"])(result.tokens.accessToken);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setRefreshToken"])(result.tokens.refreshToken);
        setUserState(result.user);
        setCompanyState(result.company);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setUser"])(result.user);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCompany"])(result.company);
        router.push(`/${locale}/dashboard`);
    }, [
        locale,
        router
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRefreshToken"])();
        if (refreshToken) {
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logoutApi"])(refreshToken);
            } catch  {
            // Silent fail — always clear locally
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuth"])();
        setUserState(null);
        setCompanyState(null);
        router.push(`/${locale}/signin`);
    }, [
        locale,
        router
    ]);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        await fetchMe();
    }, [
        fetchMe
    ]);
    const value = {
        user,
        company,
        isAuthenticated: !!user,
        isLoading,
        signup,
        signin,
        logout,
        refresh
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth/context.tsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__02varu6._.js.map