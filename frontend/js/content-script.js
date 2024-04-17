let button = document.getElementById('html-cpy-btn');

const getHtml = () => {
    var html = document.getElementsByTagName('html')[0].innerHTML;
    return html;
}

if (button) {
    button.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                const firstTab = tabs[0];
                chrome.tabs.sendMessage(firstTab.id ?? -1, { message: 'copy-html-action' }, (response) => {
                    if (response) {
                        var xhr = new XMLHttpRequest();
                        document.querySelector('button').innerText = "Saving...";
                        document.querySelector('p').innerText = response;

                        xhr.open('POST', 'http://localhost:3000/save', true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({ response }));

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4 && xhr.status == 200) {
                                document.querySelector('button').innerText = "Saved in server!";
                            }
                        }

                        xhr.onerror = function () {
                            document.querySelector('button').innerText = "Error!";
                        }

                        xhr.onload = function () {
                            document.querySelector('button').innerText = "Saved in server!";
                        }

                        xhr.onprogress = function () {
                            document.querySelector('button').innerText = "Loading...";
                        }

                        xhr.ontimeout = function () {
                            document.querySelector('button').innerText = "Timeout!";
                        }
                    }

                });
            }

        });
    }
    );
}

chrome.runtime.onMessage.addListener(function (payload, sender, sendResponse) {
    if (payload.message === 'copy-html-action') {
        sendResponse(getHtml());
    }
});