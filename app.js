const ethereumButton = document.getElementById('connectMeta');
const showAccount = document.querySelector('.showAccount');
const createAccount = document.querySelector('.createAccount');
const formCreate = document.getElementById('from');
const myAccount = document.getElementById('name')
const username = document.getElementById('username')
const createBtn = document.getElementById('createBtn');
const aboutAccount = document.getElementById('aboutAccount');
const formControl = document.querySelector('.form-control');
const nameAccount = document.getElementById('nameAccount');
const balanceAcc = document.getElementById('balanceAcc')

// form control
const accessContract = document.querySelector('.accessContract')
const nameAcc = document.querySelector('.nameAcc');
const transferBtn = document.querySelector('.transfer');
const withdrawBtn = document.querySelector('.withdraw')
const depositBtn = document.querySelector('.deposit')

// for show and hide when click
const depositConsole = document.querySelector('.depositConsole')
const transferConsole = document.querySelector('.transferConsole')
const withdrawConsole = document.querySelector('.withdrawConsole')


// for deposit
const depositToCon = document.getElementById('depositToCon'); 
const depositIn = document.getElementById('depositIn'); // value

// for withdraw
const withdrawBack = document.getElementById('withdrawBack')
const withdrawOut = document.getElementById('withdrawOut'); // value

// for transfer
// to submit Account
// 
const submitAdd = document.getElementById('submitAdd'); 
const addressTo = document.getElementById('addressTo'); // address
// to trannsfer 
const transferTo = document.getElementById('transferTo');
const transferOut = document.getElementById('transferOut'); // value

// hide when use console
const depo = document.querySelector('.depo')
const depoBack = document.querySelector('.depoBack')
const withda = document.querySelector('.withda')
const withBack = document.querySelector('.withBack')
const tran = document.querySelector('.tran')
const tranBack = document.querySelector('.tranBack')

// create accoutn 
const createYBC = document.querySelector('createYBC');
const backMyAc = document.querySelector('.backMyAc');

let nameShow;
let currentAddress;
let network;
let signer;
let balance;

// in transfer console
let depositAmount;
let withdrawAmount;

let AddressSend;
let transferAmount;

const lastAll = "0x6079460CC55909fBbd538aB97D54a03390a405f5";

async function getLogin(){
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner()

    // currentAddress = await signer.getSigner();
    
    currentAddress = await signer.getAddress()
    // network. = await provider.getNetWork()
    network = await provider.getNetwork()
    console.log(network);
    console.log(currentAddress);

    // show switch account page is reload
    window.ethereum.on('accountsChanged', (accounts) => {
        window.location.reload();
    });

    // show when switch network page is reload
    window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
    });
}


// when click is connect 
ethereumButton.addEventListener('click', () => {
    getAccount();
    getBalance();
});

// for get balance
apiKey = "8GGSZWAZB6BFKW9X4U8Q1D27IWW5N5SFFR"
async function getBalance(){
    const res = await fetch(`https://api-optimistic.etherscan.io/api?module=account&action=balance&address=${currentAddress}&tag=latest&apikey=${apiKey}`)
    let b = await res.json()
    balance = Number(b.result)/ Math.pow(10,18)
    console.log(balance)
    console.log(currentAddress);
}

async function getAccount() {
    await getLogin()
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts);
    const account = accounts[0];
    showAccount.innerHTML = account;

    // show less address in button when connect
    const lessAccount = account.slice(0,5)+"...."+account.slice(37,42);
    ethereumButton.innerHTML = lessAccount;
}

createAccount.addEventListener('click',()=>{
    createAccount.classList.add('next');
    myAccount.innerHTML = "My Account"
    formCreate.style.display = "inline" 
    createYBC.classList.add("hide")
})

formCreate.addEventListener('submit',(e)=>{
    e.preventDefault()
    let name = username.value
    nameShow = name;
    if(name){
        console.log(name);
        username.value = ""
        formControl.style.display = "none"
        aboutAccount.style.opacity = "1"
        nameAcc.textContent = nameShow
        
        
        balanceAcc.textContent = currentBalance
    }
    else{
        alert("Please enter name")
    }
})

// when choose to something
depositBtn.addEventListener('click',()=>{
    // hide both when click
    withdrawBtn.classList.toggle("hide");
    transferBtn.classList.toggle("hide");

    // back to console
    depo.classList.toggle('hide')
    depoBack.classList.toggle('show');

    // hide and show console when click 
    depositConsole.classList.toggle('show')
    myAccount.innerHTML = "Deposit"
})

withdrawBtn.addEventListener('click', ()=>{
    // hide both when click
    depositBtn.classList.toggle("hide");
    transferBtn.classList.toggle("hide");

    // back to console
    withda.classList.toggle('hide')
    withBack.classList.toggle('show');    


    // hide and show console when click 
    withdrawConsole.classList.toggle('show')
    myAccount.innerHTML = "Withdraw"
})

transferBtn.addEventListener('click', ()=>{
    depositBtn.classList.toggle("hide");
    withdrawBtn.classList.toggle("hide");

    // back to console
    tran.classList.toggle('hide')
    tranBack.classList.toggle('show');        

    // hide and show console when click 
    transferConsole.classList.toggle('show')
    myAccount.innerHTML = "Transfer"
})

getData = () =>{
    let data = Number(localStorage.getItem('Balance'))
    console.log(data);
}

// get value to deposit
depositToCon.addEventListener('click', async (e)=>{
    e.preventDefault()
    if(depositIn.value > 0  && depositIn.value){
        depositAmount = depositIn.value;
        console.log(depositAmount);
    
        localStorage.setItem("Balance", depositAmount)
    
        deposit(depositAmount)
        depositIn.value = ""; 
    }
    else{
        alert("Please enter amount")
    }

})

async function deposit(amount){
    const rawTx = {
        to : lastAll,
        value : ethers.utils.parseEther(amount)
    }
    const tx = await signer.sendTransaction(rawTx);
    console.log(tx.hash);
    await tx.wait();

    console.log("transfer");
}

// get value to withdraw
withdrawBack.addEventListener('click', (e)=>{
    e.preventDefault()
    // check again when withdraw more deposit and more than 0
    if(withdrawOut.value > 0 && withdrawOut.value){
        withdrawAmount = withdrawOut.value;
        console.log(withdrawAmount);
        if(depositAmount >= withdrawAmount){
            withdrawVa(withdrawAmount)
            withdrawAmount.value = ""; 
        }
        else{
            console.log("Balance not enough");
        }
    }
    else{
        alert("Please enter amount")
    }
})

async function withdrawVa(amount){
    const ABI = ["function withdraw(uint _amount)"];
    const iface = new ethers.utils.Interface(ABI);
    const encodeData = iface.encodeFunctionData("withdraw", [ethers.utils.parseEther(amount)]);

    const tx = await signer.sendTransaction({
        to: lastAll,
        data: encodeData
    })

    console.log(tx.hash);
    await tx.wait();
}

// transfer fields
// submit address
submitAdd.addEventListener('click', (e)=>{
    e.preventDefault()
    if(addressTo.value){
        AddressSend = addressTo.value;
        console.log(AddressSend);
    }
    else{
        alert("Please enter address")
    }
  
})
// get value transfer
// submit address to transfer
transferTo.addEventListener('click', (e)=>{
    e.preventDefault()
    if(transferOut.value > 0){
        transferAmount = transferOut.value;
        console.log(transferAmount);
        transferToOther(transferAmount, AddressSend)
    }
    else{
        alert("Please enter amount")
    }
})

async function transferToOther(amount, receiver){
    const ABI = ["function sendToReceive(address _to, uint _amount)"];
    const iface = new ethers.utils.Interface(ABI);
    const encodeData = iface.encodeFunctionData("sendToReceive", [receiver, ethers.utils.parseEther(amount)]);

    const tx = await signer.sendTransaction({
        to: lastAll,
        data: encodeData
    })

    console.log(tx.hash);
    await tx.wait();
}
