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

});


const PORT=3001;
app.listen(PORT, function(){console.log('Server listening on port '+PORT)});