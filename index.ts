import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import fssync from 'fs';
import {spawn, spawnSync} from 'child_process';

const app = express();

app.use(cors());
app.use(express.json());


app.get('/test',(req,res)=>{
    res.send('Hello from test route');
})

app.post('/c', async (req, res)=>{


    try{
        await fs.writeFile('./codeFile/code.c', req.body.code);
        console.log('Code file created successfully.')
    }catch(e){
        throw e;
    }

    try{
        await fs.writeFile('./inputFile/input.txt', req.body.input);
        console.log('Input file created successfully.')
    }catch(e){
        throw e;
    }


    const compileResult = spawnSync('gcc', ['-o', './codeFile/cExecutable', './codeFile/code.c']);

    if(compileResult.error){
        res.json({'error':'Compilation error', 'output':String(compileResult.error.message)});
        return;
    }
    else if(compileResult.status===null){
        res.json({'error':'Compilation error', 'output':String(compileResult.stderr)});
        return;
    }
    else if(compileResult.status!=0){
        res.json({'error':'Compilation error', 'output':String(compileResult.stderr)});
        return;
    }
    console.log('Code compiled successfully : gcc process exited with code '+compileResult.status);
    
    const runCCodeResult = spawnSync('./codeFile/cExecutable', {input: fssync.readFileSync('./inputFile/input.txt'), encoding: 'utf-8'});
    
    if(runCCodeResult.error){
        res.json({'error':'Runtime error', 'output':String(runCCodeResult.error.message)});
        return;
    }
    else if(runCCodeResult.status===null){
        res.json({'error':'Runtime error', 'output':String(runCCodeResult.stderr)});
        return;
    }
    res.status(200).json({'error':'none', 'output': String(runCCodeResult.stdout)});

    try {
        fssync.unlinkSync('./codeFile/code.c');
        console.log(`File ./codeFile/code.c deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fssync.unlinkSync('./codeFile/cExecutable');
        console.log(`File ./codeFile/cExecutable deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fssync.unlinkSync('./inputFile/input.txt');
        console.log(`File ./inputFile/input.txt deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    

});

app.post('/cpp', async (req, res)=>{


    try{
        await fs.writeFile('./codeFile/code.cpp', req.body.code);
        console.log('Code file created successfully.')
    }catch(e){
        throw e;
    }

    try{
        await fs.writeFile('./inputFile/input.txt', req.body.input);
        console.log('Input file created successfully.')
    }catch(e){
        throw e;
    }
    

    const compileResult = spawnSync('g++', ['-o', './codeFile/cppExecutable', './codeFile/code.cpp']);

    if(compileResult.error){
        res.json({'error':'Compilation error', 'output':String(compileResult.error.message)});
        return;
    }
    else if(compileResult.status===null){
        res.json({'error':'Compilation error', 'output':String(compileResult.stderr)});
        return;
    }
    else if(compileResult.status!=0){
        res.json({'error':'Compilation error', 'output':String(compileResult.stderr)});
        return;
    }
    console.log('Code compiled successfully : g++ process exited with code '+compileResult.status);

    const runCPPCodeResult = spawnSync('./codeFile/cppExecutable', {input: fssync.readFileSync('./inputFile/input.txt'), encoding: 'utf-8'});

    if(runCPPCodeResult.error){
        res.json({'error':'Runtime error', 'output':String(runCPPCodeResult.error.message)});
        return;
    }
    else if(runCPPCodeResult.status===null){
        res.json({'error':'Runtime error', 'output':String(runCPPCodeResult.stderr)});
        return;
    }
    res.status(200).json({'error':'none', 'output': String(runCPPCodeResult.stdout)});

    try {
        fssync.unlinkSync('./codeFile/code.cpp');
        console.log(`File ./codeFile/code.cpp deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fssync.unlinkSync('./codeFile/cppExecutable');
        console.log(`File ./codeFile/cppExecutable deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fssync.unlinkSync('./inputFile/input.txt');
        console.log(`File ./inputFile/input.txt deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }

});

app.post('/java', async (req, res)=>{


    try{
        await fs.writeFile('./code.java', req.body.code);
        console.log('Code file created successfully.')
    }catch(e){
        throw e;
    }

    try{
        await fs.writeFile('./inputFile/input.txt', req.body.input);
        console.log('Input file created successfully.')
    }catch(e){
        throw e;
    }
    

    const compileResult = spawnSync('javac', ['./code.java']);

    if(compileResult.error){
        res.json({'error':'Compilation error', 'output':String(compileResult.error.message)});
        return;
    }
    else if(compileResult.status===null){
        res.json({'error':'Compilation error', 'output':String(compileResult.stderr)});
        return;
    }
    else if(compileResult.status!=0){
        res.json({'error':'Compilation error', 'output':String(compileResult.stderr)});
        return;
    }
    console.log('Code compiled successfully : javac process exited with code '+compileResult.status);

    const runJavaCodeResult = spawnSync('java', ['Codetown'], {input: fssync.readFileSync('./inputFile/input.txt'), encoding: 'utf-8'});

    if(runJavaCodeResult.error){
        res.json({'error':'Runtime error', 'output':String(runJavaCodeResult.error.message)});
        return;
    }
    else if(runJavaCodeResult.status===null){
        res.json({'error':'Runtime error', 'output':String(runJavaCodeResult.stderr)});
        return;
    }
    else if(runJavaCodeResult.status!=0){
        res.json({'error':'Compilation error', 'output':String(compileResult.stderr)});
        return;
    }
    res.status(200).json({'error':'none', 'output': String(runJavaCodeResult.stdout)});

    try {
        fssync.unlinkSync('./code.java');
        console.log(`File ./code.java deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fssync.unlinkSync('./Codetown.class');
        console.log(`File ./Codetown.class deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fssync.unlinkSync('./inputFile/input.txt');
        console.log(`File ./inputFile/input.txt deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }

});

app.post('/python', async (req, res)=>{


    try{
        await fs.writeFile('./codeFile/code.py', req.body.code);
        console.log('Code file created successfully.')
    }catch(e){
        throw e;
    }

    try{
        await fs.writeFile('./inputFile/input.txt', req.body.input);
        console.log('Input file created successfully.')
    }catch(e){
        throw e;
    }
    

    const runPyCodeResult = spawnSync('python3', ['./codeFile/code.py'], {input: fssync.readFileSync('./inputFile/input.txt'), encoding:'utf-8'});
    
    if(runPyCodeResult.error){
        res.json({'error':'Runtime error', 'output':String(runPyCodeResult.error.message)});
        return;
    }
    else if(runPyCodeResult.status===null){
        res.json({'error':'Runtime error', 'output':String(runPyCodeResult.stderr)});
        return;
    }
    res.status(200).json({'error':'none', 'output': String(runPyCodeResult.stdout)});

    try {
        fssync.unlinkSync('./codeFile/code.py');
        console.log(`File ./codeFile/code.py deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }
    try {
        fssync.unlinkSync('./inputFile/input.txt');
        console.log(`File ./inputFile/input.txt deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting the file: ${err}`);
    }

});

const PORT=3001;
app.listen(PORT, function(){console.log('Server listening on port '+PORT)});