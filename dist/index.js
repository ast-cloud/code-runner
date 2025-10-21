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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/test', (req, res) => {
    res.send('Hello from test route');
});
app.post('/c', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.writeFile('./codeFile/code.c', req.body.code);
        console.log('Code file created successfully.');
    }
    catch (e) {
        console.error('Error writing code file:', e);
        return;
    }
    try {
        yield promises_1.default.writeFile('./inputFile/input.txt', req.body.input);
        console.log('Input file created successfully.');
    }
    catch (e) {
        console.error('Error writing input file:', e);
        return;
    }
    const compileResult = (0, child_process_1.spawnSync)('gcc', ['-o', './codeFile/cExecutable', './codeFile/code.c']);
    if (compileResult.error) {
        res.json({ 'error': 'Compilation error', 'output': String(compileResult.error.message) });
        return;
    }
    else if (compileResult.status === null) {
        res.json({ 'error': 'Compilation error', 'output': String(compileResult.stderr) });
        return;
    }
    else if (compileResult.status != 0) {
        res.json({ 'error': 'Compilation error', 'output': String(compileResult.stderr) });
        return;
    }
    console.log('Code compiled successfully : gcc process exited with code ' + compileResult.status);
    const runCCodeResult = (0, child_process_1.spawnSync)('./codeFile/cExecutable < ./inputFile/input.txt', { encoding: 'utf-8', shell: true });
    if (runCCodeResult.error) {
        res.json({ 'error': 'Runtime error', 'output': String(runCCodeResult.error.message) });
        return;
    }
    else if (runCCodeResult.status === null) {
        res.json({ 'error': 'Runtime error', 'output': String(runCCodeResult.stderr) });
        return;
    }
    res.status(200).json({ 'error': 'none', 'output': String(runCCodeResult.stdout) });
    try {
        fs_1.default.unlinkSync('./codeFile/code.c');
        console.log(`File ./codeFile/code.c deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fs_1.default.unlinkSync('./codeFile/cExecutable');
        console.log(`File ./codeFile/cExecutable deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fs_1.default.unlinkSync('./inputFile/input.txt');
        console.log(`File ./inputFile/input.txt deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
}));
app.post('/cpp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.writeFile('./codeFile/code.cpp', req.body.code);
        console.log('Code file created successfully.');
    }
    catch (e) {
        console.error('Error writing code file:', e);
        return;
    }
    try {
        yield promises_1.default.writeFile('./inputFile/input.txt', req.body.input);
        console.log('Input file created successfully.');
    }
    catch (e) {
        console.error('Error writing input file:', e);
        return;
    }
    const compileResult = (0, child_process_1.spawnSync)('g++', ['-o', './codeFile/cppExecutable', './codeFile/code.cpp']);
    if (compileResult.error) {
        res.json({ 'error': 'Compilation error', 'output': String(compileResult.error.message) });
        return;
    }
    else if (compileResult.status === null) {
        res.json({ 'error': 'Compilation error', 'output': String(compileResult.stderr) });
        return;
    }
    else if (compileResult.status != 0) {
        res.json({ 'error': 'Compilation error', 'output': String(compileResult.stderr) });
        return;
    }
    console.log('Code compiled successfully : g++ process exited with code ' + compileResult.status);
    const runCPPCodeResult = (0, child_process_1.spawnSync)('./codeFile/cppExecutable < ./inputFile/input.txt', { encoding: 'utf-8', shell: true });
    console.log(' runCPPCodeResult.output - ', runCPPCodeResult.output);
    if (runCPPCodeResult.error) {
        res.json({ 'error': 'Runtime error', 'output': String(runCPPCodeResult.error.message) });
        return;
    }
    else if (runCPPCodeResult.status === null) {
        res.json({ 'error': 'Runtime error', 'output': String(runCPPCodeResult.stderr) });
        return;
    }
    else if (runCPPCodeResult.status != 0) {
        res.json({ 'error': 'Runtime error', 'output': String(runCPPCodeResult.stderr) });
        return;
    }
    res.status(200).json({ 'error': 'none', 'output': String(runCPPCodeResult.stdout) });
    try {
        fs_1.default.unlinkSync('./codeFile/code.cpp');
        console.log(`File ./codeFile/code.cpp deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fs_1.default.unlinkSync('./codeFile/cppExecutable');
        console.log(`File ./codeFile/cppExecutable deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fs_1.default.unlinkSync('./inputFile/input.txt');
        console.log(`File ./inputFile/input.txt deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
}));
app.post('/java', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.writeFile('./code.java', req.body.code);
        console.log('Code file created successfully.');
    }
    catch (e) {
        console.error('Error writing code file:', e);
        return;
    }
    try {
        yield promises_1.default.writeFile('./inputFile/input.txt', req.body.input);
        console.log('Input file created successfully.');
    }
    catch (e) {
        console.error('Error writing input file:', e);
        return;
    }
    const compileResult = (0, child_process_1.spawnSync)('javac', ['./code.java']);
    if (compileResult.error) {
        res.json({ 'error': 'Compilation error', 'output': String(compileResult.error.message) });
        return;
    }
    else if (compileResult.status === null) {
        res.json({ 'error': 'Compilation error', 'output': String(compileResult.stderr) });
        return;
    }
    else if (compileResult.status != 0) {
        res.json({ 'error': 'Compilation error', 'output': String(compileResult.stderr) });
        return;
    }
    console.log('Code compiled successfully : javac process exited with code ' + compileResult.status);
    const runJavaCodeResult = (0, child_process_1.spawnSync)('java Codetown < ./inputFile/input.txt', { encoding: 'utf-8', shell: true });
    if (runJavaCodeResult.error) {
        res.json({ 'error': 'Runtime error', 'output': String(runJavaCodeResult.error.message) });
        return;
    }
    else if (runJavaCodeResult.status === null) {
        res.json({ 'error': 'Runtime error', 'output': String(runJavaCodeResult.stderr) });
        return;
    }
    else if (runJavaCodeResult.status != 0) {
        res.json({ 'error': 'Runtime error', 'output': String(runJavaCodeResult.stderr) });
        return;
    }
    res.status(200).json({ 'error': 'none', 'output': String(runJavaCodeResult.stdout) });
    try {
        fs_1.default.unlinkSync('./code.java');
        console.log(`File ./code.java deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fs_1.default.unlinkSync('./Codetown.class');
        console.log(`File ./Codetown.class deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fs_1.default.unlinkSync('./inputFile/input.txt');
        console.log(`File ./inputFile/input.txt deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
}));
app.post('/python', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.writeFile('./codeFile/code.py', req.body.code);
        console.log('Code file created successfully.');
    }
    catch (e) {
        console.error('Error writing code file:', e);
        return;
    }
    try {
        yield promises_1.default.writeFile('./inputFile/input.txt', req.body.input);
        console.log('Input file created successfully.');
    }
    catch (e) {
        console.error('Error writing input file:', e);
        return;
    }
    const runPyCodeResult = (0, child_process_1.spawnSync)('python3 ./codeFile/code.py < ./inputFile/input.txt', { encoding: 'utf-8', shell: true });
    if (runPyCodeResult.error) {
        res.json({ 'error': 'Runtime error', 'output': String(runPyCodeResult.error.message) });
        return;
    }
    else if (runPyCodeResult.status === null) {
        res.json({ 'error': 'Runtime error', 'output': String(runPyCodeResult.stderr) });
        return;
    }
    else if (runPyCodeResult.status != 0) {
        res.json({ 'error': 'Compilation error', 'output': String(runPyCodeResult.stderr) });
        return;
    }
    res.status(200).json({ 'error': 'none', 'output': String(runPyCodeResult.stdout) });
    try {
        fs_1.default.unlinkSync('./codeFile/code.py');
        console.log(`File ./codeFile/code.py deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fs_1.default.unlinkSync('./inputFile/input.txt');
        console.log(`File ./inputFile/input.txt deleted successfully.`);
    }
    catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
}));
const PORT = 3001;
app.listen(PORT, function () { console.log('Server listening on port ' + PORT); });
