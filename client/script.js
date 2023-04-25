import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 700);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function outputImage(element, imageUrl) {
  // create an HTML tag <img></img>
  let img = document.createElement('img');
  // add a src to img <img src="http:......"></img>
  img.src = imageUrl;
  // append img to the messageDiv aka element
  element.appendChild(img);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  //   const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
       <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

const handleTextSubmit = async (e) => {
  e.preventDefault();
  
  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();
  
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, '', uniqueId);

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  //   fetch data
  const response = await fetch('https://chatbot2-1yyi.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
      type: "text"
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = ' ';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = 'Something went wrong';
    alert(err);
  }
}

const handleImageSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // get user's stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  //   greetUser();
  form.reset();

  //   bot's stripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, '', uniqueId);

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  //   fetch data
  const response = await fetch('https://chatbot2-1yyi.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
      type: "image"
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = ' ';

  if (response.ok) {
    const data = await response.json();
    const imageUrl = data.bot;

    outputImage(messageDiv, imageUrl);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = 'Something went wrong';
    alert(err);
  }
};

function greetUser() {
  const greetingId = generateUniqueId();
  const greeting =
    'Wait! Before I answer your question... I am ChAtBoT! Below here is the answer to your question:';
  chatContainer.innerHTML += chatStripe(true, ' ', greetingId);

  const greetingDiv = document.getElementById(greetingId);
  typeText(greetingDiv, greeting);
}

form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleTextSubmit(e);
  }
});

document.getElementById('text').addEventListener('click', function (e) {
  handleTextSubmit(e);
});

document.getElementById('image').addEventListener('click', function (e) {
  handleImageSubmit(e);
 });
