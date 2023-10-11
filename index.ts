import express from 'express';
import cors from 'cors';
import fs from 'fs';
import {spawn} from 'child_process';

const app = express();

app.use(cors());
app.use(express.json());


app.get('/test',(req,res)=>{
    res.send('Hello from test route');
})

app.post('/cpp', (req, res)=>{


    fs.writeFile('./codeFile/code.cpp', req.body.code, function(err){
        if(err){
            throw err;
        }
        else{
            console.log('Code file created successfully.')
        }
    });

    fs.writeFile('./inputFile/input.txt', req.body.input, function(err){
        if(err){
            throw err;
        }
        else{
            console.log('Input file created successfully.\n');
        }
    });

    const compileCPPCode = spawn('g++', ['-o', './codeFile/cppExecutable', './codeFile/code.cpp']);

    compileCPPCode.stderr.on('data', (data) => {
            console.error(`Compilation error from stderr : ${data}`);
            res.status(200).json({'Compilation error': data});
        }
    );

    compileCPPCode.on('close', (code)=>{
            if(code==0){
                console.log('Code compiled successfully : g++ process exited with code '+code);
                //res.status(200).json({'Code compiled successfully': 'g++ process exited with code '+code});
            }
            else{
                console.log('Compilation error: g++ process exited with code '+code);
            }
        }
    );

    const runCPPCode = spawn('./codeFile/cppExecutable');

    const inputFileStream = fs.createReadStream('./inputFile/input.txt');

    inputFileStream.pipe(runCPPCode.stdin);

    var stdOutData = '';
    runCPPCode.stdout.on('data',function(stdout){
        console.log('Output from cpp file : '+stdout);
        stdOutData = stdOutData + String(stdout);
    });

    runCPPCode.on('close', function(code){
        console.log('Code executed successfully with exit code : '+code);
        res.status(200).json({'Output': String(stdOutData)});
    });

});

const PORT=3001;
app.listen(PORT, function(){console.log('Server listening on port '+PORT)});