"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProject = void 0;
function getProject(url) {
    return __awaiter(this, void 0, void 0, function () {
        var projectId, scriptUri, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectId = url.split('/').pop();
                    projectId = projectId.split("?")[0];
                    projectId = projectId.split("#")[0];
                    scriptUri = "https://makecode.com/api/".concat(projectId, "/text");
                    return [4 /*yield*/, fetch(scriptUri)];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp.text()];
            }
        });
    });
}
function parseProject(project, url) {
    var text = JSON.parse(project);
    var mainTS = text["main.ts"];
    var name;
    var palette;
    var noseRadius;
    var bodyRadius;
    var legLength;
    mainTS = mainTS.replace(/hourOfAi\._setName\("([^"]+)"\)(?:;?)/g, function (match, captured) {
        name = captured;
        return "";
    });
    mainTS = mainTS.replace(/hourOfAi\._setPalette\(\[([^\]]+)\]\)(?:;?)/g, function (match, captured) {
        palette = captured.split(",").map(function (x) { return parseInt(x.trim()); });
        return "";
    });
    mainTS = mainTS.replace(/hourOfAi\._setBodyRadius\(([^\)]+)\)(?:;?)/g, function (match, captured) {
        bodyRadius = parseInt(captured);
        return "";
    });
    mainTS = mainTS.replace(/hourOfAi\._setNoseRadius\(([^\)]+)\)(?:;?)/g, function (match, captured) {
        noseRadius = parseInt(captured);
        return "";
    });
    mainTS = mainTS.replace(/hourOfAi\._setLegLength\(([^\)]+)\)(?:;?)/g, function (match, captured) {
        legLength = parseInt(captured);
        return "";
    });
    var bug = {
        legLength: legLength || 5,
        bodyRadius: bodyRadius || 5,
        noseRadius: noseRadius || 2,
        colorPalette: palette || [4, 15, 2]
    };
    mainTS = mainTS.replace(/hourOfAi\./gm, "agent.");
    var script = "\n    hourOfAi.registerProject(\n        \"".concat(name || "Unknown", "\",\n        ").concat(JSON.stringify(bug), ",\n        (agent => {\n            ").concat(mainTS, "\n        })\n    );\n    ");
    return {
        url: url,
        name: name,
        bug: bug,
        script: script
    };
}
exports.parseProject = parseProject;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var projects, parsedProjects, _i, projects_1, url, project, parsed, out, _a, parsedProjects_1, project;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    projects = [
                        "https://makecode.com/_4j5JUpPA6Kig",
                        "https://makecode.com/_Yvj7WrU7WEev",
                        "https://makecode.com/_gRYd7sPUsA5m",
                        "https://makecode.com/_M196fjKbtgHs",
                        "https://makecode.com/_g8JT26YRbHUC",
                        "https://makecode.com/_erbTiLPTcKcv",
                        "https://makecode.com/_17bAekJ52R7b",
                        "https://makecode.com/_ayrCekdTaKWb",
                        "https://makecode.com/_A0RUKPPhz4T0"
                    ];
                    parsedProjects = [];
                    _i = 0, projects_1 = projects;
                    _b.label = 1;
                case 1:
                    if (!(_i < projects_1.length)) return [3 /*break*/, 4];
                    url = projects_1[_i];
                    return [4 /*yield*/, getProject(url)];
                case 2:
                    project = _b.sent();
                    parsed = parseProject(project, url);
                    parsedProjects.push(parsed);
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    out = "";
                    for (_a = 0, parsedProjects_1 = parsedProjects; _a < parsedProjects_1.length; _a++) {
                        project = parsedProjects_1[_a];
                        out += "// Project: ".concat(project.name, "\n");
                        out += "// URL: ".concat(project.url, "\n");
                        out += project.script + "\n\n";
                    }
                    out += "hourOfAi.initRunner();\n";
                    console.log(out);
                    return [2 /*return*/];
            }
        });
    });
}
main();
