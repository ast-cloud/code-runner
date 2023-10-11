"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/test', (req, res) => {
    res.send('Hello from test route');
});
app.post('/cpp', (req, res) => {
    fs_1.default.writeFile('./codeFile/code.cpp', req.body.code, function (err) {
        if (err) {
            throw err;
        }
        else {
            console.log('Code file created successfully.');
        }
    });
    fs_1.default.writeFile('./inputFile/input.txt', req.body.input, function (err) {
        if (err) {
            throw err;
        }
        else {
            console.log('Input file created successfully.\n');
        }
    });
    const compileCPPCode = (0, child_process_1.spawn)('g++', ['-o', './codeFile/cppExecutable', './codeFile/code.cpp']);
    compileCPPCode.stderr.on('data', (data) => {
        console.error(`Compilation error from stderr : ${data}`);
        res.status(200).json({ 'Compilation error': data });
    });
    compileCPPCode.on('close', (code) => {
        if (code == 0) {
            console.log('Code compiled successfully : g++ process exited with code ' + code);
            //res.status(200).json({'Code compiled successfully': 'g++ process exited with code '+code});
        }
        else {
            console.log('Compilation error: g++ process exited with code ' + code);
        }
    });
    const runCPPCode = (0, child_process_1.spawn)('./codeFile/cppExecutable');
    const inputFileStream = fs_1.default.createReadStream('./inputFile/input.txt');
    inputFileStream.pipe(runCPPCode.stdin);
    var stdOutData = '';
    runCPPCode.stdout.on('data', function (stdout) {
        console.log('Output from cpp file : ' + stdout);
        stdOutData = stdOutData + String(stdout);
    });
    runCPPCode.on('close', function (code) {
        console.log('Code executed successfully with exit code : ' + code);
        res.status(200).json({ 'Output': String(stdOutData) });
    });
});
const PORT = 3001;
app.listen(PORT, function () { console.log('Server listening on port ' + PORT); });
