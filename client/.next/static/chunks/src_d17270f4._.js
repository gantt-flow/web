(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/ui/DataTable.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "DataTable": ()=>DataTable
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const DataTable = (param)=>{
    let { columns, data, onEdit, onDelete, isLoading = false } = param;
    if (isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Cargando..."
    }, void 0, false, {
        fileName: "[project]/src/components/ui/DataTable.tsx",
        lineNumber: 24,
        columnNumber: 25
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-x-auto bg-white rounded-lg shadow",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "min-w-full divide-y divide-gray-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                    className: "bg-gray-50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                        children: [
                            columns.map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    scope: "col",
                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ".concat(column.width || ''),
                                    children: column.header
                                }, column.key, false, {
                                    fileName: "[project]/src/components/ui/DataTable.tsx",
                                    lineNumber: 32,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))),
                            (onEdit || onDelete) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                scope: "col",
                                className: "px-6 py-3 text-right",
                                children: "Acciones"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/DataTable.tsx",
                                lineNumber: 41,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/DataTable.tsx",
                        lineNumber: 30,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/DataTable.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                    className: "bg-white divide-y divide-gray-200",
                    children: data.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            className: "hover:bg-gray-50",
                            children: [
                                columns.map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                                        children: item[column.key]
                                    }, "".concat(index, "-").concat(column.key), false, {
                                        fileName: "[project]/src/components/ui/DataTable.tsx",
                                        lineNumber: 51,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))),
                                (onEdit || onDelete) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
                                    children: [
                                        onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onEdit(item._id || item.id),
                                            className: "mr-3 text-indigo-600 hover:text-indigo-900",
                                            children: "Editar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/DataTable.tsx",
                                            lineNumber: 61,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        onDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onDelete(item._id || item.id),
                                            className: "text-red-600 hover:text-red-900",
                                            children: "Eliminar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/DataTable.tsx",
                                            lineNumber: 69,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/DataTable.tsx",
                                    lineNumber: 59,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, index, true, {
                            fileName: "[project]/src/components/ui/DataTable.tsx",
                            lineNumber: 49,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/DataTable.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/DataTable.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/DataTable.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = DataTable;
var _c;
__turbopack_context__.k.register(_c, "DataTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/services/api.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
'use client';
;
// Variable definida en .env.local
const baseURL = ("TURBOPACK compile-time value", "http://localhost:8080");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
// Crea una instancia de Axios con una configuración base
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/services/userService.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createUser": ()=>createUser,
    "deleteUser": ()=>deleteUser,
    "getAllUsers": ()=>getAllUsers,
    "getUserById": ()=>getUserById,
    "updateUser": ()=>updateUser
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.tsx [app-client] (ecmascript)");
;
const getAllUsers = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/users');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        throw error;
    }
};
const getUserById = async (userId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/users/".concat(userId));
        return response.data;
    } catch (error) {
        console.error("Error al obtener el usuario ".concat(userId, ":"), error);
        throw error;
    }
};
const createUser = async (newUser)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/users', newUser);
        return response.data;
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        throw error;
    }
};
const updateUser = async (userId, userData)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put("/users/".concat(userId), userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user ".concat(userId, ":"), error);
        throw error;
    }
};
const deleteUser = async (userId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete("/users/".concat(userId));
    } catch (error) {
        console.error("Error deleting user ".concat(userId, ":"), error);
        throw error;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/usuarios/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>DashboardLayoutAdmin
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DataTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/DataTable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$userService$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/userService.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function DashboardLayoutAdmin() {
    _s();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Fetch users al cargar el componente
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardLayoutAdmin.useEffect": ()=>{
            const fetchUsers = {
                "DashboardLayoutAdmin.useEffect.fetchUsers": async ()=>{
                    try {
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$userService$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllUsers"])();
                        setUsers(data);
                    } catch (error) {
                        console.error('Error fetching users:', error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["DashboardLayoutAdmin.useEffect.fetchUsers"];
            fetchUsers();
        }
    }["DashboardLayoutAdmin.useEffect"], []);
    // Handler para eliminar usuario
    const handleDelete = async (userId)=>{
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$userService$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteUser"])(userId);
            setUsers(users.filter((user)=>user._id !== userId));
        }
    };
    // Columnas de la tabla
    const userColumns = [
        {
            key: 'name',
            header: 'Nombre',
            width: 'w-1/4'
        },
        {
            key: 'email',
            header: 'Email',
            width: 'w-1/4'
        },
        {
            key: 'role',
            header: 'Rol',
            width: 'w-1/4'
        },
        {
            key: 'isActive',
            header: 'Estado',
            width: 'w-1/4',
            render: (value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "px-2 py-1 rounded-full text-xs ".concat(value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'),
                    children: value ? 'Activo' : 'Inactivo'
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/usuarios/page.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-row min-h-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 p-8 bg-gray-50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-gray-800",
                            children: "Gestión de Usuarios"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/usuarios/page.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700",
                            children: "+ Nuevo Usuario"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/usuarios/page.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/usuarios/page.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$DataTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTable"], {
                        columns: userColumns,
                        data: users,
                        onEdit: (id)=>console.log('Editar:', id),
                        onDelete: handleDelete,
                        isLoading: isLoading
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/usuarios/page.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/usuarios/page.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/admin/usuarios/page.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/usuarios/page.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(DashboardLayoutAdmin, "KXpXZobL5EyUkGdAyx9t3BruyJg=");
_c = DashboardLayoutAdmin;
var _c;
__turbopack_context__.k.register(_c, "DashboardLayoutAdmin");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_d17270f4._.js.map