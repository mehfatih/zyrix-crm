module.exports = [
"[project]/lib/api/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/lib/api/auth.ts'\n\nExpected ',', got ';'");
e.code = 'MODULE_UNPARSABLE';
throw e;
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

//# sourceMappingURL=lib_0h9xe62._.js.map