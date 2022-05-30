let steps=0,timeout1,timeout2;
let stepsDes={0:'name',1:'shop',2:'username',3:'pass',4:'confirmPass',5:'businessInfo',6:'logo',7:'region',8:'phone',9:'package',10:'sell',11:'category'};
const fixedStepsDes={0:'name',1:'shop',2:'username',3:'pass',4:'confirmPass',5:'businessInfo',6:'logo',7:'region',8:'phone',9:'package',10:'sell',11:'category'};
const stepsDesWithoutOthersCategory={12:'people',13:'userEmails',14:'done'};
const stepsDesWithOthersCategory={12:'othersCategory',13:'people',14:'userEmails',15:'done'};
const incomingMsgs={shop:'What is the name of your shop?',logo:"Upload your shop's logo.",name:"Hi! 😄 Could you please share your full name? ",username:"Let’s get you a user name. Do you want LazyChat to generate a username for you? Or do you want to enter it your self?",pass:"Now enter a strong password you can remember.",confirmPass:'Please confirm your password again.',businessInfo:'Now let’s get to know about your business.',region:"Are you from Bangladesh or not?",phone:'Please enter your phone number',package:"Your account is almost ready. Which plan would you like to subscribe?",sell:"Where do you sell?",category:'What is your business category?',othersCategory:"What's your preferred business category?",people:'How many people work in your business?',userEmails:'Add other users to LazyChat. Enter emails of the users separated by a comma.',done:'Now your account is set! Now, let’s get your online business pumped.'};
const labels={shop:'eg The Sharee Store', name:'Full Name',username:'Username',pass:'Password',confirmPass:'Confirm Password',phone:'Phone Number',userEmails:'Enter emails',othersCategory:'Specify your product category'};
const storedMsgs={shop:'',logo:'',name:'',username:'Generated username',pass:'',confirmPass:'',businessInfo:'',region:'Yes',phone:'',package:'Starter',sell:'Facebook',category:'Choose an option',people:'Choose an option',userEmails:'',othersCategory:''};
const btnSkip=document.getElementById('btn-skip');
const btnDone=document.getElementById('btn-done');
const packageChanged=(e)=>{
    const elements=document.getElementsByName(e.id);
    elements.forEach(element=>{
        if(element.checked){
            storedMsgs[stepsDes[steps+'']]=element.id;
            console.log(element.id,stepsDes[steps+''])
            if(stepsDes[steps+'']==='region')
                labels[stepsDes[(steps+1)+'']]=element.id==='Yes' ? 'Enter phone number' : 'Enter Email';
        }
    })
}
const previousBtnLink=document.getElementById('btn-link');
const chatBody=document.getElementById('chat-body');
const btnNext=document.getElementById('btn-next');
const handleTextFieldChange=(e)=>{
    if(e.value.length || stepsDes[steps]==='phone') btnNext.disabled=false;
    else btnNext.disabled=true;
    storedMsgs[stepsDes[steps+'']]=e.value;
}
const handleImgRemove=()=>{
    const uploadedFileEl=document.querySelector(`#${chatBody.lastChild.id} .chat-input>#uploaded-file`);
    const attachmentForm=document.querySelector(`#${chatBody.lastChild.id} .chat-input>#attachmentForm`);
    uploadedFileEl.innerHTML='';
    const inputFile=document.getElementById('attachment-file');
    attachmentForm.className=attachmentForm.className.replace('d-none','d-inline-block');
    inputFile.value='';
    storedMsgs[stepsDes[steps+'']]='';
}
const uploadedImgShow=()=>`
    <div class="position-relative">
        <img src="${storedMsgs[stepsDes[steps+'']]}" alt='' class='uploaded-img'>
        <span class="position-absolute top-0 start-100 translate-middle badge bg-dark rounded-pill">
            <span class='close-btn' onclick="handleImgRemove()">x</span>
            <span class="visually-hidden">unread messages</span>
        </span>
    </div>`;
const handleAttachment=(e)=>{
    const ext=e.value.split('.').pop().toLowerCase();
    const errorMsgEl=document.querySelector(`#${chatBody.lastChild.id} .chat-input>.error-msg`);
    const uploadedFileEl=document.querySelector(`#${chatBody.lastChild.id} .chat-input>#uploaded-file`);
    const attachmentForm=document.querySelector(`#${chatBody.lastChild.id} .chat-input>#attachmentForm`);
    if(!(['png','jpg','jpeg'].includes(ext))){
        errorMsgEl.innerText='Not a valid image!';
    }
    else{ 
        errorMsgEl.innerText='';
        attachmentForm.className=attachmentForm.className.replace('d-inline-block','d-none');
        storedMsgs[stepsDes[steps+'']] = URL.createObjectURL(e.files[0]);
        uploadedFileEl.innerHTML=uploadedImgShow();
    }
}
const handleFormSubmit=(e)=>{
    e.preventDefault();
    if(!btnNext.disabled) handleNextBtnClick();
}
const togglePasswordVisibilty=(e)=>{
    const element=document.querySelector(`#outgoing-steps-${steps} .register-input`);
    if(e.target.className==='fas fa-eye'){
        e.target.className="fas fa-eye-slash";
        element.type='password';
    }
    else{ 
        e.target.className='fas fa-eye';
        element.type='text';
    }
    
}
const inputField=(placeholder,type)=>`
    <form onsubmit='handleFormSubmit(event)'>
        <div class="input-group">
            ${type==='password' ? `<span class="input-group-text" id="password-visibility-icon" onclick="togglePasswordVisibilty(event)"><i class="fas fa-eye-slash"></i></span>` : ``}
            <input type=${type} class="form-control form-control-sm register-input" placeholder="${placeholder}" oninput="handleTextFieldChange(this)" value="${storedMsgs[stepsDes[steps+'']]}" aria-describedby="password-visibility-icon" autocomplete='off'>
        </div>
        <div class="text-danger text-sm"></div>
    </form>`;
const attachmentField=()=>`
    <form id="attachmentForm" enctype="multipart/form-data" class="${"file-upload"+(storedMsgs[stepsDes[steps+'']].length ? " d-none" : " d-inline-block")}">
        <label for="attachment-file">
            <div class="d-flex align-items-center justify-content-center attachment-file-div me-2">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
        </label>
        <input type="file" name="file" id="attachment-file" class="d-none" oninput="handleAttachment(this)" accept="image/png, image/jpg, image/jpeg"/>
    </form>
    <div class="text-danger text-sm error-msg"></div>
    <div id='uploaded-file' class='me-2'>${storedMsgs[stepsDes[steps+'']].length ? uploadedImgShow() : ''}</div>`;
const radiosField=(radioName,radioLists)=>`
    <div class="btn-group me-2" id="${radioName}" onchange="packageChanged(this)">
        ${
            radioLists.map(id=>id===storedMsgs[stepsDes[steps+'']] ? `
                <input type="radio" class="btn-check" name="${radioName}" id="${id}" autocomplete="off" checked />
                <label class="btn btn-light btn-sm radios-btn" for="${id}">${id}</label>` : `
                <input type="radio" class="btn-check" name="${radioName}" id="${id}" autocomplete="off" />
                <label class="btn btn-light btn-sm radios-btn" for="${id}">${id}</label>`)
        }
    </div>`;
const handleUsernameChange=(e)=>{
    const usernameInput=document.querySelector(`#${chatBody.lastChild.id} .chat-input .username-input`);
    if(!e.checked){ 
        usernameInput.disabled=false;
        storedMsgs[stepsDes[steps+'']]=e.value;
    }
    else{ 
        usernameInput.disabled=true;
        usernameInput.value='Generated username';
        btnNext.disabled=false;
        storedMsgs[stepsDes[steps+'']]='Generated username';
    }
}
const usernameGenerator=(placeholder,type)=>`
    <div class="form-check form-switch mt-1 me-2">
        <input class="form-check-input" type="checkbox" role="switch" id="username-checkbox" ${storedMsgs[stepsDes[steps+'']]==='Generated username' ?`checked` : ``} oninput="handleUsernameChange(this)">
        <label class="form-check-label" for="username-checkbox">Use generated username</label>
    </div>
    <div>
        <input type="${type}" value="${storedMsgs[stepsDes[steps+'']]}" class="form-control form-control-sm username-input" placeholder="${placeholder}" oninput="handleTextFieldChange(this)"  ${storedMsgs[stepsDes[steps+'']]==='Generated username' ?`disabled` : ``}>
        <div class="text-danger text-sm"></div>
    </div>
    `;
const optionChange=(e)=>{
    if(e.value==='Choose an option') btnNext.disabled=true;
    else btnNext.disabled=false;
    storedMsgs[stepsDes[steps+'']]=e.value;
}
const selectField=(dropdownLists)=>`
    <select class="form-select form-select-sm" onchange="optionChange(this)">
        ${
            dropdownLists.map(id=>`
                <option ${id===storedMsgs[stepsDes[steps+'']] && `selected`} value='${id}'>${id}</option>`)
        }
    </select>
`
const outgoingMsgInputs=()=>{
    btnSkip.disabled=false;
    const outgoingMsg=`<div class="d-flex align-items-center flex-row-reverse my-2" id='outgoing-steps-${steps}'>
    <img src="1.jpg" alt="" class="outgoing-logo">`;
    if(storedMsgs[stepsDes[steps+'']]==='Choose an option') btnNext.disabled=true;
    else if(stepsDes[steps+'']==='logo' || stepsDes[steps+'']==='username' || stepsDes[steps+'']==='package' || stepsDes[steps+'']==='sell' || storedMsgs[stepsDes[steps+'']]?.length) btnNext.disabled=false;
    else if(storedMsgs[stepsDes[steps+'']]?.length===0) btnNext.disabled=true;
    if(stepsDes[steps+'']==='shop' || stepsDes[steps+'']==='name' || stepsDes[steps+'']==='username' || stepsDes[steps+'']==='pass' || stepsDes[steps+'']==='confirmPass' || stepsDes[steps+'']==='phone'|| stepsDes[steps+'']==='userEmails'|| stepsDes[steps+'']==='othersCategory'){
        const inputType=(stepsDes[steps+'']==='pass'||stepsDes[steps+'']==='confirmPass') ? 'password' : 'text';
        if(stepsDes[steps+'']==='username'){ 
            chatBody.innerHTML+=`${outgoingMsg}
                <div class="me-2 chat-input animate__animated animate__zoomIn animate__delay-.4s">
                    ${usernameGenerator(labels[stepsDes[steps+'']],inputType)}
                </div>
            </div>`;
        }
        else
            chatBody.innerHTML+=`${outgoingMsg}
                <div class="me-2 chat-input animate__animated animate__zoomIn animate__delay-.4s">
                ${inputField(labels[stepsDes[steps+'']],inputType)}
                </div>
            </div>`;
    }
    else if(stepsDes[steps+'']==='logo'){
        chatBody.innerHTML+=`${outgoingMsg}
                <div class='chat-input animate__animated animate__zoomIn animate__delay-.4s'>${attachmentField()}</div>
            </div>`;
    }
    else if(stepsDes[steps+'']==='package' || stepsDes[steps+'']==='sell' || stepsDes[steps+'']==='region'){
        let radioName,radioLists;
        if(stepsDes[steps+'']==='package'){ 
            radioName='package';
            radioLists=['Starter','Free trial'];
        }
        else if(stepsDes[steps+'']==='region'){
            radioName='region';
            radioLists=['Yes','No'];
        }    
        else{
            radioName='socialPlatform';
            radioLists=['Facebook', 'Instagram'];
        }
        chatBody.innerHTML+=`${outgoingMsg}
                <div class='chat-input animate__animated animate__zoomIn animate__delay-.4s'>${radiosField(radioName,radioLists)}</div>
            </div>`;
    }
    else if(stepsDes[steps+'']==='category' || stepsDes[steps+'']==='people'){
        const dropdownLists=stepsDes[steps+'']==='category' ? ['Choose an option','Apparel & Clothing','Beauty, Cosmetic & Personal Care','Grocery','Processed/Packaged Food','Restaurant/Cloud Kitchen','Electronics','Miscellaneous','Others'] : ['Choose an option','0-5','5-20','20-100','>=100']
        chatBody.innerHTML+=`${outgoingMsg}
                <div class='me-2 chat-input animate__animated animate__zoomIn animate__delay-.4s'>${selectField(dropdownLists)}</div>
            </div>`;
    }
}
const incomingMsgShow=()=>{
    chatBody.innerHTML+=`
    <div class="d-flex align-items-center my-1" id='incoming-steps-${steps}'>
        <img src="incoming-logo.png" alt="" class="incoming-logo">
        <div class="incoming-msg p-2 ms-2">${incomingMsgs[stepsDes[steps+'']]}</div>
    </div>`;
}
const msgLoader=()=>`<div class="typing">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    </div>`;
const handleDifferentMsgs=(nextClicked)=>{
    if(nextClicked){
        chatBody.innerHTML+=`
            <div class="d-flex align-items-center my-1" id='incoming-steps-${steps}'>
                <img src="incoming-logo.png" alt="" class="incoming-logo">
                <div class="chat-bubble ms-2 py-1 px-2">
                   ${msgLoader()}
                </div>
            </div>
            `;
        chatBody.scrollTo(document.getElementById(`incoming-steps-${steps}`).scrollHeight,chatBody.scrollHeight);
        timeout1=setTimeout(()=>{
            chatBody.removeChild(document.getElementById(`incoming-steps-${steps}`));
            incomingMsgShow();
            outgoingMsgInputs();
        },1400);
    }
    else{ 
        incomingMsgShow();
        outgoingMsgInputs();
        if(stepsDes[steps]==='businessInfo') handlePreviousBtnClick();
    }
}
const scrollHandler=(prevStep)=>{
    if(!prevStep){
        chatBody.scrollTo(document.getElementById(`incoming-steps-${steps}`).scrollHeight,chatBody.scrollHeight);
    } 
    else if(prevStep && stepsDes[(steps-1)+'']==='businessInfo') chatBody.scrollTo(document.getElementById(`incoming-steps-${steps-1}`).scrollHeight,chatBody.scrollHeight);
    else chatBody.scrollTo(document.getElementById(`outgoing-steps-${steps-1}`).scrollHeight,chatBody.scrollHeight);
}
const stepsMsgHandler=(prevStep=null,nextClicked=null)=>{
    if(prevStep) steps++;
    if(steps<=Object.keys(stepsDes).length-1) handleDifferentMsgs(nextClicked); 
    if(nextClicked){
        timeout2=setTimeout(()=>{
            scrollHandler(prevStep);
            if(stepsDes[steps+'']==='businessInfo') handleNextBtnClick();
        },1400);
    }
    else scrollHandler(prevStep);
}
const showPassword=(password,type)=>{
    if(type==='slash'){
        let returnedPassword='';
        for(let i=0;i<password.length;i++)
            returnedPassword+='*';
        return returnedPassword;
    }
    return password;
}
const msgSendHandler=()=>{
    const outgoingMsg=document.querySelector(`#${chatBody.lastChild.id} .chat-input`);
    if(outgoingMsg)
        outgoingMsg.className=outgoingMsg.className.replace('animate__animated animate__zoomIn animate__delay-.4s','');
    switch (stepsDes[steps+'']) {
        case 'shop':
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2">${storedMsgs[stepsDes[steps+'']]}</div>`;
            break;
        case 'logo':
            if(storedMsgs[stepsDes[steps+'']]?.length)
                outgoingMsg.innerHTML=`<div class="me-2">
                <img src="${storedMsgs[stepsDes[steps+'']]}" alt='' class='uploaded-img'></div>`;
            else outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">Let's skip this for now.</div>`;
            break;
        case 'name':
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2">${storedMsgs[stepsDes[steps+'']]}</div>`;
            chatBody.innerHTML+=`
            <div class="d-flex align-items-center my-1" id='incoming-steps-${steps}_1'>
                <img src="incoming-logo.png" alt="" class="incoming-logo">
                <div class="incoming-msg p-2 ms-2">Hello ${storedMsgs[stepsDes[steps+'']]} 👋, Hope you are having a great day!</div>
            </div>`;
            break;
        case 'username':
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2">Your username is${storedMsgs[stepsDes[steps+'']]}.</div>`;
            break;
        case 'pass':
            const passwordVisibilityIcon=document.querySelector(`#password-visibility-icon i`).className.split('-').pop();
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2">${showPassword(storedMsgs[stepsDes[steps+'']],passwordVisibilityIcon)}</div>`;
            chatBody.innerHTML+=`
            <div class="d-flex align-items-center my-1" id='incoming-steps-${steps}_1'>
                <img src="incoming-logo.png" alt="" class="incoming-logo">
                <div class="incoming-msg p-2 ms-2">Great, Strong password 💪</div>
            </div>`;
            break;
        case 'confirmPass':
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2">Awesome! Your account is now secured.</div>`;
            break;
        case 'phone': 
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">${storedMsgs[stepsDes[steps+'']].length ? storedMsgs[stepsDes[steps+'']] : `Let's skip this for now.`}</div>`;
            break;
        case 'userEmails':
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">${storedMsgs[stepsDes[steps+'']].length ? `You added ${storedMsgs[stepsDes[steps+'']].split(',').length} users. Ask them to check their respective emails. A mail has been sent with their login credentials.` : `Let's skip this for now.`} 
            </div>`;
            break;
        case 'category':
            if(storedMsgs[stepsDes[steps+'']]==='Others')
                stepsDes={...fixedStepsDes,...stepsDesWithOthersCategory};
            else stepsDes={...fixedStepsDes,...stepsDesWithoutOthersCategory};
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">${storedMsgs[stepsDes[steps+'']].length ? storedMsgs[stepsDes[steps+'']] : `Let's skip this for now.`}</div>`;
            break;
        case 'people':
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">${storedMsgs[stepsDes[steps+'']].length ? storedMsgs[stepsDes[steps+'']] : `Let's skip this for now.`}</div>`;
            break;
        case 'region':
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">${storedMsgs[stepsDes[steps+'']]}</div>`;
            break;
        case 'package':
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">${storedMsgs[stepsDes[steps+'']]}</div>`;
            break;
        case 'sell':
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">${storedMsgs[stepsDes[steps+'']]}</div>`;
            break;
        default:
            break;
    }
}
stepsMsgHandler(null,true);
const handleNextBtnClick=()=>{
    if(steps<Object.keys(stepsDes).length){
        btnNext.disabled=true;
        btnSkip.disabled=true;
        msgSendHandler();
        stepsMsgHandler(true,true);
        if(stepsDes[steps+'']==='logo' || stepsDes[steps+'']==='category' || stepsDes[steps+'']==='people' || stepsDes[steps+'']==='userEmails' || (stepsDes[steps+'']==='phone' && storedMsgs[stepsDes[(steps-1)+'']]==='Yes')) btnSkip.className=btnSkip.className.replace(' d-none','');
        else if(!btnSkip.className.includes('d-none')) btnSkip.className+=' d-none';
        if(steps) previousBtnLink.className='';
        if(steps>Object.keys(stepsDes).length-1) btnNext.className+=' d-none';
        else btnNext.className=btnNext.className.replace(' d-none',''); 
        if(stepsDes[steps+'']==='done') {
            btnNext.className+=' d-none';
            btnDone.className=btnDone.className.replace(' d-none','');
        }
    } 
}
btnNext.onclick=handleNextBtnClick;
const handlePreviousBtnClick=()=>{
    if(timeout1) clearTimeout(timeout1);
    if(timeout2) clearTimeout(timeout2);
    if(steps<Object.keys(stepsDes).length){
        chatBody.removeChild(document.getElementById(`incoming-steps-${steps}`));
        if(document.getElementById(`outgoing-steps-${steps}`)) chatBody.removeChild(document.getElementById(`outgoing-steps-${steps}`));
        chatBody.removeChild(document.getElementById(`incoming-steps-${steps-1}`));
        if(document.getElementById(`outgoing-steps-${steps-1}`))
            chatBody.removeChild(document.getElementById(`outgoing-steps-${steps-1}`));
        if((stepsDes[(steps-1)+'']==='name') || (stepsDes[(steps-1)+'']==='pass')) chatBody.removeChild(document.getElementById(`incoming-steps-${steps-1}_1`));
        steps--;
    }
    else{
        steps--;
        chatBody.removeChild(document.getElementById(`incoming-steps-${steps}`));
        chatBody.removeChild(document.getElementById(`outgoing-steps-${steps}`));
        btnNext.className=btnNext.className.replace(' d-none','');
    }
    if(stepsDes[steps+'']==='logo' || stepsDes[steps+'']==='category' || stepsDes[steps+'']==='people' || stepsDes[steps+'']==='userEmails' || (stepsDes[steps+'']==='phone' && storedMsgs[stepsDes[(steps-1)+'']]==='Yes')) btnSkip.className=btnSkip.className.replace(' d-none','');
    else if(!btnSkip.className.includes('d-none')) btnSkip.className+=' d-none';
    if(!steps) previousBtnLink.className='d-none';
    if(stepsDes[(steps+1)+'']==='done') {
        btnDone.className+=' d-none';
        btnNext.className=btnNext.className.replace(' d-none','');
    }
    stepsMsgHandler();
}
previousBtnLink.onclick=handlePreviousBtnClick;
btnSkip.onclick=()=>{
    if(stepsDes[steps+'']==='logo') {
        const inputFile=document.getElementById('attachment-file');
        inputFile.value='';
    }
    storedMsgs[stepsDes[steps+'']]='';
    handleNextBtnClick();
}
window.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if(!btnNext.disabled) handleNextBtnClick();
    }
});
