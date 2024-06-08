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

                        xhr.open('POST', 'http://localhost:8007/api/send-resume/get-clean-resume-text', true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({ resume: response }));

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4 && xhr.status == 200) {
                                navigator.clipboard.writeText(
                                    xhr.responseText
                                ).then(() => {
                                    document.querySelector('button').innerText = "Copied!";
                                }).catch((e) => {
                                    document.querySelector('button').innerText = "Error!";
                                });
                                document.querySelector('p').innerText = xhr.responseText;
                                document.querySelector('button').innerText = "Saved in server!";
                                setTimeout(() => {
                                    document.querySelector('button').innerText = "Copy HTML";
                                }, 2000);
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