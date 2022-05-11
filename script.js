let steps=0,timeout1,timeout2;
const incomingMsgs=['What is the name of your shop?',"Upload your shop's logo.","What is your full name? ","Would you like to keep username generated from shop name as user name or change it?","Now enter a strong password you can remember.","Enter your business phone number","Your account is almost ready. Which plan would you like to subscribe?","Where do you sell?"];
const labels={0:'eg The Sharee Store', 2:'Full Name',3:'Username',4:'Password',5:'Phone Number'};
const storedMsgs=['','','','Generated username','','','Starter','Facebook'];
const btnSkip=document.getElementById('btn-skip');
const packageChanged=(e)=>{
    const elements=document.getElementsByName(e.id);
    elements.forEach(element=>{
        if(element.checked) storedMsgs[steps]=element.id;
    })
}
const previousBtnLink=document.getElementById('btn-link');
const chatBody=document.getElementById('chat-body');
const btnNext=document.getElementById('btn-next');
const handleTextFieldChange=(e)=>{
    if(e.value.length || steps===5) btnNext.disabled=false;
    else btnNext.disabled=true;
    storedMsgs[steps]=e.value;
}
const handleImgRemove=()=>{
    const uploadedFileEl=document.querySelector(`#${chatBody.lastChild.id} .chat-input>#uploaded-file`);
    const attachmentForm=document.querySelector(`#${chatBody.lastChild.id} .chat-input>#attachmentForm`);
    uploadedFileEl.innerHTML='';
    const inputFile=document.getElementById('attachment-file');
    attachmentForm.className=attachmentForm.className.replace('d-none','d-inline-block');
    inputFile.value='';
    storedMsgs[steps]='';
}
const uploadedImgShow=()=>`
    <div class="position-relative">
        <img src="${storedMsgs[steps]}" alt='' class='uploaded-img'>
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
        storedMsgs[steps] = URL.createObjectURL(e.files[0]);
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
            <input type=${type} class="form-control form-control-sm register-input" placeholder="${placeholder}" oninput="handleTextFieldChange(this)" value="${storedMsgs[steps]}" aria-describedby="password-visibility-icon" autocomplete='off'>
        </div>
        <div class="text-danger text-sm"></div>
    </form>`;
const attachmentField=()=>`
    <form id="attachmentForm" enctype="multipart/form-data" class="${"file-upload"+(storedMsgs[steps].length ? " d-none" : " d-inline-block")}">
        <label for="attachment-file">
            <div class="d-flex align-items-center justify-content-center attachment-file-div me-2">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
        </label>
        <input type="file" name="file" id="attachment-file" class="d-none" oninput="handleAttachment(this)"/>
    </form>
    <div class="text-danger text-sm error-msg"></div>
    <div id='uploaded-file' class='me-2'>${storedMsgs[steps].length ? uploadedImgShow() : ''}</div>`;
const radiosField=(radioName,radioLists)=>`
    <div class="btn-group me-2" id="${radioName}" onchange="packageChanged(this)">
        ${
            radioLists.map(id=>id===storedMsgs[steps] ? `
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
        storedMsgs[steps]=e.value;
    }
    else{ 
        usernameInput.disabled=true;
        usernameInput.value='Generated username';
        btnNext.disabled=false;
        storedMsgs[steps]='Generated username';
    }
}
const usernameGenerator=(placeholder,type)=>`
    <div>
        <input type="${type}" value="${storedMsgs[steps]}" class="form-control form-control-sm username-input" placeholder="${placeholder}" oninput="handleTextFieldChange(this)"  ${storedMsgs[steps]==='Generated username' ?`disabled` : ``}>
        <div class="text-danger text-sm"></div>
    </div>
    <div class="form-check form-switch mt-1 me-2">
        <input class="form-check-input" type="checkbox" role="switch" id="username-checkbox" ${storedMsgs[steps]==='Generated username' ?`checked` : ``} oninput="handleUsernameChange(this)">
        <label class="form-check-label" for="username-checkbox">Use generated username</label>
    </div>`;
const outgoingMsgInputs=()=>{
    btnSkip.disabled=false;
    const outgoingMsg=`<div class="d-flex align-items-center flex-row-reverse my-2" id='outgoing-steps-${steps}'>
    <img src="1.jpg" alt="" class="outgoing-logo">`;
    if(steps===1 || steps===3 || steps>=5 || storedMsgs[steps].length) btnNext.disabled=false;
    else if(storedMsgs[steps].length===0) btnNext.disabled=true;
    if(steps<=5 && steps!==1){
        const inputType=steps===4 ? 'password' : 'text';
        if(steps===3){ 
            chatBody.innerHTML+=`${outgoingMsg}
                <div class="me-2 chat-input animate__animated animate__zoomIn animate__delay-.4s">
                    ${usernameGenerator(labels[steps],inputType)}
                </div>
            </div>`;
        }
        else
            chatBody.innerHTML+=`${outgoingMsg}
                <div class="me-2 chat-input animate__animated animate__zoomIn animate__delay-.4s">
                ${inputField(labels[steps],inputType)}
                </div>
            </div>`;
    }
    else if(steps===1){
        chatBody.innerHTML+=`${outgoingMsg}
                <div class='chat-input animate__animated animate__zoomIn animate__delay-.4s'>${attachmentField()}</div>
            </div>`;
    }
    else if(steps===6 || steps===7){
        const radioName=steps===6 ? 'package' : 'socialPlatform';
        const radioLists=steps===6 ? ['Starter','Free trial'] : ['Facebook', 'Instagram'];
        chatBody.innerHTML+=`${outgoingMsg}
                <div class='chat-input animate__animated animate__zoomIn animate__delay-.4s'>${radiosField(radioName,radioLists)}</div>
            </div>`;
    }
}
const incomingMsgShow=()=>{
    chatBody.innerHTML+=`
    <div class="d-flex align-items-center my-1" id='incoming-steps-${steps}'>
        <img src="incoming-logo.png" alt="" class="incoming-logo">
        <div class="incoming-msg p-2 ms-2">${incomingMsgs[steps]}</div>
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
    }
}
const scrollHandler=(prevStep)=>{
    if(prevStep) chatBody.scrollTo(document.getElementById(`outgoing-steps-${steps-1}`).scrollHeight,chatBody.scrollHeight);
    else chatBody.scrollTo(document.getElementById(`incoming-steps-${steps}`).scrollHeight,chatBody.scrollHeight);
}
const stepsMsgHandler=(prevStep=null,nextClicked=null)=>{
    if(prevStep) steps++;
    if(steps<=7) handleDifferentMsgs(nextClicked); 
    if(nextClicked){
        timeout2=setTimeout(()=>{
            scrollHandler(prevStep);
        },1400);
    }
    else scrollHandler(prevStep);
}
const showPassword=(password,type)=>{
    if(type==='slash'){
        let returnedPassword='';
        for(let i=0;i<password.length;i++)
            returnedPassword+='.';
        return returnedPassword;
    }
    return password;
}
const msgSendHandler=()=>{
    const outgoingMsg=document.querySelector(`#${chatBody.lastChild.id} .chat-input`);
    outgoingMsg.className=outgoingMsg.className.replace(' animate__animated animate__zoomIn animate__delay-.4s','');
    switch (steps) {
        case 0:
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2">${storedMsgs[steps]}</div>`;
            break;
        case 1:
            if(storedMsgs[steps]?.length)
                outgoingMsg.innerHTML=`<div class="me-2">
                <img src="${storedMsgs[steps]}" alt='' class='uploaded-img'></div>`;
            else outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">Let's skip this for now.</div>`;
            break;
        case 2:
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2">${storedMsgs[steps]}</div>`;
            chatBody.innerHTML+=`
            <div class="d-flex align-items-center my-1" id='incoming-steps-${steps}_1'>
                <img src="incoming-logo.png" alt="" class="incoming-logo">
                <div class="incoming-msg p-2 ms-2">Hello ${storedMsgs[steps]}, nice to meet you.</div>
            </div>`;
            break;
        case 3:
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2">${storedMsgs[steps]}.</div>`;
            break;
        case 4:
            const passwordVisibilityIcon=document.querySelector(`#password-visibility-icon i`).className.split('-').pop();
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2">${showPassword(storedMsgs[steps],passwordVisibilityIcon)}</div>`;
            chatBody.innerHTML+=`
            <div class="d-flex align-items-center my-1" id='incoming-steps-${steps}_1'>
                <img src="incoming-logo.png" alt="" class="incoming-logo">
                <div class="incoming-msg p-2 ms-2">Nice, strong password!</div>
            </div>`;
            break;
        case 5: 
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">${storedMsgs[steps].length ? `${storedMsgs[steps]}` : `Let's skip this for now.`}</div>`;
            break;
        case 6:
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">${storedMsgs[steps]}</div>`;
            break;
        case 7:
            outgoingMsg.innerHTML=`<div class="outgoing-msg p-2 me-2">${storedMsgs[steps]}</div>`;
            break;
        default:
            break;
    }
}
stepsMsgHandler(null,true);
const handleNextBtnClick=()=>{
    if(steps<8){
        btnNext.disabled=true;
        btnSkip.disabled=true;
        msgSendHandler();
        stepsMsgHandler(true,true);
        if(steps===1 || steps===5) btnSkip.className=btnSkip.className.replace(' d-none','');
        else if(!btnSkip.className.includes('d-none')) btnSkip.className+=' d-none';
        if(steps) previousBtnLink.className='';
        if(steps>7) btnNext.className+=' d-none';
        else btnNext.className=btnNext.className.replace(' d-none',''); 
    } 
}
btnNext.onclick=handleNextBtnClick;
previousBtnLink.onclick=()=>{
    if(timeout1) clearTimeout(timeout1);
    if(timeout2) clearTimeout(timeout2);
    if(steps<8){
        chatBody.removeChild(document.getElementById(`incoming-steps-${steps}`));
        if(document.getElementById(`outgoing-steps-${steps}`)) chatBody.removeChild(document.getElementById(`outgoing-steps-${steps}`));
        chatBody.removeChild(document.getElementById(`incoming-steps-${steps-1}`));
        chatBody.removeChild(document.getElementById(`outgoing-steps-${steps-1}`));
        if((steps-1===2) || (steps-1===4)) chatBody.removeChild(document.getElementById(`incoming-steps-${steps-1}_1`));
        steps--;
    }
    else{
        steps--;
        chatBody.removeChild(document.getElementById(`incoming-steps-${steps}`));
        chatBody.removeChild(document.getElementById(`outgoing-steps-${steps}`));
        btnNext.className=btnNext.className.replace(' d-none','');
    }
    if(steps===1 || steps===5) btnSkip.className=btnSkip.className.replace(' d-none','');
    else if(!btnSkip.className.includes('d-none')) btnSkip.className+=' d-none';
    if(!steps) previousBtnLink.className='d-none';
    stepsMsgHandler();
}
btnSkip.onclick=()=>{
    if(steps===1) {
        const inputFile=document.getElementById('attachment-file');
        inputFile.value='';
    }
    storedMsgs[steps]='';
    handleNextBtnClick();
}
window.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if(!btnNext.disabled) handleNextBtnClick();
    }
});
