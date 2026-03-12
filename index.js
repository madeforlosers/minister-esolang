const prompt = require("prompt-sync")();
const fs = require("fs");
var list = [];
var ind = 0;
var len = 1;
var localAns = null;
var j;
var loops = [];


code = fs.readFileSync("code.min",{encoding:"utf8"});

parsedCode = code.split(/(\s*\>\s*|\n|;)/g);

function getListSelection(){
    let slList = [];
    for(let n = 0; n<len;n++){
        slList.push(list[n+ind])
    }


    return slList.length == 1?slList[0]:slList
}

var commands = {
    ">":function(){
        return localAns
    },
    "\n":function(){
        return 0
    },
    ";":function(){
        return 0
    },
    "push":function(item = localAns){
        list.push(parseFloat(item));
        return parseFloat(item);
    },
    "ask":function(){
        return parseFloat(prompt(">"));
    },
    "spawn":function(item){
        return parseFloat(item);
    },
    "int":function(item = localAns){
        return parseInt(item);
    },
    "sum":function(){
        if(typeof localAns != "object"){
            return list.reduce((a,c)=>parseFloat(a)+parseFloat(c),0);
        }
        return localAns.reduce((a,c)=>parseFloat(a)+parseFloat(c),0);
    },
    "max":function(){
        if(typeof localAns != "object"){
            return Math.max(...list)
        }
        return Math.max(...localAns)
    },
    "min":function(){
        if(typeof localAns != "object"){
            return Math.min(...list)
        }
        return Math.min(...localAns)
    },
    "add":function(item = 1){
        if(typeof localAns == "object"){
            let slList = [];
            for(x of localAns){
                slList.push(parseFloat(x) + parseFloat(item))
            }
            return slList
        } 

        return parseFloat(localAns) + parseFloat(item);
    },
    "div":function(item = 2){
        if(typeof localAns == "object"){
            let slList = [];
            for(x of localAns){
                slList.push(parseFloat(x) / parseFloat(item))
            }
            return slList
        } 

        return parseFloat(localAns) / parseFloat(item);
    },
    "exp":function(item = 2){
        if(typeof localAns == "object"){
            let slList = [];
            for(x of localAns){
                slList.push(parseFloat(x) ** parseFloat(item))
            }
            return slList
        } 

        return parseFloat(localAns) ** parseFloat(item);
    },
    "mult":function(item = 2){
        if(typeof localAns == "object"){
            let slList = [];
            for(x of localAns){
                slList.push(parseFloat(x) * parseFloat(item))
            }
            return slList
        } 

        return parseFloat(localAns) * parseFloat(item);
    },
    "mod":function(item = 2){
        if(typeof localAns == "object"){
            let slList = [];
            for(x of localAns){
                slList.push(parseFloat(x) % parseFloat(item))
            }
            return slList
        } 

        return parseFloat(localAns) % parseFloat(item);
    },
    "subt":function(item = 1){
        if(typeof localAns == "object"){
            let slList = [];
            for(x of localAns){
                slList.push(parseFloat(x) - parseFloat(item))
            }
            return slList
        } 

        return parseFloat(localAns) - parseFloat(item);
    },
    "grab":function(index=0,length=1){
        ind = parseFloat(index);
        len = parseFloat(length);
        return getListSelection();
    },
    "puts":function(item=localAns){
        console.log(item);
        return item;
    },
    "set":function(index=0,item=localAns){
        let ite = typeof item == "number"?[item]:item;
        for(let i = 0; i < ite.length; i++){
            list[i+parseFloat(index)] = ite[i];
        }
        return ite.length==1?parseFloat(ite[0]):ite;
    },
    "if":function(item = localAns){
        if(!parseFloat(item)){
            let skip = 0;
            for(let hj = j+1; hj < parsedCode.length; hj++){
                p = parsedCode[hj]
                if(p == "if"){
                    skip += 1;
                }
                if(p == "iend" && !skip){
                    j = hj;
                    return 0;
                }
                if(p == "iend" && skip){
                    skip --;
                }
            }
            console.log("WHAT!!! 2");
            process.exit();
        }
        return 0;
    },
    "iend":function(){
        return 0;
    },
    "not":function(item = localAns){
        return !parseFloat(item);
    },
    
    "while":function(index){
        if(!list[index]){
            let skip = 0;
            for(let hj = j+1; hj < parsedCode.length; hj++){
                p = parsedCode[hj]
                if(p == "while"){
                    skip += 1;
                }
                if(p == "wend" && !skip){
                    j = hj;
                    return 0;
                }
                if(p == "wend" && skip){
                    skip --;
                }
            }
            console.log("WHAT!!!");
            process.exit();
        }
        loops.unshift({place:j,va:index});
        return 0;
    },
    "wend":function(){
        if(parseFloat(list[loops[0].va]) != 0){
            j = loops[0].place+1;
            return 0;
        }else{
            loops.shift();
            return 0;
        }
    }
}
var vars = {
    "L":(x)=>list.length,
}


for(j = 0; j < parsedCode.length; j++){
    let x = parsedCode[j]
    let spl = x.split(" ");
    let com = spl[0];
    let arg = spl.length==1?[]:spl[1].split(",");
    for(let h = 0; h < arg.length; h++){
        if(arg[h].match(/[a-zA-Z]/g) != null){
            sp = 0;
          if(arg[h].match(/\-?[0-9]+/g) != null){
             sp = parseFloat(arg[h].match(/\-?[0-9]+/g)[0])
            }
            if(arg[h].match(/\+?[0-9]+/g) != null){
             sp = parseFloat(arg[h].match(/[0-9]+/g)[0])
            }
            arg[h] = vars[arg[h].match(/[a-zA-Z]/g)[0]]() + sp;
            
            
        }
        
        if(typeof arg[h] == "string" && arg[h].charAt(0) == "$"){
            arg[h] = list[parseFloat(arg[h].split("$")[1])]
        }
    }
   //console.log("running: \""+com+"\"("+arg)
    localAns = commands[com](...arg);
       // console.log("localAns "+localAns)

    
}



