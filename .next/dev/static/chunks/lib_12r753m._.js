(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api/auth.ts [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/lib/api/auth.ts'\n\nExpected ',', got ';'");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/lib/auth/token-storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
"use client";
;
;
// ============================================================================
// TOKEN STORAGE — Secure localStorage + cookies hybrid
// ============================================================================
// Access token: memory + localStorage (fast access)
// Refresh token: httpOnly cookie is best, but we use secure cookie for MVP
// ============================================================================
var ACCESS_TOKEN_KEY = "zyrix_crm_access_token";
var REFRESH_TOKEN_KEY = "zyrix_crm_refresh_token";
var USER_KEY = "zyrix_crm_user";
var COMPANY_KEY = "zyrix_crm_company";
var COOKIE_OPTIONS = {
    secure: ("TURBOPACK compile-time value", "object") !== "undefined" && window.location.protocol === "https:",
    sameSite: "strict",
    expires: 7
};
function setAccessToken(token) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (unused) {
    // localStorage blocked (private mode)
    }
}
function getAccessToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (unused) {
        return null;
    }
}
function removeAccessToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch (unused) {
    // Silent fail
    }
}
function setRefreshToken(token) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set(REFRESH_TOKEN_KEY, token, COOKIE_OPTIONS);
}
function getRefreshToken() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(REFRESH_TOKEN_KEY) || null;
}
function removeRefreshToken() {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove(REFRESH_TOKEN_KEY);
}
function setUser(user) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (unused) {
    // Silent fail
    }
}
function getUser() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        var stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (unused) {
        return null;
    }
}
function setCompany(company) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
    } catch (unused) {
    // Silent fail
    }
}
function getCompany() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        var stored = localStorage.getItem(COMPANY_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (unused) {
        return null;
    }
}
function clearAuth() {
    removeAccessToken();
    removeRefreshToken();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(COMPANY_KEY);
    } catch (unused) {
    // Silent fail
    }
}
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/auth/context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/token-storage.ts [app-client] (ecmascript)");
;
;
;
;
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
var AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider(param) {
    var children = param.children, _param_locale = param.locale, locale = _param_locale === void 0 ? "en" : _param_locale;
    _s();
    var router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), 2), user = _useState[0], setUserState = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), 2), company = _useState1[0], setCompanyState = _useState1[1];
    var _useState2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true), 2), isLoading = _useState2[0], setIsLoading = _useState2[1];
    var loadFromCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[loadFromCache]": function() {
            var cachedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUser"])();
            var cachedCompany = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCompany"])();
            if (cachedUser) setUserState(cachedUser);
            if (cachedCompany) setCompanyState(cachedCompany);
        }
    }["AuthProvider.useCallback[loadFromCache]"], []);
    var fetchMe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[fetchMe]": function() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                "AuthProvider.useCallback[fetchMe]": function() {
                    var _ref, u, c, unused;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                        "AuthProvider.useCallback[fetchMe]": function(_state) {
                            switch(_state.label){
                                case 0:
                                    _state.trys.push([
                                        0,
                                        2,
                                        ,
                                        3
                                    ]);
                                    return [
                                        4,
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["meApi"])()
                                    ];
                                case 1:
                                    _ref = _state.sent(), u = _ref.user, c = _ref.company;
                                    setUserState(u);
                                    setCompanyState(c);
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setUser"])(u);
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCompany"])(c);
                                    return [
                                        3,
                                        3
                                    ];
                                case 2:
                                    unused = _state.sent();
                                    // Token expired / invalid → clear
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuth"])();
                                    setUserState(null);
                                    setCompanyState(null);
                                    return [
                                        3,
                                        3
                                    ];
                                case 3:
                                    return [
                                        2
                                    ];
                            }
                        }
                    }["AuthProvider.useCallback[fetchMe]"]);
                }
            }["AuthProvider.useCallback[fetchMe]"])();
        }
    }["AuthProvider.useCallback[fetchMe]"], []);
    // On mount, restore session if possible
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": function() {
            loadFromCache();
            var token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])();
            if (token) {
                fetchMe().finally({
                    "AuthProvider.useEffect": function() {
                        return setIsLoading(false);
                    }
                }["AuthProvider.useEffect"]);
            } else {
                setIsLoading(false);
            }
        }
    }["AuthProvider.useEffect"], [
        fetchMe,
        loadFromCache
    ]);
    // ───────────────────────────────────────────────────────────────────
    // Actions
    // ───────────────────────────────────────────────────────────────────
    var signup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[signup]": function(payload) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                "AuthProvider.useCallback[signup]": function() {
                    var result;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                        "AuthProvider.useCallback[signup]": function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signupApi"])(payload)
                                    ];
                                case 1:
                                    result = _state.sent();
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(result.tokens.accessToken);
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRefreshToken"])(result.tokens.refreshToken);
                                    setUserState(result.user);
                                    setCompanyState(result.company);
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setUser"])(result.user);
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCompany"])(result.company);
                                    router.push("/".concat(locale, "/dashboard"));
                                    return [
                                        2
                                    ];
                            }
                        }
                    }["AuthProvider.useCallback[signup]"]);
                }
            }["AuthProvider.useCallback[signup]"])();
        }
    }["AuthProvider.useCallback[signup]"], [
        locale,
        router
    ]);
    var signin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[signin]": function(payload) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                "AuthProvider.useCallback[signin]": function() {
                    var result;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                        "AuthProvider.useCallback[signin]": function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signinApi"])(payload)
                                    ];
                                case 1:
                                    result = _state.sent();
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(result.tokens.accessToken);
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRefreshToken"])(result.tokens.refreshToken);
                                    setUserState(result.user);
                                    setCompanyState(result.company);
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setUser"])(result.user);
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCompany"])(result.company);
                                    router.push("/".concat(locale, "/dashboard"));
                                    return [
                                        2
                                    ];
                            }
                        }
                    }["AuthProvider.useCallback[signin]"]);
                }
            }["AuthProvider.useCallback[signin]"])();
        }
    }["AuthProvider.useCallback[signin]"], [
        locale,
        router
    ]);
    var logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": function() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                "AuthProvider.useCallback[logout]": function() {
                    var refreshToken, unused;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                        "AuthProvider.useCallback[logout]": function(_state) {
                            switch(_state.label){
                                case 0:
                                    refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRefreshToken"])();
                                    if (!refreshToken) return [
                                        3,
                                        4
                                    ];
                                    _state.label = 1;
                                case 1:
                                    _state.trys.push([
                                        1,
                                        3,
                                        ,
                                        4
                                    ]);
                                    return [
                                        4,
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutApi"])(refreshToken)
                                    ];
                                case 2:
                                    _state.sent();
                                    return [
                                        3,
                                        4
                                    ];
                                case 3:
                                    unused = _state.sent();
                                    return [
                                        3,
                                        4
                                    ];
                                case 4:
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuth"])();
                                    setUserState(null);
                                    setCompanyState(null);
                                    router.push("/".concat(locale, "/signin"));
                                    return [
                                        2
                                    ];
                            }
                        }
                    }["AuthProvider.useCallback[logout]"]);
                }
            }["AuthProvider.useCallback[logout]"])();
        }
    }["AuthProvider.useCallback[logout]"], [
        locale,
        router
    ]);
    var refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[refresh]": function() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])({
                "AuthProvider.useCallback[refresh]": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                        "AuthProvider.useCallback[refresh]": function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        fetchMe()
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        }
                    }["AuthProvider.useCallback[refresh]"]);
                }
            }["AuthProvider.useCallback[refresh]"])();
        }
    }["AuthProvider.useCallback[refresh]"], [
        fetchMe
    ]);
    var value = {
        user: user,
        company: company,
        isAuthenticated: !!user,
        isLoading: isLoading,
        signup: signup,
        signin: signin,
        logout: logout,
        refresh: refresh
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth/context.tsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "7watnWszmVs3E96KXvWq76wzSvE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    var ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_12r753m._.js.map