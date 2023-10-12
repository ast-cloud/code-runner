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
        res.json({'Compilation error':String(compileResult.error.message)});
        return;
    }
    else if(compileResult.status===null){
        res.json({'Compilation error':String(compileResult.stderr)});
        return;
    }
    console.log('Code compiled successfully : g++ process exited with code '+compileResult.status);

    const runCPPCodeResult = spawnSync('./codeFile/cppExecutable', {input: fssync.readFileSync('./inputFile/input.txt'), encoding: 'utf-8'});

    if(runCPPCodeResult.error){
        res.json({'Runtime error':String(runCPPCodeResult.error.message)});
        return;
    }
    else if(runCPPCodeResult.status===null){
        res.json({'Runtime error':String(runCPPCodeResult.stderr)});
        return;
    }
    res.status(200).json({'Output': String(runCPPCodeResult.stdout)});

    //var result = await compileCPPCode();    


    // try{

    //     const runCPPCode = spawn('./codeFile/cppExecutable');
        
    //     const inputFileStream = fssync.createReadStream('./inputFile/input.txt');
        
    //     inputFileStream.pipe(runCPPCode.stdin);
        
    //     var stdOutData = '';
    //     runCPPCode.stdout.on('data',function(stdout){
    //         console.log('Output from cpp file : '+stdout);
    //         stdOutData = stdOutData + String(stdout);
    //     });
        
    //     runCPPCode.on('close', function(code){
    //         console.log('Code executed successfully with exit code : '+code);
    //         res.status(200).json({'Output': String(stdOutData)});
    //     });

    // }catch(e){
    //     console.error('Error caught in binary execution process: '+e);
    // }

});

// async function compileCPPCode(){
//     try{
//         const compilation = spawn('g++', ['-o', './codeFile/cppExecutable', './codeFile/code.cpp']);

//         var errorMessage = '';

//         compilation.stderr.on('data', (data) => {
//                 console.error(`Compilation error from stderr : ${data}`);
//                 errorMessage=errorMessage+String(data);        
//             }
//         );
        
//         compilation.on('close', (code)=>{
//                 if(code==0){
//                     console.log('Code compiled successfully : g++ process exited with code '+code);
//                     return {
//                         compiled: true,
//                         message: 'Code compiled successfully'
//                     }
//                 }
//                 else{
//                     console.log('Compilation error: '+errorMessage+' g++ process exited with code '+code);
//                     return {
//                         compiled: false,
//                         message: String(errorMessage)
//                     }
//                 }
//             }
//         );

//     }catch(e){
//         console.error('Error caught in compilation process: '+e);
//     }
// }

const PORT=3001;
app.listen(PORT, function(){console.log('Server listening on port '+PORT)});